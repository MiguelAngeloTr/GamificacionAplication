import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

function normalizeRoles(r) {
  if (!r) return [];
  if (Array.isArray(r)) return r;
  if (typeof r === "string") return r.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
      setRoles(normalizeRoles(res.data.roles));
    } catch (err) {
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (payload) => {
    await authApi.login(payload);
    await checkSession();
  }, [checkSession]);

  const register = useCallback(async (payload) => {
    await authApi.register(payload);
    await checkSession();
  }, [checkSession]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setRoles([]);
    }
  }, []);

  const hasRole = useCallback((roleName) => roles.includes(roleName), [roles]);
  const hasAnyRole = useCallback(
    (allowed = []) => allowed.length === 0 ? true : allowed.some((r) => roles.includes(r)),
    [roles]
  );

  const value = useMemo(() => ({
    user,
    roles,
    isAuthenticated: !!user,
    loading,
    hasRole,
    hasAnyRole,
    login,
    register,
    logout,
    checkSession,
  }), [user, roles, loading, hasRole, hasAnyRole, login, register, logout, checkSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
