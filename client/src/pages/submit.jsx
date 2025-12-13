// // client/src/pages/submit.jsx
// import React, { use, useEffect, useState } from "react";
// import CameraCapture from "../components/CameraCapture";
// import DescriptionBox from "../components/DescriptionBox";
// import RecorderWrapper from "../components/RecorderWrapper";
// import { uploadSubmission } from "../api/submissions";
// import { useParams } from "react-router-dom";


// export default function SubmitPage() {
//   const{id:taskId}=useParams();
//   const maxFiles = 4;
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [videoFile, setVideoFile] = useState(null);
//   const [audioFile, setAudioFile] = useState(null); 
//   const [audioURL, setAudioURL] = useState(null); 
//   const [description, setDescription] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0); 


//   useEffect(() => {
//     previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
//     const next = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name, size: f.size }));
//     setPreviews(next);
//     return () => next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
//   }, [files]);

//   function handleImagesChange(arr) {
//     if (!arr) arr = [];
//     setFiles(arr.slice(0, maxFiles));
//   }

//   function handleVideoChange(file) {
//     setVideoFile(file || null);
//   }

//   function removeFile(idx) {
//     setFiles((prev) => prev.filter((_, i) => i !== idx));
//   }

//   function handleRecorded(fileOrNull, urlOrNull) {
//     if (!fileOrNull) {
//       if (audioURL) try { URL.revokeObjectURL(audioURL) } catch {}
//       setAudioURL(null);
//       setAudioFile(null);
//       return;
//     }
//     if (audioURL) try { URL.revokeObjectURL(audioURL) } catch {}
//     setAudioFile(fileOrNull);
//     setAudioURL(urlOrNull || null);
//   }

//   async function handleUpload() {
//     // 1. Validation
//     if (!files.length && !videoFile && !audioFile) {
//       alert("Please add at least an image.");
//       return;
//     }
    
//     setUploading(true);
//     setUploadProgress(0); 
    
//     try {
//       const form = new FormData();
//       form.append("description", description || "");
      
//       // 2. CRITICAL FIX FOR BACKEND
//       // The backend 'upload.single("image")' accepts exactly ONE file named "image".
//       if (files.length > 0) {
//         form.append("image", files[0]); // Send first image only for MVP
//       }
      
//       // 3. Optional: If you update backend later to accept these, they are here.
//       // if (videoFile) form.append("video", videoFile);
//       // if (audioFile) form.append("audio", audioFile);

//       // 4. Send to Backend
//       const resp = await uploadSubmission(form); 
      
//       console.log("uploadSubmission response", resp);
//       alert("Uploaded successfully! Status: " + resp.submission.status);
      
//       // Reset Form
//       setFiles([]);
//       setPreviews([]);
//       setVideoFile(null);
//       setAudioFile(null);
//       setDescription("");
      
//     } catch (err) {
//       console.error("handleUpload error", err);
//       alert("Upload failed: " + err.message);
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 sm:p-6">
//       <div className="max-w-3xl mx-auto">
//         <div className="card !overflow-visible !min-h-[600px] p-4 rounded-xl bg-white shadow">
//           <header className="flex justify-between items-start">
//             <div>
//               <h1 className="text-2xl font-bold">CitizenReporter</h1>
//               <p className="text-gray-600 text-sm">Capture and report incidents.</p>
//             </div>
//             <span className="hidden sm:block bg-gray-100 px-3 py-2 rounded-full text-sm">
//               {files.length}/{maxFiles}
//             </span>
//           </header>

//           <main className="mt-5 space-y-6">
//             <div className="flex items-center gap-3">
//               <CameraCapture
//                 onImagesChange={handleImagesChange} 
//                 onVideoChange={handleVideoChange}
//                 maxImages={maxFiles}
//                 allowVideo={true}
//                 accept="image/*"
//               />
//               <div className="text-xs text-gray-500">Use back camera for clarity.</div>
//             </div>

//             <DescriptionBox value={description} onChange={setDescription} />

//             <section id="recorder-section" className="bg-white border rounded-xl p-4 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                  <label className="block text-sm font-medium text-gray-700">Record a voice message</label>
//                  <div className="text-xs text-gray-400">{audioFile ? audioFile.name : "No recording"}</div>
//               </div>
//               <RecorderWrapper onRecorded={handleRecorded} />
//             </section>

//             {/* Thumbnails */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {previews.map((p, i) => (
//                 <div key={i} className="relative border rounded-lg overflow-hidden h-36">
//                     <img src={p.url} className="w-full h-full object-cover" alt={p.name} />
//                     <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-white rounded-full px-2 shadow">✕</button>
//                 </div>
//                 ))}
//             </div>

//             <button 
//                 onClick={handleUpload} 
//                 disabled={uploading} 
//                 className={`w-full py-3 rounded-xl text-white font-bold ${uploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
//             >
//                 {uploading ? "Uploading..." : "Submit Report"}
//             </button>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import CameraCapture from "../components/CameraCapture";
import DescriptionBox from "../components/DescriptionBox";
import RecorderWrapper from "../components/RecorderWrapper";
import { uploadSubmission } from "../api/submissions";

export default function SubmitPage() {
  const { id: taskId } = useParams(); // Get Task ID from URL
  const navigate = useNavigate();
  const maxFiles = 4;

  // --- STATE ---
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [description, setDescription] = useState("");
  
  // GPS State (CRITICAL for Verification)
  const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null });
  const [locError, setLocError] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // --- 1. PREVIEW MANAGEMENT ---
  useEffect(() => {
    previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    const next = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name, size: f.size }));
    setPreviews(next);
    return () => next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
  }, [files]);

  // --- 2. GPS CAPTURE (Auto-run on mount) ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      return;
    }

    // Watch position for high accuracy
    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocError(null);
      },
      (error) => {
        console.error("GPS Error:", error);
        setLocError("Please enable Location Services to verify incidents.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(geoId);
  }, []);

  // --- HANDLERS ---
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
    if (audioURL) { try { URL.revokeObjectURL(audioURL); } catch (e) {} }
    
    if (!fileOrNull) {
      setAudioURL(null);
      setAudioFile(null);
      return;
    }
    setAudioFile(fileOrNull);
    setAudioURL(urlOrNull || null);
  }

  async function handleUpload() {
    // 1. Validation
    if (!files.length && !videoFile && !audioFile) {
      alert("Please add at least one piece of evidence (Photo, Video, or Audio).");
      return;
    }

    if (!location.lat) {
      alert("⚠️ Waiting for GPS Location... We cannot verify this report without it.");
      return;
    }
    
    setUploading(true);
    setStatusMsg("Packaging evidence...");
    
    try {
      const form = new FormData();
      
      // 2. Append Metadata
      form.append("description", description || "");
      form.append("userLat", location.lat);
      form.append("userLng", location.lng);
      form.append("gpsAccuracy", location.accuracy);
      // Append Task ID if it exists (for specific tasks) or 'GENERAL'
      form.append("taskId", taskId || "GENERAL_REPORT"); 

      // 3. Append Files (Must match Backend Middleware!)
      files.forEach((file) => form.append("images", file)); 
      
      if (videoFile) {
        form.append("video", videoFile);
      }
      
      if (audioFile) {
        form.append("audio", audioFile, "voice_note.webm");
      }

      // 4. Send to Backend
      const resp = await uploadSubmission(form); 
      
      console.log("Server Response:", resp);
      setStatusMsg("✅ Verified & Submitted!");
      alert(`Report Submitted! Trust Score: ${resp.score || 'Pending'}`);
      
      // Reset Form & Redirect
      setFiles([]);
      setPreviews([]);
      setVideoFile(null);
      setAudioFile(null);
      setDescription("");
      
      // Optional: Go back to dashboard after success
      navigate('/user/dashboard');
      
    } catch (err) {
      console.error("handleUpload error", err);
      setStatusMsg("❌ Upload failed.");
      alert("Error: " + (err.message || "Submission failed"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 sm:p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="card !overflow-visible !min-h-[600px] p-4 rounded-xl bg-white shadow">
          
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">CitizenReporter</h1>
              <p className="text-gray-600 text-sm">Capture and report incidents.</p>
            </div>
            {/* GPS Status Indicator */}
            <div className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium ${location.lat ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {location.lat ? "📍 GPS Locked" : "📡 GPS Searching..."}
            </div>
          </header>

          <main className="mt-5 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Visual Evidence</label>
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
            </div>

            <DescriptionBox value={description} onChange={setDescription} />

            <section id="recorder-section" className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                 <label className="block text-sm font-medium text-gray-700">Voice Report (Optional)</label>
                 <div className="text-xs text-gray-400">{audioFile ? "Audio Recorded" : "No recording"}</div>
              </div>
              <RecorderWrapper onRecorded={handleRecorded} />
            </section>

            {/* Thumbnails */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previews.map((p, i) => (
                <div key={i} className="relative border rounded-lg overflow-hidden h-36 bg-gray-100">
                    <img src={p.url} className="w-full h-full object-cover" alt={p.name} />
                    <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-white rounded-full px-2 shadow font-bold text-gray-600 hover:text-red-600">✕</button>
                </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleUpload} 
              disabled={uploading || !location.lat} 
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all
                ${uploading || !location.lat 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"}`}
            >
              {uploading ? statusMsg : (location.lat ? "Submit Verified Report" : "Waiting for GPS...")}
            </button>
            
            {statusMsg && <p className="text-center text-sm text-gray-500 mt-2">{statusMsg}</p>}
          </main>
        </div>
      </div>
    </div>
  );
}