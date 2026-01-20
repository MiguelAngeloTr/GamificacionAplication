// src/auth/useAuthRedirect.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./Context";

/**
 * Hook de redirección por auth/roles.
 *
 * @param {Object} opts
 * @param {string[]} opts.allowedRoles - roles permitidos (vacío => solo requiere auth)
 * @param {string} opts.loginPath - ruta del login
 * @param {string} opts.forbiddenPath - ruta cuando no tiene rol
 * @param {boolean} opts.replace - usar replace en navigate
 */
export function useAuthRedirect({
  allowedRoles = [],
  loginPath = "/",
  forbiddenPath = "/dashboard",
  replace = true,
} = {}) {
  const { loading, isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1) Mientras valida /auth/me, no redirigir
    if (loading) return;

    // 2) No autenticado => login + guardo desde dónde venía
    if (!isAuthenticated) {
      navigate(loginPath, { replace, state: { from: location } });
      return;
    }

    // 3) Si no se especifican roles => con estar autenticado basta
    if (!allowedRoles.length) return;

    // 4) Validar rol
    const hasAllowed = allowedRoles.some((r) => roles?.includes(r));
    if (!hasAllowed) {
      navigate(forbiddenPath, { replace });
    }
  }, [
    loading,
    isAuthenticated,
    roles,
    allowedRoles,
    loginPath,
    forbiddenPath,
    replace,
    navigate,
    location,
  ]);

  // Puedes retornar flags útiles
  const ready = !loading;
  const authorized =
    ready &&
    isAuthenticated &&
    (!allowedRoles.length || allowedRoles.some((r) => roles?.includes(r)));

  return { ready, authorized };
}
