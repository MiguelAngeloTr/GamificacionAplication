// src/hooks/useProfile.js
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";

export function useProfile(auto = true) {
  const [data, setData] = useState(null);   // { usuario, roles, perfil, coachRef? }
  const [loading, setLoading] = useState(!!auto);
  const [error, setError] = useState(null);

  const normalizeRoles = (r) => {
    if (!r) return [];
    if (Array.isArray(r)) return r.filter(Boolean).map((x) => String(x).trim().toLowerCase());
    if (typeof r === "string") return r.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    return [];
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Backend: GET /api/auth/profile  (si tu baseURL ya incluye /api => "/auth/profile")
      const res = await api.get("/auth/profile");
      const payload = res.data ?? null;

      // Normaliza roles por seguridad
      const roles = normalizeRoles(payload?.roles);

      setData(payload ? { ...payload, roles } : null);
      return payload;
    } catch (e) {
      setData(null);
      const msg = e?.response?.data?.message || e?.message || "Error cargando perfil";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) fetchProfile();
  }, [auto, fetchProfile]);

  return {
    data,          // { usuario, roles, perfil, coachRef? }
    loading,
    error,
    refetch: fetchProfile,
  };
}
