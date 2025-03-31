import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";
import Loading from "../components/shared/loading";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <Loading />;

  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;