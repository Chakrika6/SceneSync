import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const MapViewer = ({ submissions = [] }) => {
  const center = submissions.length > 0
    ? [submissions[0].lat || 40.7128, submissions[0].lng || -74.006]
    : [40.7128, -74.006];

  const validSubmissions = submissions.filter(
    (sub) => sub.lat && sub.lng
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {validSubmissions.map((submission) => (
        <Marker
          key={submission.id}
          position={[submission.lat, submission.lng]}
        >
          <Popup>
            <div className="p-2">
              <img
                src={submission.image_url}
                alt="Report"
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <p className="text-sm font-bold">AI Score: {submission.ai_score}%</p>
              <p className="text-xs text-gray-600">
                {new Date(submission.created_at).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
