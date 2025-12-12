import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SelectLogin() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Card className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to CitizenReporter</h1>
        <p className="text-brand-light mb-6">Continue as:</p>

        <div className="flex flex-col gap-4">
          <Button onClick={() => navigate("/user/login")}>
            Continue as User
          </Button>

          <Button onClick={() => navigate("/editor/login")}>
            Continue as Editor
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
