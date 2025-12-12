export default function Button({ children, onClick, variant = "primary", className = "" }) {
  const base =
    "px-4 py-2 rounded-lg text-white font-medium transition w-full";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
