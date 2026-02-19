// src/controllers/notificaciones.controller.js
import { pool } from "../../acceso_datos/db.js";

/**
 * RUTAS sugeridas:
 * GET    /notificaciones?leida=0&tipo=meta&limit=20&offset=0
 * PATCH  /notificaciones/:id/leida        { leida: 0|1 }
 * PATCH  /notificaciones/leer-todas       (marca todas como leídas)
 * DELETE /notificaciones/:id
 */

// GET /notificaciones
export const getNotificaciones = async (req, res) => {
  try {
    const { leida, tipo, limit = 50, offset = 0 } = req.query;

    const where = ["usuario_id = ?"];
    const params = [req.user.id];

    if (leida !== undefined) {
      where.push("leida = ?");
      params.push(Number(leida) ? 1 : 0);
    }

    if (tipo !== undefined) {
      where.push("tipo = ?");
      params.push(String(tipo));
    }

    const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const off = Math.max(Number(offset) || 0, 0);

    const sql = `
      SELECT *
      FROM notificaciones
      WHERE ${where.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(lim, off);

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /notificaciones/:id
export const getNotificacionById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM notificaciones WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /notificaciones
// Útil si el sistema crea notificaciones desde backend (o admin/coach)
export const createNotificacion = async (req, res) => {
  try {
    const {
      usuario_id, // opcional: si viene, úsalo; si no, se asume el usuario actual
      tipo,
      titulo,
      mensaje = null,
      leida = 0,
    } = req.body;

    if (!tipo || !titulo) {
      return res.status(400).json({ message: "Campos obligatorios: tipo, titulo" });
    }

    const targetUserId = usuario_id ? Number(usuario_id) : req.user.id;

    const [r] = await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, leida)
       VALUES (?, ?, ?, ?, ?)`,
      [targetUserId, String(tipo), String(titulo), mensaje, Number(leida) ? 1 : 0]
    );

    const [rows] = await pool.query(
      "SELECT * FROM notificaciones WHERE id = ?",
      [r.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /notificaciones/:id/leida  { leida: 0|1 }
export const patchNotificacionLeida = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { leida } = req.body;

    if (leida === undefined) {
      return res.status(400).json({ message: "leida es obligatorio (0|1)" });
    }

    const [r] = await pool.query(
      "UPDATE notificaciones SET leida = ? WHERE id = ? AND usuario_id = ?",
      [Number(leida) ? 1 : 0, id, req.user.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /notificaciones/leer-todas
export const leerTodasNotificaciones = async (req, res) => {
  try {
    const [r] = await pool.query(
      "UPDATE notificaciones SET leida = 1 WHERE usuario_id = ? AND leida = 0",
      [req.user.id]
    );

    return res.json({ ok: true, updated: r.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /notificaciones/:id
export const deleteNotificacion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [r] = await pool.query(
      "DELETE FROM notificaciones WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
