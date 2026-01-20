import { Router } from "express";
import { requireAuth } from "../../middlewares/validateToken.js";

import {
  getTasksAll,
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskEstado,
  deleteTask,
} from "./actividades.controller.js";

const router = Router();

/*
  Base: /api/actividades
*/

router.get("/", requireAuth, getTasks);           // mine
router.get("/all", requireAuth, getTasksAll);     // opcional admin
router.get("/:id", requireAuth, getTask);
router.post("/", requireAuth, createTask);
router.put("/:id", requireAuth, updateTask);
router.patch("/:id/estado", requireAuth, updateTaskEstado);
router.delete("/:id", requireAuth, deleteTask);

export default router;
