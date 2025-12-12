// client/src/App.jsx
import React from "react";
// KEEPING BrowserRouter as Router, Routes, Route, Navigate (from Updated upstream)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 

// Context Provider
import { SocketProvider } from "./context/SocketContext";

// PUBLIC PAGES
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import UserSignup from "./pages/UserSignup";
import SelectLogin from "./pages/SelectLogin"; 
import Submit from "./pages/submit";
import SubmissionDetail from './pages/SubmissionDetail'; // Used in Editor Flow

// PRIVATE PAGES (Components should handle their own authentication)
import UserHome from "./pages/UserHome";          // Your original Home
import UserDashboard from "./pages/UserDashboard";  // Friend's Dashboard
import EditorDashboard from './pages/EditorDashboard';

// LAYOUTS/HELPERS
import EditorLayout from "./components/editor/EditorLayout"; 
import PrivateRoute from "./components/PrivateRoute"; // Assuming you have this for auth
import EditorRoute from "./components/EditorRoute";   // Assuming you have this for editor auth

import "./index.css";


export default function App() {
  return (
    <SocketProvider>
      {/* Re-introducing the required Router component */}
      <Router> 
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
          <Route element={<PrivateRoute />}>
            {/* Keeping both paths for flexibility */}
            <Route path="/home" element={<UserHome />} /> 
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Editor Private Routes (Protected by EditorRoute) */}
          <Route element={<EditorRoute />}>
            {/* Editor Dashboard - Using the Layout component */}
            <Route 
              path="/editor/dashboard" 
              element={
                <EditorLayout>
                  <EditorDashboard />
                </EditorLayout>
              } 
            />
            {/* Editor Submission Detail - Using the Layout component */}
            <Route 
              path="/editor/submission/:id" 
              element={
                <EditorLayout>
                  <SubmissionDetail />
                </EditorLayout>
              } 
            />
          </Route>

          {/* FALLBACK: Redirects to the login selection page */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </SocketProvider>
  );
}