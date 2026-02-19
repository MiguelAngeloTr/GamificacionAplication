import api from "./axios";

export const inscripcionesApi = {
  list: (params) => api.get("/inscripciones", { params }), // { planId, estado }
  getById: (id) => api.get(`/inscripciones/${id}`),
  create: (payload) => api.post("/inscripciones", payload), // { curso_id, plan_id, ... }
  update: (id, payload) => api.put(`/inscripciones/${id}`, payload),
  patchEstado: (id, estado) =>
    api.patch(`/inscripciones/${id}/estado`, { estado }),
  patchHoras: (id, horas_invertidas) =>
    api.patch(`/inscripciones/${id}/horas`, { horas_invertidas }),
  remove: (id) => api.delete(`/inscripciones/${id}`),
};