export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-base px-4 py-2 mb-3 
                  focus:outline-none focus:ring-2 focus:ring-brand-blue ${className}`}
    />
  );
}
