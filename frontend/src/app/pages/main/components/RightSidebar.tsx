import React from "react";
import {
  GitMerge,
  Rocket,
  Terminal,
  Shield,
  TrendingUp,
  BookOpen,
  Globe,
  FileText,
  Star,
  Coffee,
  Settings,
  HelpCircle,
} from "lucide-react";

const RightSidebar = () => {
  const specialLinks = [
    {
      icon: GitMerge,
      label: "Code Reviews",
      href: "/code-reviews",
    },
    {
      icon: Terminal,
      label: "Sandbox",
      href: "/sandbox",
    },
    {
      icon: Shield,
      label: "Security Tips",
      href: "/security-tips",
    },
    {
      icon: TrendingUp,
      label: "Trending Tech",
      href: "/trending-tech",
    },
    {
      icon: BookOpen,
      label: "Learning Hub",
      href: "/learning-hub",
    },
    {
      icon: Globe,
      label: "Global Rankings",
      href: "/global-rankings",
    },
    {
      icon: FileText,
      label: "Resume Builder",
      href: "/resume-builder",
    },
    {
      icon: Star,
      label: "Featured Projects",
      href: "/featured-projects",
    },
    {
      icon: Coffee,
      label: "Take a Break",
      href: "/take-a-break",
    },
  ];

  return (
    <div className="h-screen w-16 py-4 px-2 border-l border-light-border dark:border-dark-border bg-white dark:bg-dark-background z-10 transition-all duration-300 ease-in-out hover:w-64 group">
      <div className="flex flex-col h-full">
        {/* Special Links */}
        <nav className="flex-1">
          {specialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative group flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
            >
              <link.icon
                className={`
                  w-6 h-6
                  text-light-foreground/60 dark:text-dark-foreground/60
                  group-hover:text-light-primary dark:group-hover:text-dark-primary
                `}
              />
              {/* Label (visible on hover) */}
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                <p className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                  {link.label}
                </p>
              </div>
            </a>
          ))}
        </nav>

        {/* Bottom Links */}
        <nav>
          <a
            href="/settings"
            className="relative group flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
          >
            <Settings
              className={`
                w-6 h-6
                text-light-foreground/60 dark:text-dark-foreground/60
                group-hover:text-light-primary dark:group-hover:text-dark-primary
              `}
            />
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <p className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                Settings
              </p>
            </div>
          </a>
          <a
            href="/help"
            className="relative group flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
          >
            <HelpCircle
              className={`
                w-6 h-6
                text-light-foreground/60 dark:text-dark-foreground/60
                group-hover:text-light-primary dark:group-hover:text-dark-primary
              `}
            />
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <p className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                Help & Support
              </p>
            </div>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default RightSidebar;
