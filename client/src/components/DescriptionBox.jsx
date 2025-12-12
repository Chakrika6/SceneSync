// client/src/components/DescriptionBox.jsx
import React from "react";

/**
 * DescriptionBox
 * Props:
 *  - value: string
 *  - onChange: (newValue) => void
 *  - placeholder?: string
 */
export default function DescriptionBox({ value, onChange, placeholder = "Describe the incident..." }) {
  return (
    <section className="bg-white border rounded-xl p-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
      />
      <p className="text-xs mt-2 text-gray-500">Include who / what / when / where for verification.</p>
    </section>
  );
}
