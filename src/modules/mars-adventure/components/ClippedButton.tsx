import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ClippedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'brand' | 'outline';
};

const variantClasses = {
  brand: 'bg-[#EE3F2C] text-white hover:bg-[#d63525]',
  outline: 'border border-white/35 bg-white/5 text-white hover:bg-white/10',
};

export const ClippedButton: React.FC<ClippedButtonProps> = ({
  children,
  className = '',
  variant = 'brand',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`clip-corner inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold tracking-wide transition ${variantClasses[variant]} ${className}`}
      data-editable
      {...props}
    >
      {children}
    </button>
  );
};

export default ClippedButton;
