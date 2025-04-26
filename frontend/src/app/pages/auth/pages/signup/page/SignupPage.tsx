import { useState } from "react";
import Signup from "../components/Signup";
import EmailVerification from "../components/EmailVerification";
import UserDetails from "../components/UserDetails";
import { UserCreate } from "../../../../../../types/user";
import { APP_PAGES } from "../../../../../../constants/navigation";
import toast from "react-hot-toast";
import { asteroids, stars } from "../../../../../../constants/general";
type View = "signup" | "emailVerification" | "userDetails";

const SignupPage = () => {
  const [currentView, setCurrentView] = useState<View>("signup");
  const [user, setUser] = useState<UserCreate>();

  const handleNavigation = (view: View, data?: UserCreate) => {
    if (data) setUser(data);
    setCurrentView(view);
  };

  const handleSuccess = () => {
    toast.success("Signup successful! Welcome to CodeArena!");
    location.href = APP_PAGES.home.route;
  };

  const renderView = () => {
    switch (currentView) {
      case "signup":
        return (
          <Signup
            onSuccess={(data) => handleNavigation("emailVerification", data)}
          />
        );
      case "emailVerification":
        return (
          <EmailVerification
            email={user?.email || ""}
            onSuccess={() => handleNavigation("userDetails")}
          />
        );
      case "userDetails":
        return <UserDetails onSuccess={handleSuccess} />;
      default:
        return <Signup onSuccess={(data) => setUser(data)} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1026] via-[#1B2349] to-[#0B1026] overflow-hidden p-4">
      {/* Static Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        />
      ))}

      {/* Static Asteroids */}
      {asteroids.map((asteroid) => (
        <div
          key={asteroid.id}
          className="absolute bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg opacity-30"
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            top: asteroid.top,
            left: asteroid.left,
            transform: `rotate(${asteroid.rotation}deg)`,
          }}
        />
      ))}

      {/* Signup Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-2">
        {renderView()}
      </div>
    </div>
  );
};

export default SignupPage;
