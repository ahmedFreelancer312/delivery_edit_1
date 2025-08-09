import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CustomerRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/customer/login" />;
  }

  if (currentUser.role !== "customer") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default CustomerRoute;
