import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  Home,
  Utensils,
  LineChart,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { saveUserActivity } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({
  userName,
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onProfileClick = () => {},
  onSettingsClick = () => {},
  onLogoutClick,
}: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use the user's name from Supabase if available
  const displayName = userName || user?.user_metadata?.name || "User";

  // Generate avatar URL based on user's name
  const avatarUrl =
    userAvatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  const handleLogout = async () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      // Log the logout activity
      if (user) {
        await saveUserActivity({
          user_id: user.id,
          activity_type: "login",
          details: { action: "logout" },
        });
      }

      await signOut();
      navigate("/auth/login");
    }
  };

  // Navigation handlers
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="w-full h-16 md:h-20 px-4 md:px-6 lg:px-8 bg-background border-b border-border flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col h-full py-4">
              <div className="flex items-center gap-2 px-2 mb-6">
                <div className="bg-primary rounded-full p-1.5">
                  <img src="/vite.svg" alt="Logo" className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold">NutriTrack</h1>
              </div>

              <nav className="flex-1">
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium"
                      onClick={() => handleNavigate("/")}
                    >
                      <Home className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium"
                      onClick={() => handleNavigate("/meals")}
                    >
                      <Utensils className="mr-2 h-5 w-5" />
                      Meals
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium"
                      onClick={() => handleNavigate("/progress")}
                    >
                      <LineChart className="mr-2 h-5 w-5" />
                      Progress
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium"
                      onClick={() => onSettingsClick()}
                    >
                      <Target className="mr-2 h-5 w-5" />
                      Goals
                    </Button>
                  </li>
                </ul>
              </nav>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1.5">
            <img src="/vite.svg" alt="Logo" className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold hidden sm:block">
            NutriTrack
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => handleNavigate("/")}
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => handleNavigate("/meals")}
              >
                Meals
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => handleNavigate("/progress")}
              >
                Progress
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => onSettingsClick()}
              >
                Goals
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-[150px] md:w-[200px] lg:w-[250px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 md:h-9 md:w-9 rounded-full"
            >
              <Avatar>
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
