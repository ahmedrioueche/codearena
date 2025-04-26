import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../../../../api/auth";
import toast from "react-hot-toast";

interface OtpProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

const Otp = ({ email, onBack, onSuccess }: OtpProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    setIsSubmitting(true);
    try {
      await verifyOtp(email, fullOtp);
      onSuccess();
    } catch (e) {
      console.log("OTP verification failed", e);
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      // Allow only digits and limit to 1 character
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to the next input field
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleResend = async () => {
    try {
      return await sendOtp(email);
    } catch (e) {
      console.log("OTP resend failed", e);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1026] via-[#1B2349] to-[#0B1026] overflow-hidden p-6">
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

      {/* OTP Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg md:px-6">
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
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

          {/* OTP Form */}
          <form
            className="flex flex-col items-center space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4 text-center">
              <p className="flex flex-col text-white text-center mb-4">
                <span>Please enter the code sent to </span>
                <span>{email}</span>
              </p>
              <div className="flex justify-center gap-3 max-w-lg">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    className="w-9 h-9 md:w-10 md:h-10 text-center bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full max-w-xs py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                "Verify OTP"
              )}{" "}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <button
              onClick={onBack}
              className="text-blue-300 hover:text-blue-400 transition-colors"
            >
              Go Back
            </button>
            <span className="mx-3 text-white/30">•</span>
            <button
              onClick={handleResend}
              className="text-blue-300 hover:text-blue-400 transition-colors"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
