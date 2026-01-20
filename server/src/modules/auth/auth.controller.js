// src/modules/auth/auth.controller.js

import bcrypt from "bcryptjs";
import { pool } from "../../../dominio/index.js";
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
    });

    return res.json({
      id: result.insertId,
      correo: email,
      nombre: nombre_usuario,
    });
  } catch (error) {
    const msg = error?.code === "ER_DUP_ENTRY"
      ? "El correo ya está registrado"
      : (error?.message ?? "Error interno");

    return res.status(500).json({ message: msg });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const [result] = await pool.query(
      "SELECT id, correo, nombre, contrasena FROM usuarios WHERE correo = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, result[0].contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = await createAccessToken({ id: result[0].id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      id: result[0].id,
      correo: result[0].correo,
      nombre: result[0].nombre,
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


/**
 * GET /api/auth/profile
 * Requiere auth (cookie token) => req.user.id
 *
 * Devuelve:
 * {
 *   usuario: { id, nombre, correo },
 *   roles: ["coach","colaborador"],
 *   perfil: {
 *     tipo: "coach"|"colaborador"|"directiva"|"usuario",
 *     cedula, nombre, apellido, direccion, nacionalidad, telefono, observacion, fk_cedula_coachee?
 *   },
 *   coachRef?: { cedula, nombre, apellido } // (opcional) si es colaborador y se puede resolver
 * }
 */
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

        GROUP_CONCAT(DISTINCT LOWER(r.nombre)) AS roles,

        c.cedula AS coach_cedula,
        c.nombre AS coach_nombre,
        c.apellido AS coach_apellido,
        c.direccion AS coach_direccion,
        c.nacionalidad AS coach_nacionalidad,
        c.telefono AS coach_telefono,
        c.observacion AS coach_observacion,

        col.cedula AS colab_cedula,
        col.nombre AS colab_nombre,
        col.apellido AS colab_apellido,
        col.direccion AS colab_direccion,
        col.nacionalidad AS colab_nacionalidad,
        col.telefono AS colab_telefono,
        col.fk_cedula_coachee,
        col.usuario_id AS colab_usuario_id,

        d.cedula AS directivo_cedula,
        d.nombre AS directivo_nombre,
        d.apellido AS directivo_apellido,
        d.direccion AS directivo_direccion,
        d.nacionalidad AS directivo_nacionalidad,
        d.telefono AS directivo_telefono

      FROM usuarios u
      LEFT JOIN usuario_rol ur ON ur.usuario_id = u.id
      LEFT JOIN roles r ON r.id = ur.rol_id
      LEFT JOIN coaches c ON c.usuario_id = u.id
      LEFT JOIN colaboradores col ON col.usuario_id = u.id
      LEFT JOIN directivos d ON d.usuario_id = u.id
      WHERE u.id = ?
      GROUP BY u.id;
      `,
      [userId]
    );

    if (!rows?.length) return res.status(404).json({ message: "Usuario no encontrado" });

    const row = rows[0];

    // Roles normalizados (lowercase + trim + únicos)
    const rolesArr = Array.from(
      new Set(
        String(row.roles ?? "")
          .split(",")
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    // Prioridad: directiva > coach > colaborador > usuario
    const priority = { directiva: 1, coach: 2, colaborador: 3, usuario: 99 };
    const rolesSorted = [...rolesArr].sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99));

    // Helpers para armar perfil sin repetir
    const baseUsuario = {
      tipo: "usuario",
      cedula: null,
      nombre: row.usuario_nombre ?? null,
      apellido: null,
      direccion: null,
      nacionalidad: null,
      telefono: null,
      observacion: null,
    };

    const buildDirectiva = () => ({
      tipo: "directiva",
      cedula: row.directivo_cedula,
      nombre: row.directivo_nombre ?? row.usuario_nombre ?? null,
      apellido: row.directivo_apellido ?? null,
      direccion: row.directivo_direccion ?? null,
      nacionalidad: row.directivo_nacionalidad ?? null,
      telefono: row.directivo_telefono ?? null,
      observacion: null,
    });

    const buildCoach = () => ({
      tipo: "coach",
      cedula: row.coach_cedula,
      nombre: row.coach_nombre ?? row.usuario_nombre ?? null,
      apellido: row.coach_apellido ?? null,
      direccion: row.coach_direccion ?? null,
      nacionalidad: row.coach_nacionalidad ?? null,
      telefono: row.coach_telefono ?? null,
      observacion: row.coach_observacion ?? null,
    });

    const buildColaborador = () => ({
      tipo: "colaborador",
      cedula: row.colab_cedula,
      nombre: row.colab_nombre ?? row.usuario_nombre ?? null,
      apellido: row.colab_apellido ?? null,
      direccion: row.colab_direccion ?? null,
      nacionalidad: row.colab_nacionalidad ?? null,
      telefono: row.colab_telefono ?? null,
      observacion: null,
      fk_cedula_coachee: row.fk_cedula_coachee ?? null,
    });

    // Resolver perfil activo por rol + existencia real de fila
    let perfil = baseUsuario;

    for (const r of rolesSorted) {
      if (r === "directiva" && row.directivo_cedula) {
        perfil = buildDirectiva();
        break;
      }
      if (r === "coach" && row.coach_cedula) {
        perfil = buildCoach();
        break;
      }
      if (r === "colaborador" && row.colab_cedula) {
        perfil = buildColaborador();
        break;
      }
    }

    // BONUS: si es colaborador, intentar resolver el coach referenciado por fk_cedula_coachee (si existe)
    // (esto mejora tu front para mostrar "Coach asignado: ...")
    let coachRef = null;
    if (perfil.tipo === "colaborador" && perfil.fk_cedula_coachee) {
      const [coachRows] = await pool.query(
        `SELECT cedula, nombre, apellido FROM coaches WHERE cedula = ? LIMIT 1`,
        [perfil.fk_cedula_coachee]
      );
      if (coachRows?.length) coachRef = coachRows[0];
    }

    return res.json({
      usuario: {
        id: row.usuario_id,
        nombre: row.usuario_nombre,
        correo: row.correo,
      },
      roles: rolesArr,
      perfil,
      ...(coachRef ? { coachRef } : {}),
    });
  } catch (error) {
    console.error("profile error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
