import { useState } from "react";
import Button from "../components/ui/Button";

export default function ApproveRejectPanel({ submissionId }) {
  const [note, setNote] = useState("");

  return (
    <div>
      <textarea
        className="w-full border border-gray-300 rounded-base px-4 py-2 mb-4"
        placeholder="Optional review note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex gap-4">
        <Button variant="success">Approve</Button>
        <Button variant="danger">Reject</Button>
      </div>
    </div>
  );
}
