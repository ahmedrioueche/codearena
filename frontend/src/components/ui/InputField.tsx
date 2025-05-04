import React, { forwardRef, useState } from "react";
import { cva } from "class-variance-authority";
import { ReactNode } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  rightIcon?: ReactNode;
  width?: string;
}

const inputStyles = cva(
  "w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition-all",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
      error: {
        true: "border-red-400",
      },
    },
  }
);

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      className,
      error,
      disabled = false,
      width,
      rightIcon,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Handle password type toggle
    const isPassword = type === "password";
    const computedType = isPassword && showPassword ? "text" : type;

    // Default right icon for password fields
    const defaultRightIcon = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-white/50 hover:text-white transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    ) : null;

    const finalRightIcon = rightIcon || defaultRightIcon;

    return (
      <div className="space-y-1" style={{ width }}>
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            type={computedType}
            className={inputStyles({
              disabled,
              error: Boolean(error),
              className,
            })}
            {...props}
          />
          {finalRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {finalRightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
