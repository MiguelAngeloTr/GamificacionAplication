import { Router } from "express";
import {
  getPlanes,
  getPlanActivo,
  getPlanById,
  createPlan,
  updatePlan,
  patchPlanActivo,
  deletePlan,
} from "./plan.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getPlanes);
router.get("/activo", getPlanActivo);
router.get("/:id", getPlanById);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.patch("/:id/activo", patchPlanActivo);
router.delete("/:id", deletePlan);

export default router;
