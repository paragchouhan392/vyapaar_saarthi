import api from "./api";

export const getBalanceSheet = (page = 1) => api.get(`/balance?page=${page}&limit=10`);
export const addBalanceSheet = (data) => api.post("/balance", data);
