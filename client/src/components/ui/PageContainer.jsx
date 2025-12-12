export default function PageContainer({ children }) {
  return (
    <div className="max-w-3xl mx-auto p-6 font-primary">
      {children}
    </div>
  );
}
