// EditorLayout.jsx
import React, { useState } from "react";
import EditorSidebar from "./TaskSidebar";

export default function EditorLayout({ children }) {
  // sidebar collapsed state could be added later
  const [isSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`w-80 border-r bg-white ${isSidebarOpen ? "" : "hidden"}`}>
        <EditorSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
