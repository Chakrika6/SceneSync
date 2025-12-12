// client/src/pages/submit.jsx
import React, { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import { uploadSubmission } from "../api/submissions";

export default function SubmitPage() {
  const [file, setFile] = useState(null);

  function handleFileSelected(filesArray) {
    // because CameraCapture sends an array
    if (filesArray && filesArray.length > 0) {
      setFile(filesArray[0]); // only take ONE file
    }
  }

  async function handleUpload() {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      const resp = await uploadSubmission({ file });
      console.log("upload response:", resp);
      alert("Uploaded!");
      setFile(null);
    } catch (err) {
      console.error("upload failed:", err);
      alert("Upload failed: " + (err.message || "unknown"));
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "20px auto" }}>
      <h2>Submit Incident</h2>

      <CameraCapture onFilesSelected={handleFileSelected} />

      {file && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Selected File:</strong> {file.name}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file}
        style={{ marginTop: 20, padding: "10px 14px", borderRadius: 8 }}
      >
        Upload
      </button>
    </div>
  );
}
