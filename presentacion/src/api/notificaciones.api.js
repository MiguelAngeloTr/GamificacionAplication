// src/api/notificaciones.api.js
import api from "./axios";

export const notificacionesApi = {
  // GET /notificaciones?leida=0&tipo=meta&limit=20&offset=0
  list: (params) => api.get("/notificaciones", { params }),

  // GET /notificaciones/:id
  getById: (id) => api.get(`/notificaciones/${id}`),

  // POST /notificaciones
  // Útil si (coach/directiva/backend) crea notificaciones
  create: (payload) => api.post("/notificaciones", payload),

  // PATCH /notificaciones/:id/leida   { leida: 0|1 }
  patchLeida: (id, leida) => api.patch(`/notificaciones/${id}/leida`, { leida }),

  // PATCH /notificaciones/leer-todas
  leerTodas: () => api.patch("/notificaciones/leer-todas"),

  // DELETE /notificaciones/:id
  remove: (id) => api.delete(`/notificaciones/${id}`),
};
