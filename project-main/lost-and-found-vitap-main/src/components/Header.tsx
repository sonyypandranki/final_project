import { Plus, User, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import LoginDialog from "./LoginDialog";
import { useAuth } from "../hooks/useAuth";
import SmartSearch from "./SmartSearch";
import { useState } from "react";

const Header = () => {
  const { isLoggedIn, regNo, logout } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Lost & Found
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex">
            <SmartSearch />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">{regNo}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <LoginDialog />
          )}

          
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Search Items</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SmartSearch />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;