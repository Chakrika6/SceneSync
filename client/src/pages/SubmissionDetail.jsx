// SubmissionDetail.jsx
// Purpose: Show full details of a single submission and provide approve/reject panel.
// Backend endpoint expected: GET /api/submissions/:id
import React, { useEffect, useState } from "react";
import axios from "axios";
import ApproveRejectPanel from "./ApproveRejectPanel";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const api = axios.create({ baseURL: API_BASE });

export default function SubmissionDetail() {
  // Get id from the URL (simple parsing)
  const id = window.location.pathname.split("/").pop();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadSubmission() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/submissions/${id}`);
      setSubmission(res.data);
    } catch (err) {
      console.error("Failed to load submission:", err?.response?.data || err.message);
      setError("Failed to load submission.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading submission...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!submission) return <div style={{ padding: 20 }}>Submission not found.</div>;

  const previewUrl = submission.storage_path || "";

  return (
    <div style={{ padding: 20 }}>
      <h2>Submission Review</h2>

      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        <div style={{ maxWidth: 600 }}>
          {previewUrl ? (
            // show image or video depending on file type (basic detection)
            /\.(mp4|webm|ogg)$/i.test(previewUrl) ? (
              <video src={previewUrl} controls style={{ width: "100%" }} />
            ) : (
              <img src={previewUrl} alt="submission" style={{ width: "100%" }} />
            )
          ) : (
            <div style={{ width: "100%", height: 360, background: "#eee" }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3>AI Verification</h3>
          <div>
            <strong>Final score:</strong> {submission.ai_relevance_score ?? "—"}
          </div>
          <div>
            <strong>Location (GPS):</strong>{" "}
            {submission.gps_lat && submission.gps_lng
              ? `${submission.gps_lat}, ${submission.gps_lng}`
              : "Not available"}
          </div>
          <div>
            <strong>Captured at:</strong>{" "}
            {submission.captured_at ? new Date(submission.captured_at).toLocaleString() : "—"}
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Vision labels</h4>
            {submission.metadata?.labels?.length ? (
              <ul>
                {submission.metadata.labels.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            ) : (
              <p>No labels returned</p>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>SafeSearch</h4>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(submission.metadata?.safeSearch || submission.metadata?.safeSearchAnnotation || {}, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: 16 }}>
            <ApproveRejectPanel submissionId={submission.id} onSuccess={() => window.location.href = "/editor/dashboard"} />
          </div>
        </div>
      </div>
    </div>
  );
}
