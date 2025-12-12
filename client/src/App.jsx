import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';

import SelectLogin from "./pages/SelectLogin";
import UserLogin from "./pages/UserLogin";
import EditorLogin from "./pages/EditorLogin";
import EditorDashboard from './pages/EditorDashboard';
import SubmissionDetail from './pages/SubmissionDetail';
import EditorLayout from "./components/editor/EditorLayout";
import './index.css';

function App() {
  return (
    <SocketProvider>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<SelectLogin />} />

        {/* USER LOGIN */}
        <Route path="/user/login" element={<UserLogin />} />

        {/* EDITOR LOGIN */}
        <Route path="/editor/login" element={<EditorLogin />} />

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
