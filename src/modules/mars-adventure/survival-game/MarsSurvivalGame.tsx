import React, { useEffect, useRef } from 'react';
import { MarsSurvivalCanvas } from './components/canvas/MarsSurvivalCanvas';
import { HelmetVisorHUD } from './components/hud/HelmetVisorHUD';
import { audioSystem } from './systems/audioSynthesizer';
import { inputManager } from './systems/inputManager';
import { useMarsGameStore } from './store/useMarsGameStore';

interface MarsSurvivalGameProps {
  onReturnToBriefing?: () => void;
}

export const MarsSurvivalGame: React.FC<MarsSurvivalGameProps> = ({ onReturnToBriefing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);
  const isSubstanceModalOpen = useMarsGameStore((state) => state.isSubstanceModalOpen);

  // Initialize input manager & audio system
  useEffect(() => {
    inputManager.init();

    const handleFirstGesture = () => {
      audioSystem.init();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      inputManager.destroy();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking a button, link or modal, do not request pointer lock
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      isPauseModalOpen ||
      isSubstanceModalOpen
    ) {
      return;
    }

    if (containerRef.current) {
      inputManager.requestPointerLock(containerRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative h-[82vh] min-h-[580px] w-full overflow-hidden rounded-3xl border border-red-500/30 bg-[#05070D] shadow-2xl cursor-crosshair"
    >
      {/* 3D WebGL Canvas Layer */}
      <MarsSurvivalCanvas />

      {/* Futuristic Helmet Visor UI & Telemetry Overlay */}
      <HelmetVisorHUD
        onReturnToBriefing={onReturnToBriefing}
        canvasContainerRef={containerRef}
      />
    </div>
  );
};
