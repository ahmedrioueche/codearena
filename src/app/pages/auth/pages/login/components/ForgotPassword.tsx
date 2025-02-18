import React, { useState } from "react";

const ForgotPassword = ({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reduced number of static stars
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }));

  // Reduced number of static asteroids
  const asteroids = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    rotation: Math.random() * 360,
  }));

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmit(email); // Pass the email to the onSubmit function
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

      {/* Forgot Password Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6">
        <div className="bg-black/40 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 font-dancing">
                CodeArena
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
            <p className="text-blue-300 font-stix text-lg mt-4">
              Recover Your Access to the Cosmos
            </p>
          </div>

          {!isSubmitted ? (
            <>
              {/* Description */}
              <p className="text-white/70 text-center mb-6">
                Enter your email address and we'll send you instructions to
                reset your password.
              </p>

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="email"
                    className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Reset Instructions
                </button>
              </form>
            </>
          ) : (
            // Success Message
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl text-white font-medium mb-2">
                  Check Your Email
                </h2>
                <p className="text-white/70">
                  We've sent password reset instructions to:
                </p>
                <p className="text-blue-400 font-medium mt-1">{email}</p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="mt-8 text-center text-sm">
            <a
              href="#"
              className="text-blue-300 hover:text-blue-400 transition-colors"
              onClick={onBack}
            >
              Return to Login
            </a>
            <span className="mx-3 text-white/30">•</span>
            <a
              href="#"
              className="text-blue-300 hover:text-blue-400 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
