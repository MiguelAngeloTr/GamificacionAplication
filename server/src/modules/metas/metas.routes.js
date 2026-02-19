import { Router } from "express";
import {
  getMetas,
  getMetaById,
  createMeta,
  updateMeta,
  patchMetaEstado,
  patchMetaProgreso,
  deleteMeta,
} from "./metas.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getMetas);
router.get("/:id", getMetaById);
router.post("/", createMeta);
router.put("/:id", updateMeta);
router.patch("/:id/estado", patchMetaEstado);
router.patch("/:id/progreso", patchMetaProgreso);
router.delete("/:id", deleteMeta);

export default router;
