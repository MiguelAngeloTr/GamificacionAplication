import { Router } from "express";
import {
  getObjetivos,
  getObjetivosByPlan,
  getObjetivoById,
  createObjetivo,
  updateObjetivo,
  patchObjetivoActivo,
  deleteObjetivo,
} from "./objetivos.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getObjetivos);
router.get("/:id", getObjetivoById);
router.post("/", createObjetivo);
router.put("/:id", updateObjetivo);
router.patch("/:id/activo", patchObjetivoActivo);
router.delete("/:id", deleteObjetivo);

router.get("/:planId", getObjetivosByPlan);

export default router;  
