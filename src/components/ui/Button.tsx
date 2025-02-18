// Button.tsx
import React from "react";

type ButtonProps = {
  className?: string;
  variant?: "default" | "ghost" | "primary";
  size?: "default" | "sm";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
      ghost:
        "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
      primary:
        "bg-light-primary dark:bg-dark-primary hover:bg-light-primary/90 dark:hover:bg-dark-primary/90",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
