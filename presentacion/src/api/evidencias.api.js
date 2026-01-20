import api from "./axios";

export const evidenciasApi = {
  list: () => api.get("/evidencias"),
  getById: (id) => api.get(`/evidencias/${id}`),
  // si subes archivo:
  create: (formData) =>
    api.post("/evidencias", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
