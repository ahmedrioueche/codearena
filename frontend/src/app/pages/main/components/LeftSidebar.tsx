import React from "react";
import {
  Home,
  Code,
  History,
  BarChart2,
  Award,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";
import { LucideProps } from "lucide-react";

const LeftSidebar = ({
  isCollapsed,
  onClose,
}: {
  isCollapsed: boolean;
  onClose: () => void;
}) => {
  const pathname = window.location.pathname;

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Code, label: "Challenges", href: "/challenges" },
    { icon: History, label: "History", href: "/history" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Award, label: "Achievements", href: "/achievements" },
    { icon: Users, label: "Leaderboard", href: "/leaderboard" },
    { icon: MessageSquare, label: "Discussions", href: "/discussions" },
  ];

  const bottomNavItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  interface NavItemType {
    icon: React.ComponentType<LucideProps>;
    label: string;
    href: string;
  }

  const NavItem: React.FC<NavItemType> = ({ icon: Icon, label, href }) => {
    const isActive = pathname === href;

    const handleClick = () => {
      window.location.href = href;
    };

    return (
      <div
        className={`p-3 rounded-lg mb-2 cursor-pointer flex items-center transition-all duration-200
          hover:bg-light-primary/10 dark:hover:bg-dark-primary/10
          ${
            isActive
              ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
              : "text-light-foreground/60 dark:text-dark-foreground/60"
          }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        <Icon className="w-6 h-6" />
        <span className="ml-3 text-sm font-medium">{label}</span>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-30
          ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64  border-r border-light-border dark:border-dark-border 
          z-40 transform transition-transform duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        style={{
          background:
            "linear-gradient(135deg, #000814 0%, #00101F 50%, #00182B 100%)",
        }}
      >
        <div className="flex flex-col h-full pt-24 px-4">
          <div className="flex-1">
            <nav>
              {navItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </nav>
          </div>
          <nav>
            {bottomNavItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
