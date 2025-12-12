import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { INDIA_CITIES } from "../data/indiaCities";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    city: "",
    password: "",
    confirm: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignup() {
    if (!form.name || !form.username || !form.email || !form.city || !form.password) {
      alert("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Signup successful (mock). Redirecting to login...");
    navigate("/user/login");
  }

  return (
    <PageContainer>
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">User Signup</h1>

        <div className="space-y-4">

          <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />

          <Input name="username" placeholder="Username" value={form.username} onChange={handleChange} />

          <Input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />

          {/* CITY DROPDOWN */}
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="">Select Your City</option>
            {INDIA_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

          <Input name="confirm" type="password" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} />

          <Button className="w-full mt-4" onClick={handleSignup}>
            Sign Up
          </Button>

          <p
            className="text-center text-sm text-gray-600 mt-2 cursor-pointer hover:underline"
            onClick={() => navigate("/user/login")}
          >
            Already have an account? Login
          </p>

        </div>
      </Card>
    </PageContainer>
  );
}
