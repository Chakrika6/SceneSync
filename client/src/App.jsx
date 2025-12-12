<<<<<<< HEAD
// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
=======
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';
import UserDashboard from "./pages/UserDashboard";
import UserSignup from "./pages/UserSignup";
import SelectLogin from "./pages/SelectLogin";
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import EditorDashboard from './pages/EditorDashboard';
import SubmissionDetail from './pages/SubmissionDetail';
import EditorLayout from "./components/editor/EditorLayout";
import UserDashboard from "./pages/UserDashboard";
// import UserSignup from "./pages/UserSignup";
import './index.css';
>>>>>>> 5671bb78bc1cab305b563ae05c8b29691ae0cd57

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
<<<<<<< HEAD
      <Router>
        <Routes>
          
          <Route path="/" element={<UserHome />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/editor/dashboard" element={<EditorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
=======
      <Routes>

        {/* HOME */}
        <Route path="/" element={<SelectLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/task/:id/submit" element={<div>Submission Form Placeholder</div>} />
        <Route path="/user/signup" element={<UserSignup />} />


        {/* USER LOGIN */}
        <Route path="/user/login" element={<UserLogin />} />
       {/* <Route path="/user/signup" element={<UserSignup />} /> */}
        {/* EDITOR LOGIN */}
        <Route path="/editor/login" element={<EditorLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
<Route path="/user/task/:id/submit" element={<div>Submission Form Placeholder</div>} />


        {/* EDITOR FLOW */}
        <Route path="/editor/dashboard" element={<EditorDashboard />} />
        <Route path="/editor/submission/:id" element={<SubmissionDetail />} />
        <Route
  path="/editor/dashboard"
  element={
    <EditorLayout>
      <EditorDashboard />
    </EditorLayout>
  }
/>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
>>>>>>> 5671bb78bc1cab305b563ae05c8b29691ae0cd57
    </SocketProvider>
  );
}
