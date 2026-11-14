import React from 'react';

export interface SpaceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable aerospace tactile button with micro-glow feedback
 */
export const SpaceButton: React.FC<SpaceButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-[#F59E0B] text-[#030611] font-bold hover:bg-[#FBBF24] shadow-[0_0_20px_-3px_rgba(245,158,11,0.4)] border border-[#FCD34D]/50',
    secondary:
      'bg-[#121C38]/80 text-[#F8FAFC] border border-white/10 hover:border-[#38BDF8]/50 hover:bg-[#1A284E] hover:text-[#38BDF8] shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
    ghost:
      'bg-transparent text-[#94A3B8] border border-transparent hover:bg-white/5 hover:text-[#F8FAFC]',
    danger:
      'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/25',
  }[variant];

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-mono',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2 rounded-xl font-medium',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 rounded-xl font-semibold',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`group inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      )}
    </button>
  );
};

