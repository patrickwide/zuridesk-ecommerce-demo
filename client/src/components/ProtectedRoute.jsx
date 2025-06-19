import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    // If admin route but user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;