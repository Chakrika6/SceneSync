// client/src/components/EditorRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * EditorRoute component checks for a valid editor token.
 * If the token exists, it renders the child routes via <Outlet>.
 * If the token is missing, it redirects the editor to the editor login page.
 */
const EditorRoute = () => {
  // Check if the editor token exists (assuming you store it as 'editorToken')
  const isAuthenticated = localStorage.getItem('editorToken');

  // If authenticated, render the nested component (e.g., EditorDashboard)
  // If not authenticated, redirect them to the editor login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/editor/login" replace />;
};

export default EditorRoute;