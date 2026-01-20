// src/api/gamificacion.api.js
import api from "./axios";

export const gamificacionApi = {
  // REWARDS
  getRewards: () => api.get("/gamificacion/rewards"),
  updateReward: (id, payload) => api.put(`/gamificacion/rewards/${id}`, payload),

  // POINTS
  getPoints: () => api.get("/gamificacion/points"),
  getPointById: (id) => api.get(`/gamificacion/points/${id}`),
  deletePoint: (id) => api.delete(`/gamificacion/points/${id}`),

  // LEVELS (tu backend solo tiene patch/delete, no GET)
  incrementLevel: (id) => api.patch(`/gamificacion/levels/${id}`),
  deleteLevel: (id) => api.delete(`/gamificacion/levels/${id}`),
};
