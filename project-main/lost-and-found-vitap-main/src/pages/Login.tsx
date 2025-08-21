import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [regNoInput, setRegNoInput] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNoInput.trim()) return;
    login(regNoInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Use your University Registration Number</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label className="space-y-2">
              <span>Registration Number</span>
              <Input
                placeholder="e.g., 22BCE1234"
                value={regNoInput}
                onChange={(e) => setRegNoInput(e.target.value)}
              />
            </Label>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


