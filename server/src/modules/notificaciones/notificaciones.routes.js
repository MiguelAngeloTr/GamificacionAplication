// src/routes/notificaciones.routes.js
import { Router } from "express";
import {
  getNotificaciones,
  getNotificacionById,
  createNotificacion,
  patchNotificacionLeida,
  leerTodasNotificaciones,
  deleteNotificacion,
} from "./notificaciones.controller.js";

import { requireAuth } from "../../middlewares/validateToken.js";

const router = Router();
router.use(requireAuth);

router.get("/", getNotificaciones);
router.get("/:id", getNotificacionById);
router.post("/", createNotificacion);

router.patch("/leer-todas", leerTodasNotificaciones);
router.patch("/:id/leida", patchNotificacionLeida);


router.delete("/:id", deleteNotificacion);

export default router;
