// src/modules/auth/auth.controller.js

import bcrypt from "bcryptjs";
import { pool } from "../../acceso_datos/db.js";
import { createAccessToken } from "../../utils/jwt.js";

/**
 * POST /api/auth/register
 * Body: { email, password, nombre_usuario }
 */
export const register = async (req, res) => {
  try {
    const { email, password, nombre_usuario } = req.body;

    if (!email || !password || !nombre_usuario) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const passwordhash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios(correo, contrasena, nombre) VALUES (?,?,?)",
      [email, passwordhash, nombre_usuario]
    );

    const token = await createAccessToken({ id: result.insertId });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // en producción con https
    });

    return res.status(201).json({
      id: result.insertId,
      correo: email,
      nombre: nombre_usuario,
    });
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }
    return res.status(500).json({ message: error?.message ?? "Error interno" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const [rows] = await pool.query(
      "SELECT id, correo, nombre, contrasena FROM usuarios WHERE correo = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = await createAccessToken({ id: rows[0].id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // en producción con https
    });

    return res.json({
      id: rows[0].id,
      correo: rows[0].correo,
      nombre: rows[0].nombre,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message ?? "Error interno" });
  }
};


/**
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

/**
 * GET /api/auth/me
 * Requiere middleware requireAuth que setea req.user
 */
export const me = async (req, res) => {
  try {
  console.log("me req.user:", req.user);
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }
  const [rows] = await pool.query(
    `SELECT u.id, u.correo, u.nombre, GROUP_CONCAT(r.nombre) AS roles 
     FROM usuarios u 
     LEFT JOIN usuario_rol ur ON ur.usuario_id = u.id 
     LEFT JOIN roles r ON r.id = ur.rol_id 
     WHERE u.id = ? 
     GROUP BY u.id`,
    [userId]
  );

  if (!rows || rows.length === 0) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  const rolesArr = (rows[0].roles ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const priority ={ coach:1, colaborador:2, directiva:3 };
  rolesArr.sort((a,b) => (priority[a] ?? 99) - (priority[b] ?? 99));


  return res.json({
    id: req.user.id,
    correo: req.user.correo,
    nombre: req.user.nombre,
    roles: rolesArr,
  });
} catch (error) {
  console.error("me error:", error);
  return res.status(500).json({ message: "Error interno del servidor" });
} ;

}

export const profile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const [rows] = await pool.query(
      `
      SELECT
        u.id AS usuario_id,
        u.nombre AS usuario_nombre,
        u.correo,

        p.cedula,
        p.tipo_cedula,
        p.apellido,
        p.direccion,
        p.nacionalidad,
        p.telefono,
        p.observacion,

        GROUP_CONCAT(DISTINCT LOWER(r.nombre) ORDER BY r.id) AS roles
      FROM usuarios u
      LEFT JOIN perfil p ON p.usuario_id = u.id
      LEFT JOIN usuario_rol ur ON ur.usuario_id = u.id
      LEFT JOIN roles r ON r.id = ur.rol_id
      WHERE u.id = ?
      GROUP BY u.id;
      `,
      [userId]
    );

    if (!rows?.length) return res.status(404).json({ message: "Usuario no encontrado" });

    const row = rows[0];

    // roles: array limpio y único
    const rolesArr = Array.from(
      new Set(
        String(row.roles ?? "")
          .split(",")
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    // prioriza rol principal (por si lo necesitas en el front)
    const priority = { directiva: 1, coach: 2, colaborador: 3, usuario: 99 };
    const primaryRole =
      [...rolesArr].sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99))[0] || "usuario";

    // perfil
    const perfil = {
      tipo: primaryRole, // o "perfil" si prefieres no ligar tipo al rol
      cedula: row.cedula ?? null,
      tipo_cedula: row.tipo_cedula ?? null,
      nombre: row.usuario_nombre ?? null,
      apellido: row.apellido ?? null,
      direccion: row.direccion ?? null,
      nacionalidad: row.nacionalidad ?? null,
      telefono: row.telefono ?? null,
      observacion: row.observacion ?? null,
    };

    return res.json({
      usuario: {
        id: row.usuario_id,
        nombre: row.usuario_nombre,
        correo: row.correo,
      },
      roles: rolesArr,
      primaryRole,
      perfil,
    });
  } catch (error) {
    console.error("profile error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }

};
