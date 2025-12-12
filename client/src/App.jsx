import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';

// Correct default imports
import {UserHome} from './pages/UserHome';
import EditorLogin from './pages/EditorLogin';
import EditorDashboard from './pages/EditorDashboard';
import SubmissionDetail from './pages/SubmissionDetail';

import './index.css';

function App() {
  return (
    <SocketProvider>
      <Routes>

        {/* USER ROUTE */}
        <Route path="/" element={<UserHome />} />

        {/* EDITOR ROUTES */}
        <Route path="/editor/login" element={<EditorLogin />} />
        <Route path="/editor/dashboard" element={<EditorDashboard />} />
        <Route path="/editor/submission/:id" element={<SubmissionDetail />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </SocketProvider>
  );
}

export default App;
