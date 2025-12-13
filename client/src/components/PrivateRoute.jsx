// client/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute component checks for a valid user token.
 * If the token exists, it renders the child routes via <Outlet>.
 * If the token is missing, it redirects the user to the login page.
 */
const PrivateRoute = () => {
  // Check if the user token exists in local storage
  const isAuthenticated = localStorage.getItem('userToken');

  // If authenticated, render the nested component (e.g., UserDashboard)
  // If not authenticated, redirect them to the user login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default PrivateRoute;