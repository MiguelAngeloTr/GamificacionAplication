import { Router } from "express";
import { requireAuth } from "../../middlewares/validateToken.js";

import {
  getEvidencias,
  getEvidencia,
  updateEvidencia,
  deleteEvidencia,
} from "./evidencias.controller.js";

const router = Router();

/*
  Base: /api/evidencias
*/

// Obtener todas las evidencias
router.get("/", requireAuth, getEvidencias);

// Obtener una evidencia por id
router.get("/:id", requireAuth, getEvidencia);

// Actualizar una evidencia
router.put("/:id", requireAuth, updateEvidencia);

// Eliminar una evidencia
router.delete("/:id", requireAuth, deleteEvidencia);

export default router;
