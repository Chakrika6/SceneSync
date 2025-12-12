// SubmissionCard.jsx
// Purpose: small card showing preview info and a Review button
import React from "react";

export default function SubmissionCard({ submission }) {
  // submission.storage_path is expected to be a previewable URL
  const previewUrl = submission?.storage_path || "";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div style={{ width: 200 }}>
        {previewUrl ? (
          <img src={previewUrl} alt="preview" style={{ width: "100%", height: "auto" }} />
        ) : (
          <div style={{ width: "100%", height: 120, background: "#f4f4f4" }} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div>
          <strong>Submission:</strong> {submission.id}
        </div>
        <div>
          <strong>User:</strong> {submission.user_id}
        </div>
        <div>
          <strong>Task:</strong> {submission.task_id || "—"}
        </div>
        <div>
          <strong>Score:</strong> {submission.ai_relevance_score ?? "—"}
        </div>
        <div>
          <strong>Submitted:</strong>{" "}
          {submission.created_at ? new Date(submission.created_at).toLocaleString() : "—"}
        </div>
      </div>

      <div>
        <button
          onClick={() => (window.location.href = `/editor/submission/${submission.id}`)}
          style={{ padding: "8px 12px" }}
        >
          Review
        </button>
      </div>
    </div>
  );
}
