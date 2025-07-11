import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EquityButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const EquityButton: React.FC<EquityButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-100 border border-gray-200 hover:border-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:border-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default EquityButton; 