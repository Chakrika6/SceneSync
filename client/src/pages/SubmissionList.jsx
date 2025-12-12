// SubmissionList.jsx
// Purpose: simple list wrapper that renders SubmissionCard for each submission
import React from "react";
import SubmissionCard from "./SubmissionCard";

export default function SubmissionList({ submissions = [] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {submissions.map((s) => (
        <SubmissionCard key={s.id} submission={s} />
      ))}
    </div>
  );
}
