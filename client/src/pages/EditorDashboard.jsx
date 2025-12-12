import React, { useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import TaskSidebar from "../components/editor/TaskSidebar";

export default function EditorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <PageContainer>
      {/* Sidebar + Main Content Layout */}
      <div className="flex w-full h-full">

        {/* LEFT SIDEBAR */}
        <TaskSidebar />

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Editor Dashboard
          </h1>

          <p className="text-gray-600">
            This is the workspace where editors manage tasks & view reports.
          </p>

          {/* Placeholder until backend connects */}
          <div className="mt-6 p-6 bg-white shadow-card rounded-base">
            <h2 className="text-xl font-semibold mb-2">Submission Review Panel</h2>
            <p className="text-gray-500">Select a submission from incoming reports.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
