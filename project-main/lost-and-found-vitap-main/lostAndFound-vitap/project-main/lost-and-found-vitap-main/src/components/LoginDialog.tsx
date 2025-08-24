import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";

interface LoginDialogProps {
  trigger?: React.ReactNode;
}

const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
    setValue(inputValue);
    
    if (inputValue.trim() === '') {
      setRegNoError('');
          } else if (!validateRegNo(inputValue)) {
        setRegNoError('Invalid format');
      } else {
      setRegNoError('');
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">Login</Button>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setRegNoError('Registration number is required');
      return;
    }

    if (!validateRegNo(value)) {
      setRegNoError('Invalid format');
      return;
    }

    setRegNoError('');
    login(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setValue('');
        setRegNoError('');
      }
    }}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Login with University Reg No</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label className="space-y-2">
            <span>Registration Number</span>
            <Input
              placeholder="e.g., 22BCE9126"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              className={regNoError ? "border-destructive" : ""}
            />
            {regNoError && (
              <p className="text-xs text-destructive">
                {regNoError}
              </p>
            )}
          </Label>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;


