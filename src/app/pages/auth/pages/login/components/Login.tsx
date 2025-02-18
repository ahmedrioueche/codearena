import React, { useState } from "react";

interface LoginProps {
  onForgotPassword: () => void;
  onSubmit: (email: string) => void;
}

const Login = ({ onForgotPassword, onSubmit }: LoginProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.email);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1026] via-[#1B2349] to-[#0B1026] overflow-hidden p-2">
      {/* Login Container */}
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
              Where Code Meets the Cosmos
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <input
                type="email"
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Launch Into CodeArena
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center text-sm">
            <button
              onClick={onForgotPassword}
              className="text-blue-300 hover:text-blue-400 transition-colors"
            >
              Forgot Password?
            </button>
            <span className="mx-3 text-white/30">•</span>
            <a
              href="/auth/signup"
              className="text-blue-300 hover:text-blue-400 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
