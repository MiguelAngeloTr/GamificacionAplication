

import { Router } from "express"
import actividadesRoutes from "../modules/actividades/actividades.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import evidenciasRoutes from "../modules/evidencias/evidencias.routes.js";
import gamificacionRoutes from "../modules/gamificacion/gamificacion.routes.js";
import unidadesRoutes from "../modules/unidades/unidades.routes.js";
import objetivosRoutes from "../modules/objetivos/objetivos.routes.js";
import planRoutes from "../modules/planes/plan.routes.js";
import metasRoutes from "../modules/metas/metas.routes.js";
import inscripcionesRoutes from "../modules/inscripciones/inscripciones.routes.js";
import cursosRoutes from "../modules/cursos/cursos.routes.js";
import notificacionesRoutes from "../modules/notificaciones/notificaciones.routes.js";




const router = Router()

router.use("/unidades", unidadesRoutes);
router.use("/gamificacion", gamificacionRoutes);
router.use("/auth", authRoutes);
router.use("/actividades", actividadesRoutes);
router.use("/evidencias", evidenciasRoutes);
router.use("/objetivos", objetivosRoutes);
router.use("/planes", planRoutes);
router.use("/metas", metasRoutes);
router.use("/inscripciones", inscripcionesRoutes);
router.use("/cursos", cursosRoutes);
router.use("/notificaciones", notificacionesRoutes);





export default router;