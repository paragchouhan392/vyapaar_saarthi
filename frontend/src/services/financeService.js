import api from "./api";

export const getDashboard = () => api.get("/dashboard");
export const getFinance   = () => api.get("/finance");
export const postFinance  = (data) => api.post("/finance", data);
