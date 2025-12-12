import React, { useRef, useState, useEffect } from "react";

/**
 * CameraCapture
 * - uses only modern handlers: onImagesChange, onVideoChange
 * - maxImages, allowVideo, accept props retained
 *
 * REPLACE THE FILE ENTIRELY.
 */

export default function CameraCapture(props) {
  const {
    onImagesChange, // 🚨 Only used modern image handler
    onVideoChange,
    maxImages = 4,
    allowVideo = true,
    accept = "image/*",
  } = props || {};

  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [images, setImages] = useState([]); // { file, url }[]
  const [video, setVideo] = useState(null); // { file, url } | null

  // cleanup on unmount
  useEffect(() => {
    return () => {
      images.forEach((i) => {
        try { URL.revokeObjectURL(i.url); } catch (e) {}
      });
      if (video && video.url) {
        try { URL.revokeObjectURL(video.url); } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🚨 FIX: Helper only calls the definitive handler (onImagesChange)
  function notifyImageHandlers(imgFileList) {
    if (typeof onImagesChange === "function") {
      try { onImagesChange(imgFileList); } catch (e) { console.error(e); }
    }
  }

  // Helper to call video-related handlers
  function notifyVideoHandlers(videoFileOrNull) {
    if (typeof onVideoChange === "function") {
      try { onVideoChange(videoFileOrNull); } catch (e) { console.error(e); }
    }
  }

  function handleImageChange(e) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const spaceLeft = Math.max(0, maxImages - images.length);
    const toAdd = picked.slice(0, spaceLeft).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const updated = images.concat(toAdd).slice(0, maxImages);

    setImages(updated);
    notifyImageHandlers(updated.map(i => i.file));

    // reset input (allow re-select same file)
    e.target.value = "";
  }

  function handleVideoChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    // revoke previous
    if (video && video.url) {
      try { URL.revokeObjectURL(video.url); } catch (err) {}
    }

    const v = { file: f, url: URL.createObjectURL(f) };
    setVideo(v);
    notifyVideoHandlers(f);

    e.target.value = "";
  }

  function removeImage(index) {
    const copy = images.slice();
    const removed = copy.splice(index, 1)[0];
    if (removed && removed.url) {
      try { URL.revokeObjectURL(removed.url); } catch (err) {}
    }
    setImages(copy);
    notifyImageHandlers(copy.map(i => i.file));
  }

  function removeVideo() {
    if (video && video.url) {
      try { URL.revokeObjectURL(video.url); } catch (err) {}
    }
    setVideo(null);
    notifyVideoHandlers(null);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* hidden inputs */}
      <input
        ref={imgInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleImageChange}
        className="sr-only"
        aria-hidden="true"
      />

      {allowVideo && (
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={handleVideoChange}
          className="sr-only"
          aria-hidden="true"
        />
      )}

      {/* controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => imgInputRef.current && imgInputRef.current.click()}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none"
        >
          Add Photos ({images.length}/{maxImages})
        </button>

        {allowVideo && (
          <button
            type="button"
            onClick={() => videoInputRef.current && videoInputRef.current.click()}
            className="rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none"
          >
            {video ? "Replace Video" : "Add Video"}
          </button>
        )}
      </div>

      {/* image previews */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={img.url}
              alt={`preview-${idx}`}
              className="object-cover w-full h-32 sm:h-24"
              draggable="false"
            />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow-sm"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        {/* empty slots visual */}
        {Array.from({ length: Math.max(0, maxImages - images.length) }).map((_, i) => (
          <div key={`slot-${i}`} className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 h-32 sm:h-24 text-gray-300">
            <div className="text-center">
              <div className="text-2xl">＋</div>
              <div className="text-xs mt-1">Photo</div>
            </div>
          </div>
        ))}
      </div>

      {/* video preview */}
      {allowVideo && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
          {video ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-black/5">
              <video
                src={video.url}
                controls
                playsInline
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeVideo}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm shadow-sm"
                aria-label="Remove video"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-sm">No video selected</div>
                <div className="text-xs text-gray-500 mt-1">Tap "Add Video" to record or choose</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}