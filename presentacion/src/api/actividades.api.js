import api from "./axios";

export const actividadesApi = {
  // GET /api/actividades  (mine)
  listMine: () => api.get("/actividades"),

  // GET /api/actividades/:id
  getById: (id) => api.get(`/actividades/${id}`),

  // POST /api/actividades
  create: (payload) => api.post("/actividades", payload),

  // PUT /api/actividades/:id
  update: (id, payload) => api.put(`/actividades/${id}`, payload),

  // PATCH /api/actividades/:id/estado   (toggle)
  toggleEstado: (id, estado) => api.patch(`/actividades/${id}/estado`, { estado }),

  // DELETE /api/actividades/:id
  remove: (id) => api.delete(`/actividades/${id}`),
};
