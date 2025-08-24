import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [regNoInput, setRegNoInput] = useState("");
  const [regNoError, setRegNoError] = useState<string>('');
  const { login } = useAuth();

  // Validate registration number format
  const validateRegNo = (regNo: string): boolean => {
    // Pattern: 2 digits + 2-3 letters + 4 digits
    // Examples: 22BCE9126, 22BBA7024, 23CS1234, 24AI5678
    const regNoPattern = /^[7892]\d{1}[A-Z]{2,3}\d{4}$/;
    return regNoPattern.test(regNo.toUpperCase());
  };

  // Handle input change with validation
  const handleInputChange = (inputValue: string) => {
    setRegNoInput(inputValue);
    
    if (inputValue.trim() === '') {
      setRegNoError('');
    } else if (!validateRegNo(inputValue)) {
      setRegNoError('Invalid format');
    } else {
      setRegNoError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regNoInput.trim()) {
      setRegNoError('Registration number is required');
      return;
    }

    if (!validateRegNo(regNoInput)) {
      setRegNoError('Invalid format');
      return;
    }

    setRegNoError('');
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
              placeholder="e.g., 22BCE9126"
              value={regNoInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className={regNoError ? "border-destructive" : ""}
            />
            {regNoError && (
              <p className="text-xs text-destructive mt-1">
                {regNoError}
              </p>
            )}
            </Label>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


