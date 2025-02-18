import React from "react";
import { User, Cog, Bell } from "lucide-react";
import logo from "/images/logo.svg";
import { settingsActions } from "../store";

const Navbar = () => {
  settingsActions.setTheme("dark");

  return (
    <nav className="fixed p-0 top-0 left-0 w-full bg-light-background dark:bg-dark-background border-b border-white/10 shadow-lg z-50">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex flex-row space-x-2 items-center">
          <img src={logo} alt="CodeArena" className="h-9 w-9" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing ">
            CodeArena
          </h1>
        </div>

        {/* Icons on the right */}
        <div className="flex items-center space-x-6">
          <button className="text-light-primary dark:text-dark-primary hover:scale-105 hover:text-light-secondary dark:hover:text-dark-secondary transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <button className="text-light-primary dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary transition-colors">
            <Cog className="w-6 h-6" />
          </button>
          <button className="text-light-primary dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary transition-colors">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
