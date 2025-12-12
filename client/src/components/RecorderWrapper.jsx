import React, { useEffect, useState } from "react";
import AudioRecorder from "./AudioRecorder";

/**
 * RecorderWrapper
 * Implements fallback for browsers that block MediaRecorder/getUserMedia.
 * * Props: onRecorded: (file|null, url|null) => void
 */
export default function RecorderWrapper({ onRecorded }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUnsupported, setIsUnsupported] = useState(false); // 🚨 NEW state for fallback

  useEffect(() => {
    return () => {
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) {}
      }
    };
  }, [previewUrl]);

  function handleBlobRecorded(blobOrNull) {
    // clear
    if (!blobOrNull) {
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) {}
      }
      setPreviewUrl(null);
      if (typeof onRecorded === "function") onRecorded(null, null);
      return;
    }

    // convert Blob -> File + create preview URL
    try {
      const fileName = `recording_${Date.now()}.webm`;
      const file = new File([blobOrNull], fileName, { type: blobOrNull.type || "audio/webm" });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (typeof onRecorded === "function") onRecorded(file, url);
    } catch (err) {
      console.error("RecorderWrapper: failed to convert blob to file", err);
      // still notify with blob URL if conversion fails
      const url = URL.createObjectURL(blobOrNull);
      setPreviewUrl(url);
      if (typeof onRecorded === "function") onRecorded(null, url);
    }
  }

  // 🚨 NEW: Handler for the manual file upload fallback
  function handleFallbackUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Create a URL and notify the parent
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (typeof onRecorded === "function") onRecorded(file, url);
    }
  }

  // Helper function to check if the browser supports the MediaRecorder API
  const isMediaSupported = !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia && 
    window.MediaRecorder
  );

  useEffect(() => {
    if (!isMediaSupported) {
      setIsUnsupported(true);
    }
  }, [isMediaSupported]);
  

  return (
    <div>
      {/* Render the AudioRecorder only if supported, otherwise it triggers the fallback */}
      {isMediaSupported ? (
        <AudioRecorder onRecorded={handleBlobRecorded} />
      ) : (
         // 🚨 FALLBACK UI: Show manual upload if recording is unsupported
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800">
            Recording is not supported in this browser. Please upload an existing voice note:
          </p>
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFallbackUpload} 
            className="mt-2 text-sm"
            style={{ display: 'block' }}
          />
        </div>
      )}
      
      {/* Preview will be shown for both recorded audio and uploaded audio */}
      {previewUrl && (
        <div className="mt-3">
          <audio controls src={previewUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}