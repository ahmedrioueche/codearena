import Tippy from "@tippyjs/react";
import {
  Award,
  BarChart2,
  Code,
  HelpCircle,
  History,
  Home,
  LucideProps,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import React from "react";
import "tippy.js/dist/tippy.css";

const Sidebar = ({
  isCollapsed,
  onClose,
}: {
  isCollapsed: boolean;
  onClose: () => void;
}) => {
  const pathname = window.location.pathname;

  const navItems = [
    { icon: Home, label: "Home", href: "/", isImpl: true },
    { icon: Code, label: "Challenges", href: "/challenges", isImpl: false },
    { icon: History, label: "History", href: "/history", isImpl: false },
    { icon: BarChart2, label: "Analytics", href: "/analytics", isImpl: false },
    {
      icon: Award,
      label: "Achievements",
      href: "/achievements",
      isImpl: false,
    },
    { icon: Users, label: "Leaderboard", href: "/leaderboard", isImpl: false },
    {
      icon: MessageSquare,
      label: "Discussions",
      href: "/discussions",
      isImpl: false,
    },
  ];

  const bottomNavItems = [
    { icon: Settings, label: "Settings", href: "/settings", isImpl: false },
    { icon: HelpCircle, label: "Help", href: "/help", isImpl: false },
  ];

  interface NavItemType {
    icon: React.ComponentType<LucideProps>;
    label: string;
    href: string;
    isImpl?: boolean;
  }

  const NavItem: React.FC<NavItemType> = ({
    icon: Icon,
    label,
    href,
    isImpl = true,
  }) => {
    const isActive = pathname === href;

    const handleClick = () => {
      if (isImpl) {
        window.location.href = href;
      }
    };

    const itemContent = (
      <div
        className={`p-3 rounded-lg mb-2 flex items-center transition-all duration-200
          ${
            isImpl
              ? "cursor-pointer hover:bg-violet-500/10 dark:hover:bg-violet-500/20 hover:shadow-sm"
              : "cursor-auto opacity-50"
          }
          ${
            isActive && isImpl
              ? "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 shadow-sm border border-violet-500/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        onClick={handleClick}
        role={isImpl ? "button" : "none"}
        tabIndex={isImpl ? 0 : -1}
        onKeyDown={(e) => {
          if (isImpl && (e.key === "Enter" || e.key === " ")) handleClick();
        }}
      >
        <Icon className="w-6 h-6" />
        <span className="ml-3 text-sm font-medium">{label}</span>
      </div>
    );

    return !isImpl ? (
      <Tippy content="Coming soon!" placement="right" arrow={false}>
        {itemContent}
      </Tippy>
    ) : (
      itemContent
    );
  };

  return (
    <>
      {/* Backdrop - Only show on mobile */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-30 lg:hidden
          ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        onClick={onClose}
      />

      {/* Floating Sidebar */}
      <div
        className={`fixed top-24 left-4 h-[calc(100vh-7rem)] w-64 rounded-xl shadow-2xl z-40 
          transform transition-all duration-300 ease-in-out 
          border border-light-border/10 dark:border-white/5
          backdrop-blur-xl bg-white/70 dark:bg-[#0f172a]/70 
          supports-[backdrop-filter]:bg-white/10 suports-[backdrop-filter]:dark:bg-[#0f172a]/50
          ${
            isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
          }
          overflow-y-auto`}
        style={{
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex flex-col h-full pt-6 px-4">
          <div className="flex-1">
            <nav>
              {navItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </nav>
          </div>
          <nav className="pb-6">
            {bottomNavItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
