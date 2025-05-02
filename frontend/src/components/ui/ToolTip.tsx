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
  return (
    <div className="w-full" {...props}>
      {children}
    </div>
  );
};

export const TooltipContent: React.FC<TooltipContentProps> = ({ children }) => {
  return (
    <div
      className="invisible group-hover:visible absolute z-50 px-4 py-2 
                 text-sm text-white bg-slate-900 rounded-md shadow-lg 
                 transform -translate-x-1/2 -translate-y-full 
                 whitespace-normal break-words text-center
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{
        left: "50%",
        marginTop: "-2rem",
      }}
    >
      {children}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 
                   border-4 border-transparent border-t-slate-900"
        style={{
          bottom: "-0.5rem",
        }}
      />
    </div>
  );
};

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <div className="relative w-full group">{children}</div>;
};

export default Tooltip;
