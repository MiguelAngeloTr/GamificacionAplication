import jwt from "jsonwebtoken";
import { pool } from "../../dominio/index.js";

export const requireAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, correo FROM usuarios WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    req.user = rows[0];

    next();
  });
};
