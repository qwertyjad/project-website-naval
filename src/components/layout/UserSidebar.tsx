// src/components/layout/UserSidebar.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ShoppingCart,
  History,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface UserSidebarProps {
  className?: string;
}

const UserSidebar = ({ className = "" }: UserSidebarProps) => {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const navItems = [
    {
      name: "User Dashboard",
      href: "/user-dashboard",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Order History",
      href: "/user-orders",
      icon: <History className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      className={cn(
        "flex h-full w-[250px] flex-col bg-background border-r",
        className,
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/user-dashboard" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="font-bold text-lg">ConstructInv</span>
        </Link>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t p-4 space-y-2">
        <TooltipProvider>
          <div className="flex justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDarkMode ? "Light Mode" : "Dark Mode"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=staff"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Jane Staff</span>
            <span className="text-xs text-muted-foreground">Staff</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;