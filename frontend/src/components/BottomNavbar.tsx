import type React from "react";
import { useState, useEffect } from "react";
import { QrCode, FileText, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router";
import { useLogout } from "@/hooks/useLogout";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, href, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center px-2 sm:px-4 py-2 transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full transition-colors",
          isActive ? "bg-primary/10" : ""
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-xs font-medium hidden sm:block",
          isActive ? "font-semibold" : ""
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export function BottomNavbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const navItems = [
    {
      icon: <QrCode className="h-5 w-5 sm:h-6 sm:w-6" />,
      label: "Scan",
      href: "/admin/scan",
      onClick: () => setActiveIndex(0),
    },
    {
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6" />,
      label: "Participants",
      href: "/admin/participants",
      onClick: () => setActiveIndex(1),
    },
    {
      icon: <User className="h-5 w-5 sm:h-6 sm:w-6" />,
      label: "Register",
      href: "/admin/register",
      onClick: () => setActiveIndex(2),
    },
    {
      icon: <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />,
      label: "Sign Out",
      href: "#",
      onClick: () => {
        handleLogout(); // clear cookies, etc.
        navigate("/login"); // redirect
      },
    },
  ];

  // Update active index based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const index = navItems.findIndex((item) => item.href === currentPath);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-2 sm:p-4">
      <div className="flex items-center justify-between space-x-8 sm:space-x-6 rounded-[20px] border bg-background px-6 sm:px-6 py-1 shadow-sm">
        {navItems.map((item, index) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={activeIndex === index}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
}
