import api from "./axios";
// =========================
// METAS PERSONALES
// =========================
export const metasApi = {
  list: (params) => api.get("/metas", { params }), // { planId, estado }
  getById: (id) => api.get(`/metas/${id}`),
  create: (payload) => api.post("/metas", payload), // { plan_id, titulo, ... }
  update: (id, payload) => api.put(`/metas/${id}`, payload),
  patchEstado: (id, estado) => api.patch(`/metas/${id}/estado`, { estado }),
  patchProgreso: (id, progreso_pct) =>
    api.patch(`/metas/${id}/progreso`, { progreso_pct }),
  remove: (id) => api.delete(`/metas/${id}`),
};
