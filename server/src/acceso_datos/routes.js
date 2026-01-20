

import {Router} from "express"
import actividadesRoutes from "../modules/actividades/actividades.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

import evidenciasRoutes from "../modules/evidencias/evidencias.routes.js";
import gamificacionRoutes from "../modules/gamificacion/gamificacion.routes.js";

import unidadesRoutes from "../modules/unidades/unidades.routes.js";

const router=Router()

router.use("/unidades", unidadesRoutes);


router.use("/gamificacion", gamificacionRoutes);


router.use("/auth", authRoutes);

router.use("/actividades", actividadesRoutes);

router.use("/evidencias", evidenciasRoutes);


export default router;