import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;
