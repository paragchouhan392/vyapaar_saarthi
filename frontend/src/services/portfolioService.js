import api from "./api";

export const getPortfolio = () => api.get(`/portfolio`);
export const createPortfolio = (data) => api.post("/portfolio", data);
export const addPortfolioItem = (id, items) => api.post(`/portfolio/${id}/add-items`, { items });
export const deletePortfolioItem = (pid, iid) => api.delete(`/portfolio/${pid}/delete-item/${iid}`);
