import { pool } from "../../acceso_datos/db.js";

// GET /cursos?tipo=curso&proveedor=Plat&requiere_apoyo=0|1&q=sql
export const getCursos = async (req, res) => {
  try {
    const { tipo, proveedor, requiere_apoyo, q } = req.query;

    const where = [];
    const params = [];

    if (tipo) {
      where.push("tipo = ?");
      params.push(tipo);
    }

    if (proveedor) {
      where.push("proveedor = ?");
      params.push(proveedor);
    }

    if (requiere_apoyo !== undefined) {
      where.push("requiere_apoyo = ?");
      params.push(Number(requiere_apoyo)); // 0|1
    }

    // Búsqueda simple por nombre/descripcion
    if (q) {
      where.push("(nombre LIKE ? OR descripcion LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }

    const sql = `
      SELECT *
      FROM cursos
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /cursos/:id
export const getCursoById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query("SELECT * FROM cursos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /cursos
// (recomendado: solo directiva/admin con middleware de rol)
export const createCurso = async (req, res) => {
  try {
    const {
      nombre,
      proveedor = null,
      tipo,
      descripcion = null,
      costo_estimado = 0,
      requiere_apoyo = 0,
    } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({ message: "Campos obligatorios: nombre, tipo" });
    }

    const [r] = await pool.query(
      `INSERT INTO cursos (nombre, proveedor, tipo, descripcion, costo_estimado, requiere_apoyo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        proveedor,
        tipo,
        descripcion,
        Number(costo_estimado),
        Number(requiere_apoyo),
      ]
    );

    const [rows] = await pool.query("SELECT * FROM cursos WHERE id = ?", [r.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear el curso:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /cursos/:id
// (recomendado: solo directiva/admin)
export const updateCurso = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const allowed = ["nombre", "proveedor", "tipo", "descripcion", "costo_estimado", "requiere_apoyo"];
    const data = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (data.costo_estimado !== undefined) data.costo_estimado = Number(data.costo_estimado);
    if (data.requiere_apoyo !== undefined) data.requiere_apoyo = Number(data.requiere_apoyo);

    const [r] = await pool.query("UPDATE cursos SET ? WHERE id = ?", [data, id]);

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const [rows] = await pool.query("SELECT * FROM cursos WHERE id = ?", [id]);
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /cursos/:id
// (recomendado: solo directiva/admin)
export const deleteCurso = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query("DELETE FROM cursos WHERE id = ?", [id]);

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
