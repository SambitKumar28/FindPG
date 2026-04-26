import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const OwnerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "owner") return <Navigate to="/" />;

  return children;
};

export default OwnerRoute;