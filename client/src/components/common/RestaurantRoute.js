import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RestaurantRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/restaurant/login" />;
  }
  
  if (currentUser.role !== 'restaurant') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default RestaurantRoute;