import React, { useState } from "react";
import Signup from "../components/Signup";
import EmailVerification from "../components/EmailVerification";
import UserDetails from "../components/UserDetails";

const SignupPage = () => {
  const [currentView, setCurrentView] = useState("signup");
  const [email, setEmail] = useState("");

  const handleNavigation = (view: string, email?: string) => {
    if (email) setEmail(email); // Save email for OTP verification
    setCurrentView(view);
  };

  const handleSubmit = () => {
    console.log("Signup process completed!");
    // Redirect or show success message
  };

  const renderView = () => {
    switch (currentView) {
      case "signup":
        return (
          <Signup
            onSubmit={(email) => handleNavigation("emailVerification", email)}
          />
        );
      case "emailVerification":
        return (
          <EmailVerification onSubmit={() => handleNavigation("userDetails")} />
        );
      case "userDetails":
        return <UserDetails onSubmit={handleSubmit} />;
      default:
        return (
          <Signup
            onSubmit={(email) => handleNavigation("emailVerification", email)}
          />
        );
    }
  };

  // Static stars and asteroids
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }));

  const asteroids = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    rotation: Math.random() * 360,
  }));

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6">
        {renderView()}
      </div>
    </div>
  );
};

export default SignupPage;
