import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const DriverRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/driver/login" />;
  }

  if (currentUser.role !== "driver") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default DriverRoute;
