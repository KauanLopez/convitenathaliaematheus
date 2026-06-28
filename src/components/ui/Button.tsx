import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm tracking-[0.15em] uppercase font-body transition-colors duration-300";
    
    const variants = {
      primary: "bg-bg-dark text-text-light hover:bg-text-main",
      outline: "border border-text-main text-text-main hover:bg-bg-secondary",
      ghost: "text-text-main hover:opacity-hover"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
