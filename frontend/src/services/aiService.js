import api from "./api";

export const analyzeWithAI        = () => api.post("/ai/analyze");
export const getBusinessAssistant = (currentRevenue, currentInventory) => api.post("/ai/business-assistant", { currentRevenue, currentInventory });
export const getInvestmentGuides  = (page = 1) => api.get(`/investment-guide?page=${page}&limit=10`);
export const saveGuide           = (data) => api.post("/investment-guide", data);
