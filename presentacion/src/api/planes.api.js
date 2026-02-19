
import api from "./axios";

export const planesApi = {
  list: () => api.get("/planes"),
  getActivo: () => api.get("/planes/activo"),
  getById: (id) => api.get(`/planes/${id}`),
  create: (payload) => api.post("/planes", payload),
  update: (id, payload) => api.put(`/planes/${id}`, payload),
  remove: (id) => api.delete(`/planes/${id}`),
};
