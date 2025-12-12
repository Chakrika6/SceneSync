// AreaSearch.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

export default function AreaSearch() {
  const [area, setArea] = useState("");
  const [results, setResults] = useState([]);

  async function doSearch() {
    if (!area) {
      alert("Enter an area name");
      return;
    }
    try {
      // backend expected: GET /api/search?area=...
      const res = await axios.get(`${API_BASE}/search?area=${encodeURIComponent(area)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Area search failed:", err?.response?.data || err.message);
      // mock results for UI testing:
      setResults([
        { id: "s1", title: "Traffic on Main St", snippet: "Large traffic jam reported near Main St." },
        { id: "s2", title: "Flooding in Market", snippet: "Water logging reported at central market." },
      ]);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input placeholder="Type area (eg. Koramangala)" value={area} onChange={(e) => setArea(e.target.value)} />
        <Button onClick={doSearch}>Search</Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-auto">
        {results.length === 0 && <div className="text-sm text-gray-500">No results</div>}
        {results.map(r => (
          <div key={r.id} className="p-2 border rounded">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-600">{r.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
