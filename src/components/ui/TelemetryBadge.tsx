import React from 'react';

export interface TelemetryBadgeProps {
  label: string;
  value?: string | number;
  tone?: 'cyan' | 'amber' | 'violet' | 'emerald' | 'muted';
  icon?: React.ComponentType<{ className?: string }>;
  pulsing?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Reusable aerospace status and telemetry indicator badge
 */
export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({
  label,
  value,
  tone = 'cyan',
  icon: Icon,
  pulsing = false,
  size = 'md',
  className = '',
}) => {
  const toneStyles = {
    cyan: {
      badge: 'border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#38BDF8]',
      pip: 'bg-[#38BDF8]',
      ping: 'bg-[#38BDF8]',
    },
    amber: {
      badge: 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]',
      pip: 'bg-[#F59E0B]',
      ping: 'bg-[#F59E0B]',
    },
    violet: {
      badge: 'border-[#A78BFA]/25 bg-[#A78BFA]/10 text-[#A78BFA]',
      pip: 'bg-[#A78BFA]',
      ping: 'bg-[#A78BFA]',
    },
    emerald: {
      badge: 'border-[#34D399]/25 bg-[#34D399]/10 text-[#34D399]',
      pip: 'bg-[#34D399]',
      ping: 'bg-[#34D399]',
    },
    muted: {
      badge: 'border-white/10 bg-white/5 text-[#94A3B8]',
      pip: 'bg-[#94A3B8]',
      ping: 'bg-[#94A3B8]',
    },
  }[tone];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[9.5px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium tracking-wider uppercase transition-colors ${toneStyles.badge} ${sizeStyles} ${className}`}
    >
      {/* Optional Pulsing Indicator Pip */}
      {pulsing ? (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${toneStyles.ping}`}
          />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${toneStyles.pip}`} />
        </span>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
      ) : null}

      <span>{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-40">•</span>
          <span className="font-bold text-[#F8FAFC]">{value}</span>
        </>
      )}
    </span>
  );
};

