import { pool } from "../../acceso_datos/db.js";

// GET /objetivos?planId=1&activo=0|1
export const getObjetivos = async (req, res) => {
  try {
    const { planId, activo } = req.query;

    const where = ["creado_por_usuario_id = ?"];
    const params = [req.user.id];

    if (planId !== undefined) {
      where.push("plan_id = ?");
      params.push(Number(planId));
    }

    if (activo !== undefined) {
      where.push("activo = ?");
      params.push(Number(activo)); // 0|1
    }

    const sql = `
      SELECT *
      FROM objetivos_estrategicos
      WHERE ${where.join(" AND ")}
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// (Opcional) GET /planes/:planId/objetivos  (si prefieres anidar por plan)
export const getObjetivosByPlan = async (req, res) => {
  try {
    const planId = Number(req.params.planId);

    const [rows] = await pool.query(
      `SELECT *
       FROM objetivos_estrategicos
       WHERE plan_id = ? AND creado_por_usuario_id = ?
       ORDER BY id DESC`,
      [planId, req.user.id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /objetivos/:id
export const getObjetivoById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM objetivos_estrategicos WHERE id = ? AND creado_por_usuario_id = ?",
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Objetivo no encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /objetivos
export const createObjetivo = async (req, res) => {
  try {
    const { plan_id, titulo, descripcion = null, activo = 1 } = req.body;

    if (!plan_id || !titulo) {
      return res.status(400).json({ message: "Campos obligatorios: plan_id, titulo" });
    }

    const [r] = await pool.query(
      `INSERT INTO objetivos_estrategicos
       (plan_id, creado_por_usuario_id, titulo, descripcion, activo)
       VALUES (?, ?, ?, ?, ?)`,
      [Number(plan_id), req.user.id, titulo, descripcion, Number(activo)]
    );

    const [rows] = await pool.query(
      "SELECT * FROM objetivos_estrategicos WHERE id = ? AND creado_por_usuario_id = ?",
      [r.insertId, req.user.id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear el objetivo:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /objetivos/:id
export const updateObjetivo = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Whitelist simple
    const allowed = ["plan_id", "titulo", "descripcion", "activo"];
    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (data.plan_id !== undefined) data.plan_id = Number(data.plan_id);
    if (data.activo !== undefined) data.activo = Number(data.activo);

    const [r] = await pool.query(
      "UPDATE objetivos_estrategicos SET ? WHERE id = ? AND creado_por_usuario_id = ?",
      [data, id, req.user.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Objetivo no encontrado" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM objetivos_estrategicos WHERE id = ? AND creado_por_usuario_id = ?",
      [id, req.user.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /objetivos/:id/activo  { activo: 0|1 }
export const patchObjetivoActivo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body;

    if (activo !== 0 && activo !== 1 && activo !== "0" && activo !== "1") {
      return res.status(400).json({ message: "activo debe ser 0 o 1" });
    }

    const [r] = await pool.query(
      "UPDATE objetivos_estrategicos SET activo = ? WHERE id = ? AND creado_por_usuario_id = ?",
      [Number(activo), id, req.user.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Objetivo no encontrado" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /objetivos/:id
export const deleteObjetivo = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query(
      "DELETE FROM objetivos_estrategicos WHERE id = ? AND creado_por_usuario_id = ?",
      [id, req.user.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el objetivo" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
