import React, { useState, useEffect } from 'react';
import { VitalGauges } from './VitalGauges';
import { CompassRadar } from './CompassRadar';
import { InventoryDrawer } from './InventoryDrawer';
import { MissionLogModal } from './MissionLogModal';
import { GameOverModal } from './GameOverModal';
import { SubstanceInfoModal } from './SubstanceInfoModal';
import { PauseModal } from './PauseModal';
import { StorageModal } from './StorageModal';
import { RenovationModal } from './RenovationModal';
import { InteractionPrompt } from './InteractionPrompt';
import { ScannerOverlay } from './ScannerOverlay';
import { RoverHUD } from './RoverHUD';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Volume2,
  VolumeX,
  Scan,
  Backpack,
  ClipboardList,
  SlidersHorizontal,
} from 'lucide-react';

interface HelmetVisorHUDProps {
  onReturnToBriefing?: () => void;
  canvasContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const HelmetVisorHUD: React.FC<HelmetVisorHUDProps> = ({
  onReturnToBriefing,
  canvasContainerRef,
}) => {
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showMissionLog, setShowMissionLog] = useState<boolean>(false);

  const solCycle = useMarsGameStore((state) => state.solCycle);
  const settings = useMarsGameStore((state) => state.settings);
  const toggleSound = useMarsGameStore((state) => state.toggleSound);
  const toggleVisorScan = useMarsGameStore((state) => state.toggleVisorScan);
  const togglePauseModal = useMarsGameStore((state) => state.togglePauseModal);
  const notification = useMarsGameStore((state) => state.notification);
  const clearNotification = useMarsGameStore((state) => state.clearNotification);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);

  // Keyboard shortcut for Cargo ([C]) and Sol Log ([M])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyC') {
        setShowInventory((prev) => !prev);
      }
      if (e.code === 'KeyM') {
        setShowMissionLog((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* 1. Curved Helmet Visor Border & Vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] border-[8px] border-black/30 rounded-3xl" />

      {/* 2. Top Visor Telemetry Bar */}
      <div className="pointer-events-auto flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0F1D]/80 px-4 py-2.5 backdrop-blur-md shadow-xl text-xs font-mono">
        {/* Left: Mission Brand & Destination */}
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-red-400">
              MARS: THE LAST FRONTIER
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400">
              JEZERO CRATER OUTPOST ALPHA
            </span>
          </div>
        </div>

        {/* Center: Sol & Atmospheric Telemetry */}
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">SOL {solCycle.solNumber}</span>
            <span className="text-slate-500">•</span>
            <span>
              {Math.floor(solCycle.timeOfDay).toString().padStart(2, '0')}:
              {Math.floor((solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')} LMST
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-sky-400">
            <span>PRESS: 6.1 mbar</span>
            <span className="text-slate-500">•</span>
            <span>CO2: 95.3%</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Visor Scan Toggle */}
          <button
            onClick={toggleVisorScan}
            title="Toggle Spectral Visor Scan (V)"
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-colors ${
              settings.visorScanActive
                ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Scan className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[10px]">SCAN [V]</span>
          </button>

          {/* Pause / Controls Guide Button */}
          <button
            onClick={() => togglePauseModal(true)}
            title="Pause & Controls Guide (ESC)"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline text-[10px]">GUIDE [ESC]</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleSound}
            title="Toggle Sound Synthesizer"
            className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:text-white transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>

          {/* Return to NASA Briefing mode */}
          {onReturnToBriefing && (
            <button
              onClick={onReturnToBriefing}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300 hover:bg-red-500/20 transition-colors"
            >
              BRIEFING
            </button>
          )}
        </div>
      </div>

      {/* 3. Middle Dynamic Notification Pill */}
      <div className="pointer-events-none flex justify-center my-2">
        {notification && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-[#0A0F1D]/90 px-4 py-2 font-mono text-xs text-sky-200 shadow-xl backdrop-blur-md animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <span>{notification}</span>
            <button
              onClick={clearNotification}
              className="ml-2 text-[10px] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. Contextual Interaction Prompt [E] */}
      <InteractionPrompt />

      {/* 5. Rover Vehicle Telemetry HUD (when driving) */}
      <RoverHUD />

      {/* 6. Resource Vision Scanner Holographic AR Layer */}
      <ScannerOverlay />

      {/* 7. Bottom HUD Grid: Vitals on Left, Compass on Right, Controls in Center */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-none">
        {/* Left: Vitals Gauges */}
        <div className="pointer-events-auto w-full sm:w-64">
          <VitalGauges />
        </div>

        {/* Center: Field Action Buttons & Keybindings Guide */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {/* Quick Action Button Pills */}
          <div className="flex items-center gap-2">
            {/* Live Backpack Capacity Readout */}
            <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-[#0A0F1D]/85 px-3 py-1.5 font-mono text-xs shadow-xl backdrop-blur-md">
              <Backpack className="h-4 w-4 text-cyan-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 leading-none">BACKPACK</span>
                <span
                  className={`font-bold text-[11px] leading-tight ${
                    backpackWeight >= maxBackpackCapacity
                      ? 'text-red-400 animate-pulse'
                      : backpackWeight >= maxBackpackCapacity * 0.8
                      ? 'text-amber-400'
                      : 'text-cyan-300'
                  }`}
                >
                  {backpackWeight.toFixed(1)} / {maxBackpackCapacity.toFixed(1)} KG
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInventory(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/40 bg-[#0A0F1D]/85 px-4 py-2 font-mono text-xs font-bold text-cyan-300 shadow-xl backdrop-blur-md transition-all hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
            >
              <Backpack className="h-4 w-4" />
              <span>CARGO [C]</span>
            </button>

            <button
              onClick={() => setShowMissionLog(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-amber-500/40 bg-[#0A0F1D]/85 px-4 py-2 font-mono text-xs font-bold text-amber-300 shadow-xl backdrop-blur-md transition-all hover:bg-amber-500/20 hover:scale-105 active:scale-95"
            >
              <ClipboardList className="h-4 w-4" />
              <span>SOL LOG [M]</span>
            </button>
          </div>

          {/* Control Keys Guide */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/5 bg-[#0A0F1D]/75 px-3 py-1 font-mono text-[10px] text-slate-400 backdrop-blur-md">
            <span>[WASD] Move/Drive</span>
            <span>•</span>
            <span>[Mouse] Look</span>
            <span>•</span>
            <span>[Scroll] Zoom</span>
            <span>•</span>
            <span>[E] Interact</span>
            <span>•</span>
            <span>[V] Scanner</span>
            <span>•</span>
            <span>[I] Substance Info</span>
            <span>•</span>
            <span>[ESC] Pause</span>
          </div>
        </div>

        {/* Right: Compass Radar */}
        <div className="pointer-events-auto">
          <CompassRadar />
        </div>
      </div>

      {/* Modals & Menus */}
      {showInventory && <InventoryDrawer onClose={() => setShowInventory(false)} />}
      {showMissionLog && <MissionLogModal onClose={() => setShowMissionLog(false)} />}
      <StorageModal />
      <RenovationModal />
      <SubstanceInfoModal />
      <PauseModal canvasContainerRef={canvasContainerRef} />
      <GameOverModal />
    </div>
  );
};
