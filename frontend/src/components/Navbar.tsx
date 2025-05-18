import { LogOut, Menu } from "lucide-react"; // Added Menu icon
import logo from "/images/logo.svg";
import { settingsActions } from "../store";
import { logout } from "../api/auth";
import toast from "react-hot-toast";
import { APP_PAGES } from "../constants/navigation";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
      className="fixed px-4 top-0 left-0 w-full border-b border-light-border/20 dark:border-dark-border/20 shadow-lg z-50"
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
      <div className="w-full px-2 py-4 flex items-center justify-between">
        {/* Left side with mobile menu button and logo */}
        <div className="flex flex-row space-x-2 items-center">
          {/* Mobile menu button - hidden on desktop */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-light-primary dark:text-dark-primary mr-2 hover:scale-110 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a href="/" className="flex flex-row space-x-2 cursor-pointer">
            <img src={logo} alt="CodeArena" className="h-9 w-9" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
              CodeArena
            </h1>
          </a>
        </div>

        {/* Logout button on the right */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
