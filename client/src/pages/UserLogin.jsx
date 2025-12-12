import { useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageContainer>
      <Card>
        <h2 className="text-3xl font-semibold mb-6">User Login</h2>

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
