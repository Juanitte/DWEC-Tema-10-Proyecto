export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return token != null && user != null;
};