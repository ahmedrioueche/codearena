import { User, Cog, Bell, Menu } from "lucide-react";
import logo from "/images/logo.svg";
import { settingsActions } from "../store";
import { logout } from "../api/auth";
import toast from "react-hot-toast";
import { APP_PAGES } from "../constants/navigation";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  settingsActions.setTheme("dark");
  const handleLogout = async () => {
    try {
      await logout();
      location.href = APP_PAGES.login.route;
    } catch (e) {
      console.log(e);
      toast.error(`Logout failed, please try again`);
    }
  };

  return (
    <nav
      className="fixed p-0 top-0 left-0 w-full  border-b border-white/10 shadow-lg z-50"
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
          {/*   <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md transition duration-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Menu
              size={26}
              className="text-light-primary dark:text-dark-primary"
            />
          </button> */}

          <img src={logo} alt="CodeArena" className="h-9 w-9" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
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
          <button
            onClick={handleLogout}
            className="text-light-primary dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
