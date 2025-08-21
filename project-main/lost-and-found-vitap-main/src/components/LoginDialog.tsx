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
  const { login } = useAuth();

  const defaultTrigger = (
    <Button variant="outline" size="sm">Login</Button>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    login(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              placeholder="e.g., 22BCE1234"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Label>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;


