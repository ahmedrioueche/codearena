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

const LeftSidebar = ({}: {}) => {
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
        className="relative group text-black"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div
          className={`p-3 rounded-lg mb-2 cursor-pointer flex items-center 
            transition-all duration-200
            hover:bg-light-primary/10 dark:hover:bg-dark-primary/10
            ${
              isActive
                ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                : "text-light-foreground/60 dark:text-dark-foreground/60"
            }
          `}
        >
          <Icon className={`w-6 h-6`} />
          <span
            className={`ml-3 text-sm font-medium transition-opacity duration-300 opacity-100 visible`}
          >
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen pt-24 px-2 border-r border-light-border dark:border-dark-border 
      bg-white dark:bg-dark-background z-10 transition-all duration-300 ease-in-out
       w-56`}
    >
      <div className="flex flex-col h-full">
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
  );
};

export default LeftSidebar;
