// client/src/pages/UserLogin.jsx

import { useState } from "react";
// Import useNavigate from react-router-dom
import { useNavigate } from "react-router-dom"; 
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { userLogin } from "../api/auth"; // Import the API helper

export default function UserLogin() {
  // Only declare navigate once
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setLoading(true);

    try {
      // 1. Call the backend API (using the helper function)
      const response = await userLogin(email, password);

      // 2. Store the JWT Token securely
      localStorage.setItem("userToken", response.token);
      
      // 3. SUCCESS ACTION: Navigate directly to the User Dashboard
      // ➡️ This is the crucial change to /user/dashboard
      navigate("/user/dashboard"); 

    } catch (err) {
      // Display the error message from the backend (e.g., "Invalid credentials")
      setError(err.message || "Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card className="max-w-md mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">User Login</h2>
        
        {/* Display Error Message */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input 
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
      </Card>
    </PageContainer>
  );
}