// EditorLogin.jsx
// Purpose: simple login form for editors. Sends credentials to backend for verification.
// Backend endpoint expected: POST /api/auth/editor-login
import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const api = axios.create({ baseURL: API_BASE });

export default function EditorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/editor-login", { email, password });
      // Expect: { success: true, token: "...", user: { id, name, role } } or similar
      // Save token/session if backend returns one (localStorage used here for simplicity)
      if (res.data?.token) {
        localStorage.setItem("editor_token", res.data.token);
      }
      // Redirect to editor dashboard
      window.location.href = "/editor/dashboard";
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Editor Login</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Signing in..." : "Sign in as Editor"}
        </button>
      </form>
    </div>
  );
}
