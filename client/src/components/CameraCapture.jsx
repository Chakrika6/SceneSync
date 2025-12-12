// client/src/components/CameraCapture.jsx
import React, { useRef } from "react";

export default function CameraCapture({ onCapture }) {
  const inputRef = useRef();

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (typeof onCapture === "function") {
      onCapture(file);
    } else {
      console.warn("CameraCapture: onCapture missing");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <button
        onClick={() => inputRef.current.click()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Take / Upload Photo
      </button>
    </div>
  );
}