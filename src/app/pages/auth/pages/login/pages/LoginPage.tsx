import React, { useState } from "react";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";
import Otp from "../../../components/Otp";

const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login");
  const [email, setEmail] = useState("");

  // Handle navigation between components
  const handleNavigation = (
    view: React.SetStateAction<string>,
    userEmail = ""
  ) => {
    setCurrentView(view);
    if (userEmail) setEmail(userEmail);
  };

  const handleSuccess = () => {};

  const renderView = () => {
    switch (currentView) {
      case "login":
        return (
          <Login
            onForgotPassword={() => handleNavigation("forgotPassword")}
            onSubmit={(email) => handleNavigation("otp", email)}
          />
        );
      case "forgotPassword":
        return (
          <ForgotPassword
            onBack={() => handleNavigation("login")}
            onSubmit={(email) => handleNavigation("otp", email)}
          />
        );
      case "otp":
        return (
          <Otp
            email={email}
            onBack={() => handleNavigation("login")}
            onSuccess={() => handleSuccess()}
          />
        );
      default:
        return (
          <Login
            onForgotPassword={() => handleNavigation("forgotPassword")}
            onSubmit={(email) => handleNavigation("otp", email)}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1026] via-[#1B2349] to-[#0B1026] overflow-hidden p-4">
      {/* Static Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        />
      ))}

      {/* Static Asteroids */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg opacity-30"
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Login Form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6">
        {renderView()}
      </div>
    </div>
  );
};

export default LoginPage;
