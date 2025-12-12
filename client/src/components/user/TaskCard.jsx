import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold">{task.title}</h2>

      <p className="text-gray-700 mt-1">{task.description}</p>

      <p className="text-sm text-gray-500 mt-2">
        <strong>Location:</strong> {task.location}
      </p>

      <p className="text-sm text-gray-500">
        <strong>Date:</strong> {new Date(task.created_at).toLocaleString()}
      </p>

      <Button
        className="mt-4"
        onClick={() => navigate(`/user/task/${task.id}/submit`)}
      >
        Submit Report
      </Button>
    </Card>
  );
}
