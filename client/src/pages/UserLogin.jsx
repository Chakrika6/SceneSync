import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function UserLogin() {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        <Button className="w-full mt-4">
          Sign In
        </Button>

        {/* ✅ SIGNUP LINK */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/user/signup")}
          >
            Sign up
          </span>
        </p>
      </Card>
    </PageContainer>
  );
}
