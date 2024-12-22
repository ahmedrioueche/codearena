"use client";
import React, { useState, useEffect } from "react";
import { Cog, Maximize2, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { dict } from "../utils/dict";

const Navbar: React.FC<{}> = ({}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const language = useLanguage();
  const text = dict[language];

  // Check if the document is in fullscreen mode
  const checkFullscreen = () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  // Fullscreen Toggle Function
  const handleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen mode
      document.documentElement.requestFullscreen();
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Set up a listener to check fullscreen status
  useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("MSFullscreenChange", checkFullscreen);

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("MSFullscreenChange", checkFullscreen);
    };
  }, []);

  return (
    <>
      <nav
        className={`${
          isFullscreen ? "hidden" : "flex"
        } items-center justify-between px-6 py-4 z-50 bg-dark-background text-dark-foreground shadow-md`}
      >
        {/* Logo */}
        <div className="flex flex-row items-center space-x-2">
          <img src="/images/Fireball.svg" alt="Logo" className="h-7 w-7" />
          <div className="text-xl font-bold font-dancing">{text.app.name}</div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          {/* Settings Icon */}
          <button
            aria-label="Settings"
            className="hover:text-dark-secondary transition duration-300"
          >
            <Cog size={24} />
          </button>

          {/* Fullscreen Icon */}
          <button
            onClick={handleFullscreen}
            aria-label="Fullscreen"
            className="hover:text-dark-secondary transition duration-300"
          >
            <Maximize2 size={24} />
          </button>
        </div>
      </nav>

      {/* Floating button to bring navbar back */}
      {isFullscreen && (
        <button
          onClick={handleFullscreen}
          className="fixed bottom-4 right-4 bg-dark-background text-dark-foreground p-2 rounded-full shadow-md hover:text-dark-secondary transition duration-300"
          aria-label="Exit Fullscreen"
        >
          <ChevronDown size={24} />
        </button>
      )}
    </>
  );
};

export default Navbar;
