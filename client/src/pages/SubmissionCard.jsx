import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SubmissionCard({ submission }) {
  return (
    <Card>
      <img
        src={submission.storage_path || "https://via.placeholder.com/600"}
        className="w-full h-48 object-cover rounded-base mb-4"
      />

      <h3 className="text-xl font-semibold mb-2">Submission #{submission.id}</h3>

      <p className="text-sm text-brand-light mb-2">
        AI Score: <span className="font-semibold">{submission.ai_relevance_score ?? "N/A"}</span>
      </p>

      <p className="text-sm text-brand-light mb-4">
        Created: {submission.created_at ? new Date(submission.created_at).toLocaleString() : "Unknown"}
      </p>

      <Button onClick={() => (window.location.href = `/editor/submission/${submission.id}`)}>
        Review
      </Button>
    </Card>
  );
}
