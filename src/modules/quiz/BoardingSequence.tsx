import React, { useEffect, useState } from 'react';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { ShieldCheck, Cpu, Radio, Sparkles, FastForward } from 'lucide-react';

interface BoardingSequenceProps {
  pilotName: string;
  onComplete: () => void;
}

export const BoardingSequence: React.FC<BoardingSequenceProps> = ({
  pilotName,
  onComplete,
}) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [doorsClosed, setDoorsClosed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Close blast doors at 200ms
    const t1 = setTimeout(() => setDoorsClosed(true), 200);

    // 2. Boot sequence stages
    const t2 = setTimeout(() => setBootStep(1), 700);
    const t3 = setTimeout(() => setBootStep(2), 1300);
    const t4 = setTimeout(() => setBootStep(3), 1900);
    const t5 = setTimeout(() => setBootStep(4), 2500);

    // 3. Complete transition at 3200ms
    const t6 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030611] font-sans">
      {/* Left Blast Door */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#070C1B] via-[#0B1226] to-[#0F172A] border-r-2 border-[#38BDF8]/40 shadow-[10px_0_30px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-in-out z-20 flex flex-col justify-between p-6 ${
          doorsClosed ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F59E0B] animate-ping" />
          <span className="font-mono text-xs text-[#F59E0B] font-bold uppercase tracking-widest">
            AIRLOCK SEALING // PORT
          </span>
        </div>

        {/* Hazard mechanical stripes */}
        <div className="space-y-2 opacity-30">
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
          <div className="h-2 w-3/4 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
        </div>

        <span className="font-mono text-[10px] text-[#64748B]">
          ORBIT-X HEAVY CANOPY HYDRAULICS: ENGAGED
        </span>
      </div>

      {/* Right Blast Door */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#070C1B] via-[#0B1226] to-[#0F172A] border-l-2 border-[#38BDF8]/40 shadow-[-10px_0_30px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-in-out z-20 flex flex-col justify-between items-end p-6 ${
          doorsClosed ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#F59E0B] font-bold uppercase tracking-widest">
            AIRLOCK SEALING // STARBOARD
          </span>
          <div className="h-3 w-3 rounded-full bg-[#F59E0B] animate-ping" />
        </div>

        {/* Hazard mechanical stripes */}
        <div className="space-y-2 opacity-30 flex flex-col items-end">
          <div className="h-2 w-full bg-gradient-to-l from-transparent via-[#F59E0B] to-transparent" />
          <div className="h-2 w-3/4 bg-gradient-to-l from-transparent via-[#F59E0B] to-transparent" />
        </div>

        <span className="font-mono text-[10px] text-[#64748B]">
          HERMETIC OXYGEN ENVELOPE: 100% PRESSURE
        </span>
      </div>

      {/* Center Digital Cockpit Initialization HUD */}
      <div className="relative z-30 flex flex-col items-center gap-6 p-8 max-w-lg w-full text-center">
        {/* Pulsing Core Reactor Logo */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] p-0.5 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#030611]">
            <Cpu className="h-12 w-12 text-[#38BDF8] animate-pulse" />
          </div>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold">
            SPACECRAFT BOARDING IN PROGRESS
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            Welcome Aboard, Pilot {pilotName}
          </h2>
        </div>

        {/* Boot sequence telemetry ticks */}
        <div className="w-full bg-[#0B1226]/90 border border-white/10 rounded-xl p-4 font-mono text-xs text-left space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <ShieldCheck className={`h-4 w-4 ${bootStep >= 1 ? 'text-[#34D399]' : 'text-slate-600'}`} />
              Canopy Hermetic Integrity
            </span>
            <span className={bootStep >= 1 ? 'text-[#34D399] font-bold' : 'text-slate-600'}>
              {bootStep >= 1 ? '[SECURED]' : 'SEALING...'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <Cpu className={`h-4 w-4 ${bootStep >= 2 ? 'text-[#38BDF8]' : 'text-slate-600'}`} />
              Astrophysics Flight Computer
            </span>
            <span className={bootStep >= 2 ? 'text-[#38BDF8] font-bold' : 'text-slate-600'}>
              {bootStep >= 2 ? '[ONLINE]' : 'BOOTING...'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <Radio className={`h-4 w-4 ${bootStep >= 3 ? 'text-[#F59E0B]' : 'text-slate-600'}`} />
              NASA Deep Space Network Link
            </span>
            <span className={bootStep >= 3 ? 'text-[#F59E0B] font-bold' : 'text-slate-600'}>
              {bootStep >= 3 ? '[LINKED]' : 'SYNCHRONIZING...'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${bootStep >= 4 ? 'text-[#A78BFA]' : 'text-slate-600'}`} />
              Cockpit HUD Avionics
            </span>
            <span className={bootStep >= 4 ? 'text-[#A78BFA] font-bold' : 'text-slate-600'}>
              {bootStep >= 4 ? '[CALIBRATED]' : 'INITIALIZING...'}
            </span>
          </div>
        </div>

        {/* Skip transition action */}
        <SpaceButton
          variant="ghost"
          size="sm"
          onClick={onComplete}
          icon={FastForward}
          className="text-xs text-[#94A3B8] hover:text-white"
        >
          Skip to Cockpit
        </SpaceButton>
      </div>
    </div>
  );
};

