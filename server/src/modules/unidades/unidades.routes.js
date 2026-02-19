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

router.get("/", requireAuth, getUnits);
router.get("/:id", requireAuth, getUnit);

router.post("/", requireAuth, createUnit);

router.put("/:id", requireAuth, updateUnit);

router.delete("/:id", requireAuth, deleteUnit);

export default router;