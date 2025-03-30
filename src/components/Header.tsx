
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Menu, X, Home, PlusCircle, History, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/firebase";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "There was a problem logging you out.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/new-request", label: "New Request", icon: <PlusCircle className="h-4 w-4" /> },
    { href: "/my-requests", label: "My Requests", icon: <History className="h-4 w-4" /> },
    { href: "/settings", label: "Settings", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Disaster Aid</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={isActive(link.href) ? "default" : "ghost"}
              size="sm"
            >
              <Link to={link.href} className="gap-1">
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm text-foreground"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <div className="flex flex-col space-y-2 mt-8">
              {links.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive(link.href) ? "default" : "ghost"}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={link.href} className="w-full justify-start gap-2">
                    {link.icon}
                    {link.label}
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
