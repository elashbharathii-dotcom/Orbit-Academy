import React from 'react';
import { LIVERY_OPTIONS, MATERIAL_STUDIO_FINISHES, generateRandomShipName } from '../buildData';
import { LiveryOption, MaterialFinish } from '../types';
import {
  Dice5,
  Camera,
  Layers,
  Box,
} from 'lucide-react';

interface CustomizationPanelProps {
  vehicleName: string;
  onVehicleNameChange: (name: string) => void;
  selectedLivery: LiveryOption;
  onSelectLivery: (livery: LiveryOption) => void;
  selectedMaterial: MaterialFinish;
  onSelectMaterial: (mat: MaterialFinish) => void;
  explodedFactor: number;
  onExplodedFactorChange: (factor: number) => void;
  isWireframe: boolean;
  onToggleWireframe: () => void;
  cameraPreset: 'iso' | 'side' | 'top' | 'engine';
  onSelectCameraPreset: (preset: 'iso' | 'side' | 'top' | 'engine') => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  vehicleName,
  onVehicleNameChange,
  selectedLivery,
  onSelectLivery,
  selectedMaterial,
  onSelectMaterial,
  explodedFactor,
  onExplodedFactorChange,
  isWireframe,
  onToggleWireframe,
  cameraPreset,
  onSelectCameraPreset,
}) => {
  const handleRandomizeName = () => {
    onVehicleNameChange(generateRandomShipName());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Spacecraft Designation & Name */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Spacecraft Designation
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => onVehicleNameChange(e.target.value)}
            data-testid="vehicle-name-input"
            className="flex-1 rounded-xl border border-white/10 bg-[#070C1B]/90 px-3 py-1.5 font-sans text-xs sm:text-sm font-bold text-white focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
          <button
            type="button"
            onClick={handleRandomizeName}
            title="Generate Random NASA/Sci-Fi Ship Name"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#38BDF8] transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <Dice5 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Aerospace Livery Colors */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Aerospace Livery Scheme
          </span>
          <span className="font-sans text-[11px] text-[#38BDF8] font-semibold">
            {selectedLivery.name}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {LIVERY_OPTIONS.map((liv) => {
            const isSelected = selectedLivery.id === liv.id;
            return (
              <button
                key={liv.id}
                type="button"
                onClick={() => onSelectLivery(liv)}
                title={`${liv.name}: ${liv.description}`}
                className={`group relative flex h-9 rounded-xl border p-1 transition-all flex-col items-center justify-center ${
                  isSelected
                    ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ backgroundColor: liv.primaryColor }}
              >
                {/* Accent Pip */}
                <span
                  className="h-2 w-2 rounded-full border border-black/40 shadow-sm"
                  style={{ backgroundColor: liv.accentColor }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Structural Material Finish */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Hull Material Finish
        </span>

        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(MATERIAL_STUDIO_FINISHES) as MaterialFinish[]).map((matKey) => {
            const mat = MATERIAL_STUDIO_FINISHES[matKey];
            const isSelected = selectedMaterial === matKey;

            return (
              <button
                key={matKey}
                type="button"
                onClick={() => onSelectMaterial(matKey)}
                className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                    : 'border-white/10 bg-[#070C1B]/80 hover:border-white/20 hover:bg-[#0B1226]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-bold text-white">
                    {mat.name}
                  </span>
                  <span
                    className={`font-mono text-[8.5px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#030611]'
                        : 'bg-white/5 text-[#94A3B8]'
                    }`}
                  >
                    {mat.badge}
                  </span>
                </div>
                <p className="font-sans text-[10px] text-[#94A3B8] leading-tight line-clamp-2">
                  {mat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 3D Viewport Controls & Exploded Assembly */}
      <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
        {/* Exploded View Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-[#38BDF8] font-bold">
              <Layers className="h-3 w-3" />
              <span>Exploded Assembly:</span>
            </span>
            <span className="text-white font-bold">{Math.round(explodedFactor * 100)}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(explodedFactor * 100)}
            onChange={(e) => onExplodedFactorChange(parseFloat(e.target.value) / 100)}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#0B1226] accent-[#38BDF8]"
          />
        </div>

        {/* Wireframe CAD Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Box className="h-3 w-3 text-[#38BDF8]" />
            <span>Wireframe CAD Mode</span>
          </span>

          <button
            type="button"
            onClick={onToggleWireframe}
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
              isWireframe
                ? 'border border-[#38BDF8] bg-[#38BDF8] text-[#030611] shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'border border-white/10 bg-white/5 text-[#94A3B8] hover:text-white'
            }`}
          >
            {isWireframe ? 'WIREFRAME ON' : 'SOLID SHADED'}
          </button>
        </div>

        {/* Camera Perspective Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Camera className="h-3 w-3 text-[#A78BFA]" />
            <span>Camera Angle Presets</span>
          </span>

          <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
            {[
              { id: 'iso', label: 'Isometric' },
              { id: 'side', label: 'Side Profile' },
              { id: 'top', label: 'Top Down' },
              { id: 'engine', label: 'Engine Bay' },
            ].map((cam) => {
              const isSelected = cameraPreset === cam.id;
              return (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() =>
                    onSelectCameraPreset(cam.id as 'iso' | 'side' | 'top' | 'engine')
                  }
                  className={`py-1 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'border-[#A78BFA] bg-[#A78BFA]/20 text-[#A78BFA] font-bold shadow-[0_0_8px_rgba(167,139,250,0.2)]'
                      : 'border-white/5 bg-[#0B1226]/80 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {cam.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
