import React, { useState } from "react";

interface SignupProps {
  onSubmit: (email: string) => void; // Prop to handle form submission
}

const Signup = ({ onSubmit }: SignupProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data (e.g., password match)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Call the onSubmit prop with the email
    onSubmit(formData.email);
  };

  return (
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
          Join the Cosmic Code Community
        </p>
      </div>

      {/* Signup Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <input
            type="email"
            className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <input
            type="password"
            className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Create your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <input
            type="password"
            className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Begin Your Journey
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 text-center text-sm">
        <span className="text-white/30">Already have an account?</span>
        <a
          href="/auth/login"
          className="ml-2 text-blue-300 hover:text-blue-400 transition-colors"
        >
          Log In
        </a>
      </div>
    </div>
  );
};

export default Signup;
