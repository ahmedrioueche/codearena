import React, { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
};

type TooltipTriggerProps = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type TooltipContentProps = {
  children: ReactNode;
};

export const TooltipProvider: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>;
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({ children }) => {
  return (
    <div
      className="absolute z-50 w-56 px-4 py-2 text-sm text-white bg-slate-900 rounded-md shadow-lg 
      -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
      whitespace-normal break-words text-center"
      style={{ top: "-100%", left: "50%" }}
    >
      {children}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  );
};

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return (
    <div className="relative inline-block group overflow-visible">
      {children}
    </div>
  );
};

export default Tooltip;
