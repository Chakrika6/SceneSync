// client/src/pages/UserLogin.jsx

import { useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { userLogin } from "../api/auth"; // Import the API helper

export default function UserLogin() {
  const navigate = useNavigate(); // ✅ ADD THIS

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
      <Card className="max-w-md mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">User Login</h2>

        <Input 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <Button className="w-full mt-3">
          Sign In
        </Button>
      </Card>
    </PageContainer>
  );
}