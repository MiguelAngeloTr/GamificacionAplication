import { Router } from "express";
import {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
} from "./cursos.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getCursos);
router.get("/:id", getCursoById);

router.post("/", createCurso);
router.put("/:id", updateCurso);
router.delete("/:id", deleteCurso);

export default router;
