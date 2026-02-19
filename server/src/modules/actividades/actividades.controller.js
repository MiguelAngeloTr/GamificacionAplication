import { pool } from "../../acceso_datos/db.js";

// GET /actividades?usuarioId&planId&estado&from&to
export const getActividades = async (req, res) => {
  try {
    // Simple y seguro: por defecto solo el usuario autenticado
    const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : req.user.id;

    // Para mantenerlo simple: no permitir consultar otros usuarios (luego lo abres por rol)
    if (usuarioId !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para ver actividades de otro usuario" });
    }

    const { planId, estado, from, to } = req.query;

    const where = ["usuario_id = ?"];
    const params = [usuarioId];

    if (planId !== undefined) {
      where.push("plan_id = ?");
      params.push(Number(planId));
    }

    if (estado !== undefined) {
      where.push("estado = ?");
      params.push(Number(estado)); // 0|1
    }

    // Filtramos por fecha "due": fecha_final si existe, si no fecha_inicio
    if (from) {
      where.push("COALESCE(fecha_final, fecha_inicio) >= ?");
      params.push(from); // YYYY-MM-DD
    }

    if (to) {
      where.push("COALESCE(fecha_final, fecha_inicio) <= ?");
      params.push(to); // YYYY-MM-DD
    }

    const sql = `
      SELECT *
      FROM actividades
      WHERE ${where.join(" AND ")}
      ORDER BY COALESCE(fecha_final, fecha_inicio) ASC, id DESC
    `;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /actividades/:id
export const getActividad = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM actividades WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Actividad no encontrada" });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /actividades
export const createActividad = async (req, res) => {
  try {
    const {
      nombre,
      descripcion = null,
      fecha_inicio,
      fecha_final = null,
      tipo,
      estado = 0, // 0 pendiente, 1 completada
      archivo = null,
      plan_id,
    } = req.body;

    // Tu BD exige plan_id NOT NULL y fecha_inicio NOT NULL
    if (!nombre || !tipo || !fecha_inicio || plan_id == null) {
      return res.status(400).json({
        message: "Campos obligatorios: nombre, tipo, fecha_inicio, plan_id",
      });
    }

    const [r] = await pool.query(
      `INSERT INTO actividades
       (nombre, estado, descripcion, fecha_inicio, fecha_final, tipo, archivo, usuario_id, plan_id)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [nombre, Number(estado), descripcion, fecha_inicio, fecha_final, tipo, archivo, req.user.id, Number(plan_id)]
    );

    const [rows] = await pool.query(
      "SELECT * FROM actividades WHERE id = ? AND usuario_id = ?",
      [r.insertId, req.user.id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /actividades/:id
export const updateActividad = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Whitelist simple: solo lo que se puede actualizar
    const allowed = [
      "nombre",
      "descripcion",
      "fecha_inicio",
      "fecha_final",
      "tipo",
      "estado",
      "archivo",
      "plan_id",
    ];

    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    // Tu BD exige plan_id NOT NULL si lo envían
    if (data.plan_id === null) {
      return res.status(400).json({ message: "plan_id no puede ser null" });
    }

    const [r] = await pool.query(
      "UPDATE actividades SET ? WHERE id = ? AND usuario_id = ?",
      [data, id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Actividad no encontrada" });

    const [rows] = await pool.query(
      "SELECT * FROM actividades WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /actividades/:id/estado
export const patchActividadEstado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (estado !== 0 && estado !== 1 && estado !== "0" && estado !== "1") {
      return res.status(400).json({ message: "estado debe ser 0 o 1" });
    }

    const [r] = await pool.query(
      "UPDATE actividades SET estado = ? WHERE id = ? AND usuario_id = ?",
      [Number(estado), id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Actividad no encontrada" });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /actividades/:id/presupuesto
export const getActividadPresupuesto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Verifica dueño de la actividad
    const [act] = await pool.query(
      "SELECT id FROM actividades WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );
    if (act.length === 0) return res.status(404).json({ message: "Actividad no encontrada" });

    const [rows] = await pool.query(
      "SELECT * FROM presupuestos WHERE actividad_id = ?",
      [id]
    );

    return res.json(rows[0] ?? null);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /actividades/:id/presupuesto  (1:1 -> upsert)
export const upsertActividadPresupuesto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const costo = Number(req.body?.costo);

    if (!Number.isFinite(costo) || costo < 0) {
      return res.status(400).json({ message: "costo inválido" });
    }

    // Verifica dueño de la actividad
    const [act] = await pool.query(
      "SELECT id FROM actividades WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );
    if (act.length === 0) return res.status(404).json({ message: "Actividad no encontrada" });

    // 1 query: crea o actualiza
    await pool.query(
      `INSERT INTO presupuestos (costo, actividad_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE costo = VALUES(costo)`,
      [costo, id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM presupuestos WHERE actividad_id = ?",
      [id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
