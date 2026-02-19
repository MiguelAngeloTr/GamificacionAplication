import { pool } from "../../acceso_datos/db.js";

// GET /planes?activo=0|1&from=YYYY-MM-DD&to=YYYY-MM-DD
export const getPlanes = async (req, res) => {
  try {
    const uid = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT DISTINCT p.*
      FROM plan_carrera p
      LEFT JOIN actividades a
        ON a.plan_id = p.id AND a.usuario_id = ?
      LEFT JOIN metas_personales m
        ON m.plan_id = p.id AND m.usuario_id = ?
      LEFT JOIN inscripciones_curso i
        ON i.plan_id = p.id AND i.usuario_id = ?
      WHERE a.id IS NOT NULL OR m.id IS NOT NULL OR i.id IS NOT NULL
      ORDER BY p.activo DESC, p.id DESC
      `,
      [uid, uid, uid]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /planes/activo
export const getPlanActivo = async (req, res) => {
  try {
    const uid = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT p.*
      FROM plan_carrera p
      WHERE p.activo = 1
        AND (
          EXISTS (SELECT 1 FROM actividades a WHERE a.plan_id=p.id AND a.usuario_id=?)
          OR EXISTS (SELECT 1 FROM metas_personales m WHERE m.plan_id=p.id AND m.usuario_id=?)
          OR EXISTS (SELECT 1 FROM inscripciones_curso i WHERE i.plan_id=p.id AND i.usuario_id=?)
        )
      ORDER BY p.id DESC
      LIMIT 1 
      `,
      [uid, uid, uid]
    );

    return res.json(rows[0] ?? null);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /planes/:id
export const getPlanById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM plan_carrera WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /planes
export const createPlan = async (req, res) => {
  try {
    const {
      nombre,
      descripcion = null,
      fecha_inicio = null,
      fecha_fin = null,
      activo = 1,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "nombre es obligatorio" });
    }

    const [r] = await pool.query(
      `INSERT INTO plan_carrera (nombre, descripcion, fecha_inicio, fecha_fin, activo)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, descripcion, fecha_inicio, fecha_fin, Number(activo)]
    );

    const [rows] = await pool.query(
      "SELECT * FROM plan_carrera WHERE id = ?",
      [r.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear el plan:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /planes/:id
export const updatePlan = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Whitelist simple
    const allowed = ["nombre", "descripcion", "fecha_inicio", "fecha_fin", "activo"];
    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (data.activo !== undefined) data.activo = Number(data.activo);

    const [r] = await pool.query(
      "UPDATE plan_carrera SET ? WHERE id = ?",
      [data, id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM plan_carrera WHERE id = ?",
      [id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /planes/:id/activo  { activo: 0|1 }
export const patchPlanActivo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body;

    if (activo !== 0 && activo !== 1 && activo !== "0" && activo !== "1") {
      return res.status(400).json({ message: "activo debe ser 0 o 1" });
    }

    const [r] = await pool.query(
      "UPDATE plan_carrera SET activo = ? WHERE id = ?",
      [Number(activo), id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /planes/:id
export const deletePlan = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query(
      "DELETE FROM plan_carrera WHERE id = ?",
      [id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el plan" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
