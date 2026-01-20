import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export default api; 

export const loginUserRequest = (user) => api.post("/auth/login", user);
export const createUserRequest = (user) => api.post("/auth/register", user);
export const verifyTokenRequest = () => api.get("/auth/me");
