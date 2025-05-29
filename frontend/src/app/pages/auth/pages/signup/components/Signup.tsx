import React, { useState } from "react";
import { UserCreate } from "../../../../../../types/user";
import { sendOtp, signup } from "../../../../../../api/auth";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import InputField from "../../../../../../components/ui/InputField";
import { useLocation } from "@tanstack/react-router";
import { APP_DATA } from "../../../../../../constants/data";

interface SignupProps {
  onSuccess: (data: UserCreate) => void;
}

const Signup = ({ onSuccess }: SignupProps) => {
  const { search } = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const data: UserCreate = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        await signup(data);
        await sendOtp(data.email);
        onSuccess(data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const responseMessage = axiosError.response?.data?.message;

        let errorMessage = "Error submitting form. Please try again.";

        if (status === 400) {
          if (responseMessage?.includes("Email already in use")) {
            errorMessage = "Email already in use.";
          } else if (
            responseMessage?.includes("E11000") ||
            responseMessage?.includes("duplicate key")
          ) {
            if (responseMessage.includes("username")) {
              errorMessage =
                "Username already in use. Please choose a different one.";
            } else if (responseMessage.includes("email")) {
              errorMessage = "Email already exists.";
            }
          } else {
            errorMessage = "Invalid request. Please check your input.";
          }
        } else if (status === 401) {
          errorMessage = "Unauthorized. Please check your credentials.";
        } else if (status === 403) {
          errorMessage =
            "Forbidden. You don't have permission for this action.";
        } else if (status === 404) {
          errorMessage = "Resource not found.";
        } else if (status === 409) {
          errorMessage = "Conflict. The resource already exists.";
        } else if (status === 429) {
          errorMessage = "Too many requests. Please try again later.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (responseMessage) {
          errorMessage = responseMessage;
        }

        setError(errorMessage);
      }
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) {
      setError("");
    }
  };

  const getLoginUrl = () => {
    const queryParams = new URLSearchParams(
      Object.entries(search).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return `/auth/login${queryParams ? `?${queryParams}` : ""}`;
  };

  return (
    <div
      style={{ zoom: "92%" }}
      className="bg-black/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 font-dancing">
            {APP_DATA.name}
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>
        <p className="text-blue-300 font-stix text-lg mt-4">{APP_DATA.desc}</p>
      </div>

      {/* Signup Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleInputChange}
        />

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
          placeholder="Create your password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <InputField
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:opacity-90 shadow-blue-500/20"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            "Begin Your Journey"
          )}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 text-center text-sm">
        <span className="text-white/60">Already have an account?</span>
        <a
          href={getLoginUrl()}
          className="ml-2 text-blue-300 hover:text-blue-400 transition-colors"
        >
          Log In
        </a>
      </div>
    </div>
  );
};

export default Signup;
