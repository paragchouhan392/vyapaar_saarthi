import api from "./api";

export const getPortfolio    = (page = 1, limit = 10) => api.get(`/portfolio?page=${page}&limit=${limit}`);
export const addPortfolio    = (data) => api.post("/portfolio", data);
export const deletePortfolio = (id) => api.delete(`/portfolio/${id}`);
