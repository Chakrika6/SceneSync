import React, { useState, useEffect, useContext } from 'react';
import { MapViewer } from '../components/MapViewer';
import axios from '../api/axios';
import { SocketContext } from '../context/SocketContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const EditorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_submission', (data) => {
      console.log('New submission received:', data);
      setSubmissions((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('new_submission');
    };
  }, [socket]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('/api/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/3 bg-white p-6 overflow-y-auto shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Editor Dashboard
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          {submissions.length} incident(s) reported
        </p>

        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Report #{sub.id}</h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      sub.ai_score >= 70
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {sub.ai_score >= 70 ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {sub.ai_score}% Trust
                  </div>
                </div>

                {sub.image_url && (
                  <img
                    src={sub.image_url}
                    alt="Report"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <p className="text-xs text-gray-600">
                  📍{' '}
                  {sub.lat && sub.lng
                    ? `${sub.lat.toFixed(4)}, ${sub.lng.toFixed(4)}`
                    : 'No location'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(sub.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Map */}
      <div className="w-2/3">
        <MapViewer submissions={submissions} />
      </div>
    </div>
  );
};
