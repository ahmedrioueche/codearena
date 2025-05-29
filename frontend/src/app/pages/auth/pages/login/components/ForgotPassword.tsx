import { useState } from "react";
import toast from "react-hot-toast";
import { resetPassword, sendOtp } from "../../../../../../api/auth";
import Otp from "../../../components/Otp";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import InputField from "../../../../../../components/ui/InputField";
import { APP_DATA } from "../../../../../../constants/data";

type ForgotPasswordView = "email" | "otp" | "reset";

const ForgotPassword = ({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const [currentView, setCurrentView] = useState<ForgotPasswordView>("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendOtp(email);
      setCurrentView("otp");
    } catch (error) {
      console.log("error", error);
      const axiosError = error as AxiosError;
      if (axiosError.status === 404) {
        toast.error("Email not registered.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, newPassword);
      onSuccess();
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "email":
        return (
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl  max-w-md p-8 sm:p-12">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 font-dancing">
                  {APP_DATA.name}
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="text-blue-300 font-stix text-lg mt-4">
                {APP_DATA.desc}
              </p>
            </div>
            <div className="text-center mb-8">
              <p className="text-white font-medium font-stix text-lg mt-4">
                We'll send a verification code to:
              </p>
              <p className="text-blue-300  font-medium mt-2">{email}</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={handleSubmitEmail}
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" />
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>
            </div>
            <div className="mt-8 text-center text-sm">
              <button
                onClick={onBack}
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        );
      case "otp":
        return (
          <Otp
            email={email}
            onSuccess={() => setCurrentView("reset")}
            onBack={() => setCurrentView("email")}
          />
        );

      case "reset":
        return (
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl  max-w-md p-8 sm:p-12">
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
            <div className="text-center mb-8">
              <p className="text-white font-medium font-stix text-base mt-4">
                Create a new password for your account
              </p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <InputField
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <InputField
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                error={
                  newPassword !== confirmPassword && confirmPassword !== ""
                    ? "Passwords don't match"
                    : ""
                }
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <button
                onClick={() => setCurrentView("email")}
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                Back to Email
              </button>
            </div>
          </div>
        );
    }
  };

  return <>{renderView()}</>;
};

export default ForgotPassword;
