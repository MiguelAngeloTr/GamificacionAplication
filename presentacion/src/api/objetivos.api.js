import api from "./axios";


// =========================
// OBJETIVOS ESTRATÉGICOS
// =========================
export const objetivosApi = {
  list: (params) => api.get("/objetivos", { params }), // { planId, activo }
  listByPlan: (planId) => api.get(`/planes/${planId}/objetivos`), // opcional
  getById: (id) => api.get(`/objetivos/${id}`),
  create: (payload) => api.post("/objetivos", payload), // { plan_id, titulo, descripcion?, activo? }
  update: (id, payload) => api.put(`/objetivos/${id}`, payload),
  patchActivo: (id, activo) => api.patch(`/objetivos/${id}/activo`, { activo }), // 0|1
  remove: (id) => api.delete(`/objetivos/${id}`),
};