import { Router } from "express";
import {
  getActividades,
  getActividad,
  createActividad,
  updateActividad,
  patchActividadEstado,
  getActividadPresupuesto,
  upsertActividadPresupuesto,
} from "./actividades.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getActividades);
router.get("/:id", getActividad);
router.post("/", createActividad);
router.put("/:id", updateActividad);
router.patch("/:id/estado", patchActividadEstado);

router.get("/:id/presupuesto", getActividadPresupuesto);
router.post("/:id/presupuesto", upsertActividadPresupuesto);

export default router;
