import { Router } from "express";
import { requireAuth } from "../../middlewares/validateToken.js";

import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from "./unidades.controller.js";

const router = Router();

/*
  Base: /api/unidades
*/

// Obtener todas las unidades
router.get("/", requireAuth, getUnits);

// Obtener una unidad específica por id
router.get("/:id", requireAuth, getUnit);

// Crear una nueva unidad
router.post("/", requireAuth, createUnit);

// Actualizar una unidad
router.put("/:id", requireAuth, updateUnit);

// Eliminar una unidad
router.delete("/:id", requireAuth, deleteUnit);

export default router;
