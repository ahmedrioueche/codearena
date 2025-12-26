import { LogOut, Menu } from "lucide-react"; // Added Menu icon
import toast from "react-hot-toast";
import { logout } from "../api/auth";
import { APP_PAGES } from "../constants/navigation";
import { settingsActions } from "../store";
import logo from "/images/logo.svg";

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
    <nav className="fixed px-4 top-0 left-0 w-full border-b border-light-border/10 dark:border-white/5 shadow-2xl shadow-violet-500/5 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0f172a]/70 supports-[backdrop-filter]:bg-white/10 supports-[backdrop-filter]:dark:bg-[#0f172a]/50">
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
