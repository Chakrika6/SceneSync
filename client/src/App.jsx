import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { UserHome } from './pages/UserHome';
import { EditorDashboard } from './pages/EditorDashboard';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/editor" element={<EditorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
