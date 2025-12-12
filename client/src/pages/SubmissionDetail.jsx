import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import ApproveRejectPanel from "./ApproveRejectPanel";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function SubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);

  async function loadSubmission() {
    try {
      const res = await axios.get(`${API_BASE}/submissions/${id}`);
      setSubmission(res.data);
    } catch {
      alert("Failed to load submission details");
    }
  }

  useEffect(() => {
    loadSubmission();
  }, []);

  if (!submission) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Submission #{submission.id}</h2>

        <img
          src={submission.storage_path}
          className="w-full rounded-base mb-6 shadow-card"
        />

        <div className="space-y-2 mb-6">
          <p><strong>AI Score:</strong> {submission.ai_relevance_score}</p>
          <p><strong>Lat/Lng:</strong> {submission.gps_lat}, {submission.gps_lng}</p>
          <p><strong>Status:</strong> {submission.final_status}</p>
        </div>

        <ApproveRejectPanel submissionId={submission.id} onSuccess={loadSubmission} />
      </Card>
    </PageContainer>
  );
}
