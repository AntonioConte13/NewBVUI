
import React from 'react';

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const TacticalButton: React.FC<TacticalButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "relative font-extrabold uppercase tracking-wider transition-all duration-100 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:border-b-4 disabled:active:translate-y-0";
  
  const variants = {
    primary: "bg-duo-green border-duo-greenDark text-white hover:bg-red-500",
    secondary: "bg-duo-gray-100 border-duo-gray-200 text-white hover:bg-duo-gray-200 hover:border-duo-gray-300 border-2 border-b-4",
    ghost: "bg-transparent border-transparent text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-gray-500 border-0",
    danger: "bg-duo-red border-duo-redDark text-white hover:bg-red-500",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};
