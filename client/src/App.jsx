// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Context Provider
import { SocketProvider } from "./context/SocketContext";

// PUBLIC PAGES
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import UserSignup from "./pages/UserSignup";
import SelectLogin from "./pages/SelectLogin"; 
import Submit from "./pages/submit";
import SubmissionDetail from './pages/SubmissionDetail'; // From friend's branch

// PRIVATE PAGES (Components should handle their own authentication)
import UserHome from "./pages/UserHome";         // Your UserHome component
import UserDashboard from "./pages/UserDashboard"; // Friend's UserDashboard component
import EditorDashboard from './pages/EditorDashboard';

// LAYOUTS/HELPERS
import EditorLayout from "./components/editor/EditorLayout"; // From friend's branch
import PrivateRoute from "./components/PrivateRoute"; // Assuming you have this for auth
import EditorRoute from "./components/EditorRoute";   // Assuming you have this for editor auth

import "./index.css";

/**
 * Integrated Routing Structure:
 * - Uses <Router> (BrowserRouter) for proper navigation.
 * - Uses friend's new path names (e.g., /user/login, /editor/dashboard).
 * - Uses your existing UserHome and EditorDashboard.
 * - Uses PrivateRoute and EditorRoute for protection.
 */
export default function App() {
  return (
    <SocketProvider>
      <Router> {/* Re-introduced BrowserRouter */}
        <Routes>

          {/* Root/Landing Page */}
          <Route path="/" element={<SelectLogin />} />

          {/* Public Authentication */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/editor/login" element={<EditorLogin />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/user/task/:id/submit" element={<div>Submission Form Placeholder</div>} />

          {/* User Private Routes (Protected by PrivateRoute) */}
          {/* Note: /user/dashboard is the path from friend's branch. /home is also kept for safety. */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<UserHome />} /> 
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Editor Private Routes (Protected by EditorRoute) */}
          <Route element={<EditorRoute />}>
            <Route 
              path="/editor/dashboard" 
              element={
                <EditorLayout>
                  <EditorDashboard />
                </EditorLayout>
              } 
            />
            <Route path="/editor/submission/:id" element={<SubmissionDetail />} />
          </Route>

          {/* FALLBACK: Redirects to the login selection page */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </SocketProvider>
  );
}