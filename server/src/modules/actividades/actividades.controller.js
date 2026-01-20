import { pool } from "../../../dominio/index.js"; // ajusta si tu pool está en otro lado

// btener actividades del usuario autenticado
export const getTasks = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM actividades WHERE usuario_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  Obtener todas las actividades (solo si lo vas a usar para admin)
export const getTasksAll = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM actividades ORDER BY id DESC");
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  Obtener una actividad por id
export const getTask = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM actividades WHERE id = ? AND usuario_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Crear actividad (usuario autenticado)
export const createTask = async (req, res) => {
  try {
    const {
      nombre,
      descripcion = null,
      fecha_inicio,
      fecha_final = null,
      tipo,
      estado = 0,       // 0 pendiente, 1 completada
      archivo = null,
      plan_id = null,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO actividades
        (nombre, estado, descripcion, fecha_inicio, fecha_final, tipo, archivo, usuario_id, plan_id)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        nombre,
        estado,
        descripcion,
        fecha_inicio,
        fecha_final,
        tipo,
        archivo,
        req.user.id,
        plan_id,
      ]
    );

    return res.json({
      id: result.insertId,
      nombre,
      estado,
      descripcion,
      fecha_inicio,
      fecha_final,
      tipo,
      archivo,
      usuario_id: req.user.id,
      plan_id,
    });
  } catch (error) {
    console.error("Error al crear la actividad:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar actividad (solo del usuario)
export const updateTask = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE actividades SET ? WHERE id = ? AND usuario_id = ?",
      [req.body, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Toggle estado (si tu front lo usa)
export const updateTaskEstado = async (req, res) => {
  try {
    const { estado } = req.body; // 0|1

    const [result] = await pool.query(
      "UPDATE actividades SET estado = ? WHERE id = ? AND usuario_id = ?",
      [estado, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar actividad (solo del usuario)
export const deleteTask = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM actividades WHERE id = ? AND usuario_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró la actividad" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
