import { verifySession } from "../services/users-service";

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  return verifySession(token);
};