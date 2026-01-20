import { ROLE, hasAnyRole } from "./roleUtils";

// Permisos básicos por pantalla/acción (ajústalo a tu negocio real)
export const PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: [ROLE.COACH, ROLE.COLABORADOR, ROLE.DIRECTIVA],
  VIEW_PERFIL: [ROLE.COACH, ROLE.COLABORADOR, ROLE.DIRECTIVA],
  VIEW_FILES: [ROLE.COACH, ROLE.DIRECTIVA],
  VIEW_RECOMPENSAS: [ROLE.COACH, ROLE.COLABORADOR, ROLE.DIRECTIVA],
  VIEW_LOGROS: [ROLE.COACH, ROLE.COLABORADOR, ROLE.DIRECTIVA],
  VIEW_UNIDADES_RETORNO: [ROLE.COACH, ROLE.DIRECTIVA],
});

// helper simple para validar permisos
export const can = (roles = [], permission) => {
  const allowed = PERMISSIONS[permission] || [];
  return hasAnyRole(roles, allowed);
};
