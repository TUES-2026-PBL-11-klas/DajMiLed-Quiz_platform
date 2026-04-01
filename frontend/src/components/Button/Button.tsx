"use client";

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, children, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:shadow-[0_8px_32px_rgba(137,79,56,0.25)] px-6 py-3",
      secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 px-6 py-3",
      tertiary: "bg-transparent text-tertiary border border-outline-variant/20 hover:bg-tertiary/5 px-6 py-3"
    };

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClasses[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
