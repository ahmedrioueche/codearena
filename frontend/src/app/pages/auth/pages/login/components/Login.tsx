import { useLocation } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { login } from "../../../../../../api/auth";
import { AxiosError } from "axios";
import InputField from "../../../../../../components/ui/InputField";

interface LoginProps {
  onForgotPassword: (email: string) => void;
  onSuccess: () => void;
}

const Login = ({ onForgotPassword, onSuccess }: LoginProps) => {
  const { search } = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      onSuccess();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      const responseMessage = axiosError.response?.data?.message;

      let errorMessage = "Login failed. Please try again.";

      if (status === 401) {
        errorMessage = "Invalid email or password";
      } else if (status === 400) {
        errorMessage = "Bad request. Please check your input.";
      } else if (responseMessage) {
        errorMessage = responseMessage;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setError("Please provide your account's email");
      return;
    }
    onForgotPassword(formData.email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  // Get signup URL with preserved query parameters
  const getSignupUrl = () => {
    return `/auth/signup${search}`;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <InputField
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            "Launch Into CodeArena"
          )}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 text-center text-sm">
        <button
          onClick={handleForgotPassword}
          className="text-blue-300 hover:text-blue-400 transition-colors"
        >
          Forgot Password?
        </button>
        <span className="mx-3 text-white/30">•</span>
        <a
          href={getSignupUrl()}
          className="text-blue-300 hover:text-blue-400 transition-colors"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
