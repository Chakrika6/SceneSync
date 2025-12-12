// client/src/components/AudioRecorder.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function AudioRecorder({ onRecorded }) {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [audioURL, setAudioURL] = useState(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) setSupported(false);
  }, []);

  async function start() {
    if (!supported) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      if (typeof onRecorded === 'function') onRecorded(blob);
      // stop tracks
      stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorderRef.current = mr;
    mr.start();
    setRecording(true);
  }

  function stop() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();
    setRecording(false);
  }

  function clear() {
    setAudioURL(null);
    if (typeof onRecorded === 'function') onRecorded(null);
  }

  if (!supported) return <div>Your browser does not support audio recording</div>;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {!recording ? (
        <button onClick={start} style={{ padding: '8px 12px', borderRadius: 8, background: '#06b6d4', color: '#fff' }}>
          Record Voice
        </button>
      ) : (
        <button onClick={stop} style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#fff' }}>
          Stop
        </button>
      )}

      {audioURL && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <audio controls src={audioURL} />
          <button onClick={clear} style={{ padding: '6px 8px' }}>Remove</button>
        </div>
      )}
    </div>
  );
}
