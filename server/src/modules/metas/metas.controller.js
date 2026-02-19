import { pool } from "../../acceso_datos/db.js";

// GET /metas?planId=1&estado=en_progreso
export const getMetas = async (req, res) => {
  try {
    const { planId, estado } = req.query;

    const where = ["usuario_id = ?"];
    const params = [req.user.id];

    if (planId !== undefined) {
      where.push("plan_id = ?");
      params.push(Number(planId));
    }

    if (estado !== undefined) {
      where.push("estado = ?");
      params.push(String(estado));
    }

    const sql = `
      SELECT *
      FROM metas_personales
      WHERE ${where.join(" AND ")}
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /metas/:id
export const getMetaById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM metas_personales WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Meta no encontrada" });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /metas
export const createMeta = async (req, res) => {
  try {
    const {
      plan_id,
      titulo,
      descripcion = null,
      fecha_objetivo = null,
      estado = "pendiente",
      progreso_pct = 0,
    } = req.body;

    if (!plan_id || !titulo) {
      return res.status(400).json({ message: "Campos obligatorios: plan_id, titulo" });
    }

    const prog = Number(progreso_pct);
    if (!Number.isFinite(prog) || prog < 0 || prog > 100) {
      return res.status(400).json({ message: "progreso_pct debe estar entre 0 y 100" });
    }

    const [r] = await pool.query(
      `INSERT INTO metas_personales
       (usuario_id, plan_id, titulo, descripcion, fecha_objetivo, estado, progreso_pct)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, Number(plan_id), titulo, descripcion, fecha_objetivo, String(estado), prog]
    );

    const [rows] = await pool.query(
      "SELECT * FROM metas_personales WHERE id = ? AND usuario_id = ?",
      [r.insertId, req.user.id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear la meta:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /metas/:id
export const updateMeta = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const allowed = ["plan_id", "titulo", "descripcion", "fecha_objetivo", "estado", "progreso_pct"];
    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (data.plan_id !== undefined) data.plan_id = Number(data.plan_id);

    if (data.progreso_pct !== undefined) {
      const prog = Number(data.progreso_pct);
      if (!Number.isFinite(prog) || prog < 0 || prog > 100) {
        return res.status(400).json({ message: "progreso_pct debe estar entre 0 y 100" });
      }
      data.progreso_pct = prog;
    }

    const [r] = await pool.query(
      "UPDATE metas_personales SET ? WHERE id = ? AND usuario_id = ?",
      [data, id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Meta no encontrada" });

    const [rows] = await pool.query(
      "SELECT * FROM metas_personales WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /metas/:id/estado  { estado: "..." }
export const patchMetaEstado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!estado) return res.status(400).json({ message: "estado es obligatorio" });

    const [r] = await pool.query(
      "UPDATE metas_personales SET estado = ? WHERE id = ? AND usuario_id = ?",
      [String(estado), id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Meta no encontrada" });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /metas/:id/progreso  { progreso_pct: 0..100 }
export const patchMetaProgreso = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const prog = Number(req.body?.progreso_pct);

    if (!Number.isFinite(prog) || prog < 0 || prog > 100) {
      return res.status(400).json({ message: "progreso_pct debe estar entre 0 y 100" });
    }

    const [r] = await pool.query(
      "UPDATE metas_personales SET progreso_pct = ? WHERE id = ? AND usuario_id = ?",
      [prog, id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Meta no encontrada" });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /metas/:id
export const deleteMeta = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query(
      "DELETE FROM metas_personales WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "No se encontró la meta" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
