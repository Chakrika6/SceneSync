// // client/src/App.jsx
// import React from "react";
// // 🛑 IMPORTANT: Only import what you use. We only need Routes, Route, and Navigate here.
// import { Routes, Route, Navigate } from "react-router-dom"; 

// // Context Provider
// import { SocketProvider } from "./context/SocketContext";

// // PUBLIC PAGES
// import UserLogin from "./pages/UserLogin";
// import EditorLogin from "./pages/EditorLogin";
// import UserSignup from "./pages/UserSignup";
// import SelectLogin from "./pages/SelectLogin"; 
// import Submit from "./pages/submit";
// import SubmissionDetail from './pages/SubmissionDetail';

// // PRIVATE PAGES 
// import UserHome from "./pages/UserHome"; 
// import UserDashboard from "./pages/UserDashboard"; 
// import EditorDashboard from './pages/EditorDashboard';

// // LAYOUTS/HELPERS
// import EditorLayout from "./components/editor/EditorLayout"; 
// import PrivateRoute from "./components/PrivateRoute"; 
// import EditorRoute from "./components/EditorRoute"; 

// import "./index.css";


// export default function App() {
//   return (
//     <SocketProvider>
//       {/* 🛑 REMOVED: The outer <Router> tags are gone! */}
//       <Routes>

//         {/* Root/Landing Page */}
//         <Route path="/" element={<SelectLogin />} />

//         {/* Public Authentication */}
//         <Route path="/user/login" element={<UserLogin />} />
//         <Route path="/user/signup" element={<UserSignup />} />
//         <Route path="/editor/login" element={<EditorLogin />} />
//         <Route path="/submit" element={<Submit />} />
//         <Route path="/user/task/:id/submit" element={<div>Submission Form Placeholder</div>} />
//         <Route path="/user/task/:id/submit" element={<Submit />} />

//         {/* User Private Routes (Protected by PrivateRoute) */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/home" element={<UserHome />} /> 
//           <Route path="/user/dashboard" element={<UserDashboard />} />
//         </Route>

//         {/* Editor Private Routes (Protected by EditorRoute) */}
//         <Route element={<EditorRoute />}>
//           {/* Editor Dashboard - Using the Layout component */}
//           <Route 
//             path="/editor/dashboard" 
//             element={
//               <EditorLayout>
//                 <EditorDashboard />
//               </EditorLayout>
//             } 
//           />
//           {/* Editor Submission Detail - Using the Layout component */}
//           <Route 
//             path="/editor/submission/:id" 
//             element={
//               <EditorLayout>
//                 <SubmissionDetail />
//               </EditorLayout>
//             } 
//           />
//         </Route>

//         {/* FALLBACK: Redirects to the login selection page */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </SocketProvider>
//   );
// }
// client/src/App.jsx
// import React from "react";
// // 🛑 IMPORTANT: Only import what you use.
// import { Routes, Route, Navigate } from "react-router-dom"; 

// // Context Provider
// import { SocketProvider } from "./context/SocketContext";

// // PUBLIC PAGES
// import UserLogin from "./pages/UserLogin";
// import EditorLogin from "./pages/EditorLogin";
// import UserSignup from "./pages/UserSignup";
// import SelectLogin from "./pages/SelectLogin"; 

// // PRIVATE PAGES 
// import UserHome from "./pages/UserHome"; 
// import UserDashboard from "./pages/UserDashboard"; 
// import Submit from "./pages/submit"; // Moved here because it requires Auth
// import EditorDashboard from './pages/EditorDashboard';
// import SubmissionDetail from './pages/SubmissionDetail';

// // LAYOUTS/HELPERS
// import EditorLayout from "./components/editor/EditorLayout"; 
// import PrivateRoute from "./components/PrivateRoute"; 
// import EditorRoute from "./components/EditorRoute"; 

// import "./index.css";

// export default function App() {
//   return (
//     <SocketProvider>
//       <Routes>

//         {/* --- Root/Landing Page --- */}
//         <Route path="/" element={<SelectLogin />} />

//         {/* --- Public Authentication --- */}
//         <Route path="/user/login" element={<UserLogin />} />
//         <Route path="/user/signup" element={<UserSignup />} />
//         <Route path="/editor/login" element={<EditorLogin />} />

//         {/* --- User Private Routes (Must be logged in) --- */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/home" element={<UserHome />} /> 
//           <Route path="/user/dashboard" element={<UserDashboard />} />
          
//           {/* Moved Submit here! 
//             We use a generic path because we pass the specific Task ID 
//             via React Router 'state' (from your TaskCard).
//           */}
//           <Route path="/submit" element={<Submit />} />
//         </Route>

//         {/* --- Editor Private Routes (Must be an Editor) --- */}
//         <Route element={<EditorRoute />}>
          
//           {/* Editor Dashboard */}
//           <Route 
//             path="/editor/dashboard" 
//             element={
//               <EditorLayout>
//                 <EditorDashboard />
//               </EditorLayout>
//             } 
//           />
          
//           {/* Editor Submission Detail */}
//           <Route 
//             path="/editor/submission/:id" 
//             element={
//               <EditorLayout>
//                 <SubmissionDetail />
//               </EditorLayout>
//             } 
//           />
//         </Route>

//         {/* --- Fallback: Redirect unknown URLs to home --- */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </SocketProvider>
//   );
// }
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context
import { SocketProvider } from "./context/SocketContext";

// PUBLIC PAGES
import SelectLogin from "./pages/SelectLogin";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import EditorLogin from "./pages/EditorLogin";

// USER PAGES (PRIVATE)
import UserHome from "./pages/UserHome";
import UserDashboard from "./pages/UserDashboard";
import Submit from "./pages/submit";

// EDITOR PAGES (PRIVATE)
import EditorDashboard from "./pages/EditorDashboard";
import SubmissionDetail from "./pages/SubmissionDetail";

// ROUTE GUARDS
import PrivateRoute from "./components/PrivateRoute";
import EditorRoute from "./components/EditorRoute";

// LAYOUTS
import EditorLayout from "./components/editor/EditorLayout";

import "./index.css";

export default function App() {
  return (
    <SocketProvider>
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<SelectLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/editor/login" element={<EditorLogin />} />

        {/* ---------------- USER PRIVATE ROUTES ---------------- */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/submit" element={<Submit />} />
        </Route>

        {/* ---------------- EDITOR PRIVATE ROUTES ---------------- */}
        <Route element={<EditorRoute />}>
          <Route
            path="/editor/dashboard"
            element={
              <EditorLayout>
                <EditorDashboard />
              </EditorLayout>
            }
          />

          <Route
            path="/editor/submission/:id"
            element={
              <EditorLayout>
                <SubmissionDetail />
              </EditorLayout>
            }
          />
        </Route>

        {/* ---------------- FALLBACK ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </SocketProvider>
  );
}

