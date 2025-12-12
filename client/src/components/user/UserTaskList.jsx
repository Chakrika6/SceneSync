import React from "react";
import TaskCard from "./TaskCard";

export default function UserTaskList({ tasks = [] }) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks available at the moment.</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
//new commit