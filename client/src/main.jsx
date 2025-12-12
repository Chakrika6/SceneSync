import React from "react";
import { createRoot } from "react-dom/client";
import SubmitPage from "./pages/submit.jsx"; // 🚨 Ensure .jsx extension is here
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* 🚨 TEMPORARILY FORCE RENDERING YOUR WORKING SUBMIT PAGE */}
    <SubmitPage />
  </React.StrictMode>
);

// 🚨 DELETE the App.jsx file or ensure it is NOT imported anywhere.
// DELETE the router code from App.jsx if you kept the file.