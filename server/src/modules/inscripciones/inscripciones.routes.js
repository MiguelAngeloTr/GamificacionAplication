import { Router } from "express";
import {
  getInscripciones,
  getInscripcionById,
  createInscripcion,
  updateInscripcion,
  patchInscripcionEstado,
  patchInscripcionHoras,
  deleteInscripcion,
} from "./inscripciones.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getInscripciones);
router.get("/:id", getInscripcionById);
router.post("/", createInscripcion);
router.put("/:id", updateInscripcion);
router.patch("/:id/estado", patchInscripcionEstado);
router.patch("/:id/horas", patchInscripcionHoras);
router.delete("/:id", deleteInscripcion);


export default router;
