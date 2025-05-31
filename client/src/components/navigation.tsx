import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { Bell, Menu, Terminal, Settings, LogOut, User } from "lucide-react";

export function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "AT";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Terminal className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-neutral-dark">AthleteTravel</span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a
                href="#dashboard"
                className="text-primary border-b-2 border-primary px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="#search"
                className="text-neutral-dark hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Search Events
              </a>
              <a
                href="#planning"
                className="text-neutral-dark hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Trip Planning
              </a>
              <a
                href="#tracking"
                className="text-neutral-dark hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Progress
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-neutral-dark hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-athletic text-white font-semibold text-xs">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-neutral-dark font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <a href="#dashboard" className="text-primary font-medium px-3 py-2">Dashboard</a>
              <a href="#search" className="text-neutral-dark hover:text-primary px-3 py-2">Search Events</a>
              <a href="#planning" className="text-neutral-dark hover:text-primary px-3 py-2">Trip Planning</a>
              <a href="#tracking" className="text-neutral-dark hover:text-primary px-3 py-2">Progress</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
