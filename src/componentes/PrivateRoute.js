// src/componentes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
