import { pool } from "../../acceso_datos/db.js";

// GET /inscripciones?planId=1&estado=en_progreso
export const getInscripciones = async (req, res) => {
  try {
    const { planId, estado } = req.query;

    const where = ["i.usuario_id = ?"];
    const params = [req.user.id];

    if (planId !== undefined) {
      where.push("i.plan_id = ?");
      params.push(Number(planId));
    }

    if (estado !== undefined) {
      where.push("i.estado = ?");
      params.push(String(estado));
    }

    const sql = `
      SELECT
        i.*,
        c.nombre AS curso_nombre,
        c.proveedor AS curso_proveedor,
        c.tipo AS curso_tipo,
        c.costo_estimado AS curso_costo_estimado,
        c.requiere_apoyo AS curso_requiere_apoyo
      FROM inscripciones_curso i
      JOIN cursos c ON c.id = i.curso_id
      WHERE ${where.join(" AND ")}
      ORDER BY i.id DESC
    `;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /inscripciones/:id
export const getInscripcionById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      `SELECT
         i.*,
         c.nombre AS curso_nombre,
         c.proveedor AS curso_proveedor,
         c.tipo AS curso_tipo,
         c.costo_estimado AS curso_costo_estimado,
         c.requiere_apoyo AS curso_requiere_apoyo
       FROM inscripciones_curso i
       JOIN cursos c ON c.id = i.curso_id
       WHERE i.id = ? AND i.usuario_id = ?`,
      [id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Inscripción no encontrada" });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /inscripciones
export const createInscripcion = async (req, res) => {
  try {
    const {
      curso_id,
      plan_id,
      estado = "pendiente",
      fecha_inicio = null,
      fecha_fin = null,
      horas_invertidas = null,
    } = req.body;

    if (!curso_id || !plan_id) {
      return res.status(400).json({ message: "Campos obligatorios: curso_id, plan_id" });
    }

    const [r] = await pool.query(
      `INSERT INTO inscripciones_curso
       (curso_id, usuario_id, plan_id, estado, fecha_inicio, fecha_fin, horas_invertidas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(curso_id),
        req.user.id,
        Number(plan_id),
        String(estado),
        fecha_inicio,
        fecha_fin,
        horas_invertidas === null ? null : Number(horas_invertidas),
      ]
    );

    const [rows] = await pool.query(
      `SELECT
         i.*,
         c.nombre AS curso_nombre,
         c.proveedor AS curso_proveedor,
         c.tipo AS curso_tipo,
         c.costo_estimado AS curso_costo_estimado,
         c.requiere_apoyo AS curso_requiere_apoyo
       FROM inscripciones_curso i
       JOIN cursos c ON c.id = i.curso_id
       WHERE i.id = ? AND i.usuario_id = ?`,
      [r.insertId, req.user.id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear la inscripción:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /inscripciones/:id
export const updateInscripcion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const allowed = ["curso_id", "plan_id", "estado", "fecha_inicio", "fecha_fin", "horas_invertidas"];
    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (data.curso_id !== undefined) data.curso_id = Number(data.curso_id);
    if (data.plan_id !== undefined) data.plan_id = Number(data.plan_id);
    if (data.horas_invertidas !== undefined && data.horas_invertidas !== null) {
      data.horas_invertidas = Number(data.horas_invertidas);
    }

    const [r] = await pool.query(
      "UPDATE inscripciones_curso SET ? WHERE id = ? AND usuario_id = ?",
      [data, id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Inscripción no encontrada" });

    // devuelve actualizado
    const [rows] = await pool.query(
      `SELECT
         i.*,
         c.nombre AS curso_nombre,
         c.proveedor AS curso_proveedor,
         c.tipo AS curso_tipo,
         c.costo_estimado AS curso_costo_estimado,
         c.requiere_apoyo AS curso_requiere_apoyo
       FROM inscripciones_curso i
       JOIN cursos c ON c.id = i.curso_id
       WHERE i.id = ? AND i.usuario_id = ?`,
      [id, req.user.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /inscripciones/:id/estado  { estado: "en_progreso" }
export const patchInscripcionEstado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!estado) return res.status(400).json({ message: "estado es obligatorio" });

    const [r] = await pool.query(
      "UPDATE inscripciones_curso SET estado = ? WHERE id = ? AND usuario_id = ?",
      [String(estado), id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Inscripción no encontrada" });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /inscripciones/:id/horas  { horas_invertidas: 10 }
export const patchInscripcionHoras = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const horas = req.body?.horas_invertidas;

    if (horas === undefined || horas === null) {
      return res.status(400).json({ message: "horas_invertidas es obligatorio" });
    }

    const n = Number(horas);
    if (!Number.isFinite(n) || n < 0) {
      return res.status(400).json({ message: "horas_invertidas inválido" });
    }

    const [r] = await pool.query(
      "UPDATE inscripciones_curso SET horas_invertidas = ? WHERE id = ? AND usuario_id = ?",
      [n, id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Inscripción no encontrada" });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /inscripciones/:id
export const deleteInscripcion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query(
      "DELETE FROM inscripciones_curso WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Inscripción no encontrada" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
