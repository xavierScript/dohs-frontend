import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const token = localStorage.getItem("authToken");
  if (!token) {
    return null; // Or a loading spinner
  }

  return children;
};

export default ProtectedRoute;
