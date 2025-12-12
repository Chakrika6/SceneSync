export default function Card({ children }) {
  return (
    <div className="bg-white p-6 rounded-base shadow-card">
      {children}
    </div>
  );
}
