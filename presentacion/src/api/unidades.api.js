import api from "./axios";

export const unidadesApi = {
  list: () => api.get("/unidades"),
  getById: (id) => api.get(`/unidades/${id}`),
  create: (payload) => api.post("/unidades", payload),
  update: (id, payload) => api.put(`/unidades/${id}`, payload),
  toggleEstado: (id, estado) => api.patch(`/unidades/${id}/estado`, { estado }),
  remove: (id) => api.delete(`/unidades/${id}`),
};
