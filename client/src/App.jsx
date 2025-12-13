// client/src/App.jsx
import React from "react";
// 🛑 IMPORTANT: Only import what you use. We only need Routes, Route, and Navigate here.
import { Routes, Route, Navigate } from "react-router-dom"; 

// Context Provider
import { SocketProvider } from "./context/SocketContext";

// PUBLIC PAGES
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import UserSignup from "./pages/UserSignup";
import SelectLogin from "./pages/SelectLogin"; 
import Submit from "./pages/submit";
import SubmissionDetail from './pages/SubmissionDetail';

// PRIVATE PAGES 
import UserHome from "./pages/UserHome"; 
import UserDashboard from "./pages/UserDashboard"; 
import EditorDashboard from './pages/EditorDashboard';

// LAYOUTS/HELPERS
import EditorLayout from "./components/editor/EditorLayout"; 
import PrivateRoute from "./components/PrivateRoute"; 
import EditorRoute from "./components/EditorRoute"; 

import "./index.css";


export default function App() {
  return (
    <SocketProvider>
      {/* 🛑 REMOVED: The outer <Router> tags are gone! */}
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
    </SocketProvider>
  );
}