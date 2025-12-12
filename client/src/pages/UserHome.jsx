import React, { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import axios from "../api/axios";
import { Send } from "lucide-react";

export const UserHome = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCapture = (capturedFile) => {
    console.log("Captured File:", capturedFile);
    setFile(capturedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please capture or upload an image first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("media", file); // <-- IMPORTANT (backend expects `media`)
      formData.append("user_id", "1");

      const response = await axios.post(
        "/api/submissions/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Response:", response.data);

      setMessage("Report submitted successfully! ✓");
      setFile(null);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error submitting report.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CitizenReporter
          </h1>
          <p className="text-gray-600 mb-6">Report incidents in real-time</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Camera UI */}
            <CameraCapture onCapture={handleCapture} />

            {/* PREVIEW */}
            {file && (
              <div className="mt-3">
                <p className="text-sm text-gray-700">
                  Selected: <strong>{file.name}</strong> (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full max-h-64 object-cover rounded-lg mt-2"
                />
              </div>
            )}

            {/* STATUS MESSAGE */}
            {message && (
              <div
                className={`p-3 rounded-lg text-center text-sm font-medium ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Send size={20} />
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
