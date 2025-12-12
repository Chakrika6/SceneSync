import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export const CameraCapture = ({ onCapture }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      onCapture(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <Camera size={48} className="text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            Capture or Upload Image
          </span>
          <input
            type="file"
            capture="environment"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
          <p className="text-xs text-gray-600 mt-2">{file.name}</p>
        </div>
      )}
    </div>
  );
};
