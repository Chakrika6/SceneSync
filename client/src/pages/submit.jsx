// client/src/pages/submit.jsx
import React, { useEffect, useState } from "react";
import CameraCapture from "../components/CameraCapture";
import DescriptionBox from "../components/DescriptionBox";
import RecorderWrapper from "../components/RecorderWrapper";
import { uploadSubmission } from "../api/submissions";

export default function SubmitPage() {
  const maxFiles = 4;
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null); 
  const [audioURL, setAudioURL] = useState(null); 
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 

  useEffect(() => {
    previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    const next = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name, size: f.size }));
    setPreviews(next);
    return () => next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
  }, [files]);

  function handleImagesChange(arr) {
    if (!arr) arr = [];
    setFiles(arr.slice(0, maxFiles));
  }

  function handleVideoChange(file) {
    setVideoFile(file || null);
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleRecorded(fileOrNull, urlOrNull) {
    if (!fileOrNull) {
      if (audioURL) try { URL.revokeObjectURL(audioURL) } catch {}
      setAudioURL(null);
      setAudioFile(null);
      return;
    }
    if (audioURL) try { URL.revokeObjectURL(audioURL) } catch {}
    setAudioFile(fileOrNull);
    setAudioURL(urlOrNull || null);
  }

  async function handleUpload() {
    // 1. Validation
    if (!files.length && !videoFile && !audioFile) {
      alert("Please add at least an image.");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0); 
    
    try {
      const form = new FormData();
      form.append("description", description || "");
      
      // 2. CRITICAL FIX FOR BACKEND
      // The backend 'upload.single("image")' accepts exactly ONE file named "image".
      if (files.length > 0) {
        form.append("image", files[0]); // Send first image only for MVP
      }
      
      // 3. Optional: If you update backend later to accept these, they are here.
      // if (videoFile) form.append("video", videoFile);
      // if (audioFile) form.append("audio", audioFile);

      // 4. Send to Backend
      const resp = await uploadSubmission(form); 
      
      console.log("uploadSubmission response", resp);
      alert("Uploaded successfully! Status: " + resp.submission.status);
      
      // Reset Form
      setFiles([]);
      setPreviews([]);
      setVideoFile(null);
      setAudioFile(null);
      setDescription("");
      
    } catch (err) {
      console.error("handleUpload error", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="card !overflow-visible !min-h-[600px] p-4 rounded-xl bg-white shadow">
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">CitizenReporter</h1>
              <p className="text-gray-600 text-sm">Capture and report incidents.</p>
            </div>
            <span className="hidden sm:block bg-gray-100 px-3 py-2 rounded-full text-sm">
              {files.length}/{maxFiles}
            </span>
          </header>

          <main className="mt-5 space-y-6">
            <div className="flex items-center gap-3">
              <CameraCapture
                onImagesChange={handleImagesChange} 
                onVideoChange={handleVideoChange}
                maxImages={maxFiles}
                allowVideo={true}
                accept="image/*"
              />
              <div className="text-xs text-gray-500">Use back camera for clarity.</div>
            </div>

            <DescriptionBox value={description} onChange={setDescription} />

            <section id="recorder-section" className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                 <label className="block text-sm font-medium text-gray-700">Record a voice message</label>
                 <div className="text-xs text-gray-400">{audioFile ? audioFile.name : "No recording"}</div>
              </div>
              <RecorderWrapper onRecorded={handleRecorded} />
            </section>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previews.map((p, i) => (
                <div key={i} className="relative border rounded-lg overflow-hidden h-36">
                    <img src={p.url} className="w-full h-full object-cover" alt={p.name} />
                    <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-white rounded-full px-2 shadow">✕</button>
                </div>
                ))}
            </div>

            <button 
                onClick={handleUpload} 
                disabled={uploading} 
                className={w-full py-3 rounded-xl text-white font-bold ${uploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}}
            >
                {uploading ? "Uploading..." : "Submit Report"}
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}