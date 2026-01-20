import { Router } from "express";

import { requireAuth } from "../../middlewares/validateToken.js";

import {
  register,
  login,
  logout,
  me,
  profile
} from "./auth.controller.js";

const router = Router();

/*
  Base: /api/auth
*/

// Registro de usuario
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Usuario autenticado (perfil actual)
router.get("/me", requireAuth, me);

router.get("/profile", requireAuth, profile);


export default router;
