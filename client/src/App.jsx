// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { SocketProvider } from "./context/SocketContext";

// EditorDashboard exported as a named export in your file
import { EditorDashboard } from "./pages/EditorDashboard";

// UserHome exported as a named export in your file
import { UserHome } from "./pages/UserHome";
// near the top with other imports





// Submit page default export
import Submit from "./pages/submit";

import "./index.css";

/**
 * Minimal safe router:
 * - /      -> UserHome
 * - /home  -> UserHome
 * - /submit -> Submit (this must render your Submit page)
 * - /editor/dashboard -> EditorDashboard
 * - fallback -> /
 */
export default function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<UserHome />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/editor/dashboard" element={<EditorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}
