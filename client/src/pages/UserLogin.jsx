// client/src/pages/UserLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { userLogin } from "../api/auth"; // Import the API helper

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setLoading(true);

    try {
      // 1. Call the backend API (using the helper function)
      const response = await userLogin(email, password);

      // 2. Store the JWT Token securely
      localStorage.setItem("userToken", response.token);
      
      // 3. SUCCESS ACTION
      // Since the User Dashboard isn't ready yet, we show an alert and go to Home
      alert("Login Successful!");
      navigate("/"); 

    } catch (err) {
      // Display the error message from the backend (e.g., "Invalid credentials")
      setError(err.message || "Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <h2 className="text-3xl font-semibold mb-6">User Login</h2>

        {/* Display Error Message if login fails */}
        {error && <p className="text-red-600 font-bold mb-4">{error}</p>}

        {/* Wrap inputs in a form to handle 'Enter' key submission */}
        <form onSubmit={handleSubmit}>
            <Input 
              type="email" // Ensures mobile keyboards show @ symbol
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />

            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3" 
              required
            />

            <Button 
                className="w-full mt-3" 
                type="submit" 
                disabled={loading} // Disable button while loading
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
        </form>

        {/* Link to Sign Up (Visual only for now) */}
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/user/signup')}>Sign up</span>
        </p>
      </Card>
    </PageContainer>
  );
}