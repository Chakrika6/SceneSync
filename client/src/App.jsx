import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';

import SelectLogin from "./pages/SelectLogin";
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import EditorDashboard from './pages/EditorDashboard';
import SubmissionDetail from './pages/SubmissionDetail';
import EditorLayout from "./components/editor/EditorLayout";
import UserDashboard from "./pages/UserDashboard";
// import UserSignup from "./pages/UserSignup";
import './index.css';

function App() {
  return (
    <SocketProvider>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<SelectLogin />} />

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
    </SocketProvider>
  );
}

export default App;
