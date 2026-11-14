import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive';
  glowingBorder?: 'none' | 'cyan' | 'amber' | 'violet';
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable aerospace-grade glass card container
 * Implements Phase 8 design system tokens:
 * - Midnight-navy frosted glass surface
 * - Hairline top specular lighting
 * - Configurable accent glow borders
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  glowingBorder = 'none',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel',
    elevated: 'glass-panel-elevated',
    subtle: 'glass-pill',
    interactive:
      'glass-panel hover:border-white/20 hover:bg-[#121C38]/90 transition-all duration-200 cursor-pointer',
  }[variant];

  const glowStyles = {
    none: '',
    cyan: 'border-glow-cyan',
    amber: 'border-glow-amber',
    violet: 'border-[rgba(167,139,250,0.45)] shadow-[0_0_14px_rgba(167,139,250,0.25)]',
  }[glowingBorder];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${variantStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {/* Specular Top Hairline Highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

