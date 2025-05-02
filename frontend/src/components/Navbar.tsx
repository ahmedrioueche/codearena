import { User, LogOut } from "lucide-react";
import logo from "/images/logo.svg";
import { settingsActions } from "../store";
import { logout } from "../api/auth";
import toast from "react-hot-toast";
import { APP_PAGES } from "../constants/navigation";
import { useState, useRef, useEffect } from "react";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  settingsActions.setTheme("dark");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      location.href = APP_PAGES.login.route;
    } catch (e) {
      console.log(e);
      toast.error(`Logout failed, please try again`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="fixed p-0 top-0 left-0 w-full border-b border-white/10 shadow-lg z-50"
      style={{
        background: `
          linear-gradient(135deg, 
            #000E1D 0%,
            #00172A 50%,
            #002137 100%
          ),
          radial-gradient(
            ellipse at 20% 30%,
            rgba(0, 40, 80, 0.15) 0%,
            transparent 40%
          ),
          radial-gradient(
            ellipse at 80% 70%,
            rgba(0, 30, 60, 0.1) 0%,
            transparent 40%
          ),
          url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjA1Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDZMNiAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMwMDIxMzciIHN0cm9rZS13aWR0aD0iMC4yNSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')
        `,
        backgroundBlendMode: "overlay",
        boxShadow: "inset 0 0 60px rgba(0, 15, 30, 0.6)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex flex-row space-x-2 items-center">
          <img src={logo} alt="CodeArena" className="h-9 w-9" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
            CodeArena
          </h1>
        </div>

        {/* Icons on the right */}
        <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-light-primary dark:text-dark-primary hover:scale-110 transition-colors relative"
          >
            <User className="w-6 h-6" />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute bg-dark-secondary right-0 top-full mt-2 w-48  rounded-md shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-200 w-full text-left transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
