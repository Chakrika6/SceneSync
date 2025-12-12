import SubmissionCard from "./SubmissionCard";

export default function SubmissionList({ submissions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {submissions.map(sub => (
        <SubmissionCard key={sub.id} submission={sub} />
      ))}
    </div>
  );
}
