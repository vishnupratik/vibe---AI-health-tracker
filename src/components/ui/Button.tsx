import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children?: ReactNode;
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-gradient-to-r from-sand-500 to-earth-200 text-earth-900 shadow-md hover:shadow-lg': variant === 'primary',
          'bg-nature-800 text-white hover:bg-nature-700': variant === 'secondary',
          'border-2 border-nature-200 text-nature-800 hover:bg-nature-50': variant === 'outline',
          'hover:bg-nature-100 text-nature-800': variant === 'ghost',
        },
        className
      )}
      {...props}
    />
  );
}
