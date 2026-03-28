import api from "./api";

export const getOrgProfile    = () => api.get("/org-profile");
export const createOrgProfile = (data) => api.post("/org-profile", data);
export const updateOrgProfile = (data) => api.put("/org-profile", data);
