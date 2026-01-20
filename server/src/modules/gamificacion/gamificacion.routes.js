// src/modules/gamificacion/gamificacion.routes.js

import { Router } from "express";
import { requireAuth } from "../../middlewares/validateToken.js";

import {
  getRewards,
  updateRewards,
  getPoints,
  getPoint,
  deletePoint,
  updateLevels,
  deleteLevel,
} from "./gamificacion.controller.js";

const router = Router();

/*
  Base: /api/gamificacion
*/

/* =========================
   RECOMPENSAS
   ========================= */

// Obtener todas las recompensas
router.get("/rewards", requireAuth, getRewards);

// Actualizar flags/preferencias de una recompensa
router.put("/rewards/:id", requireAuth, updateRewards);


/* =========================
   PUNTUACIONES
   ========================= */

// Obtener todas las puntuaciones
router.get("/points", requireAuth, getPoints);

// Obtener una puntuación por id
router.get("/points/:id", requireAuth, getPoint);

// Eliminar una puntuación por id
router.delete("/points/:id", requireAuth, deletePoint);


/* =========================
   NIVELES
   ========================= */

// Incrementar nivel (num_nivel = num_nivel + 1)
router.patch("/levels/:id", requireAuth, updateLevels);

// Eliminar un nivel por id
router.delete("/levels/:id", requireAuth, deleteLevel);

export default router;
