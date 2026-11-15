import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RotateCw,
  Box,
  Camera,
  Maximize2,
  Minimize2,
  Edit2,
  Check,
  ChevronDown,
  Rocket,
  Download,
  Sun,
  Moon,
  Ruler,
  Crosshair,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ShadingMode, CameraProjection, CameraViewAngle, LightingEnvironmentMode } from '../types';
import { workshopAudio } from '../audio/workshopAudio';

interface TopEditorToolbarProps {
  shipName: string;
  onShipNameChange: (newName: string) => void;
  isMissionReady: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  shadingMode: ShadingMode;
  onShadingModeChange: (mode: ShadingMode) => void;
  cameraProjection: CameraProjection;
  onCameraProjectionChange: (proj: CameraProjection) => void;
  cameraViewAngle?: CameraViewAngle;
  onCameraViewAngleChange?: (angle: CameraViewAngle) => void;
  lightingEnvironmentMode?: LightingEnvironmentMode;
  onLightingEnvironmentModeChange?: (mode: LightingEnvironmentMode) => void;
  showCenterOfMass?: boolean;
  onToggleCenterOfMass?: () => void;
  showCenterOfThrust?: boolean;
  onToggleCenterOfThrust?: () => void;
  showMeasurementCalipers?: boolean;
  onToggleMeasurementCalipers?: () => void;
  onTakeSnapshot: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onTestFlight?: () => void;
  onExportGLB?: () => void;
}

export const TopEditorToolbar: React.FC<TopEditorToolbarProps> = ({
  shipName,
  onShipNameChange,
  isMissionReady,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  shadingMode,
  onShadingModeChange,
  cameraProjection,
  onCameraProjectionChange,
  cameraViewAngle = 'free',
  onCameraViewAngleChange,
  lightingEnvironmentMode = 'cleanroom',
  onLightingEnvironmentModeChange,
  showCenterOfMass = false,
  onToggleCenterOfMass,
  showCenterOfThrust = false,
  onToggleCenterOfThrust,
  showMeasurementCalipers = false,
  onToggleMeasurementCalipers,
  onTakeSnapshot,
  isFullscreen,
  onToggleFullscreen,
  onTestFlight,
  onExportGLB,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(shipName);
  const [isShadingMenuOpen, setIsShadingMenuOpen] = useState<boolean>(false);
  const [isLightingMenuOpen, setIsLightingMenuOpen] = useState<boolean>(false);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onShipNameChange(tempName.trim());
      workshopAudio.playClick(1400);
    }
    setIsEditingName(false);
  };

  const cameraAngles: { id: CameraViewAngle; label: string }[] = [
    { id: 'isometric', label: 'ISO' },
    { id: 'front', label: 'FRT' },
    { id: 'top', label: 'TOP' },
    { id: 'side', label: 'SIDE' },
    { id: 'back', label: 'AFT' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl border border-white/10 bg-[#070C1B]/90 backdrop-blur-2xl shadow-2xl z-20">
      {/* 1. Spacecraft Registration & Name */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 group">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F27D26]/20 border border-[#F27D26]/40 text-[#F27D26] font-mono text-[10px] font-bold">
            OA
          </span>

          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="w-36 sm:w-52 rounded bg-[#030611] px-2 py-0.5 font-display text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="text-[#34D399] hover:text-white p-0.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setTempName(shipName);
                setIsEditingName(true);
              }}
              title="Click to rename spacecraft"
            >
              <span className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors truncate max-w-[120px] sm:max-w-xs tracking-wide uppercase">
                {shipName}
              </span>
              <Edit2 className="h-3 w-3 text-white/40 group-hover:text-white transition-colors" />
            </div>
          )}
        </div>

        {/* Mission Ready Indicator Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10.5px] font-bold border transition-all ${
            isMissionReady
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'border-amber-400/40 bg-amber-400/10 text-amber-400'
          }`}
        >
          {isMissionReady ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              <span>FLIGHT READY</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3" />
              <span>CONFIG PENDING</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Camera View Angle Presets */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5 font-mono text-[10.5px]">
        {cameraAngles.map((ang) => {
          const isActive = cameraViewAngle === ang.id;
          return (
            <button
              key={ang.id}
              type="button"
              onClick={() => {
                onCameraViewAngleChange?.(ang.id);
                workshopAudio.playCameraViewSwitch();
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {ang.label}
            </button>
          );
        })}
      </div>

      {/* 3. Engineering Diagnostic Toggles (CoM, CoT, Calipers) */}
      <div className="hidden xl:flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            onToggleCenterOfMass?.();
            workshopAudio.playClick(900);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
            showCenterOfMass
              ? 'border-amber-400/50 bg-amber-400/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Center of Mass (CoM)"
        >
          <Crosshair className="h-3 w-3" />
          <span>CoM</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleCenterOfThrust?.();
            workshopAudio.playClick(1000);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
            showCenterOfThrust
              ? 'border-[#00E5FF]/50 bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Center of Thrust (CoT)"
        >
          <Rocket className="h-3 w-3" />
          <span>CoT</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleMeasurementCalipers?.();
            workshopAudio.playClick(1100);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
            showMeasurementCalipers
              ? 'border-emerald-400/50 bg-emerald-400/20 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle 3D CAD Measurement Dimensions"
        >
          <Ruler className="h-3 w-3" />
          <span>DIM</span>
        </button>
      </div>

      {/* 4. Shading & Lighting Dropdowns */}
      <div className="flex items-center gap-1.5">
        {/* Camera Projection Toggle (Persp / Ortho) */}
        <button
          type="button"
          onClick={() => {
            onCameraProjectionChange(cameraProjection === 'perspective' ? 'orthographic' : 'perspective');
            workshopAudio.playClick(1150);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/10 bg-[#0B1226]/80 font-mono text-[11px] text-white/70 hover:text-white hover:border-[#00E5FF]/40 transition-all uppercase cursor-pointer"
          title={`Switch Camera Projection (Currently ${cameraProjection})`}
        >
          <span>{cameraProjection === 'perspective' ? 'PERSP' : 'ORTHO'}</span>
        </button>

        {/* Shading Mode (Lit, Wireframe, Cutaway/X-Ray) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsShadingMenuOpen(!isShadingMenuOpen);
              setIsLightingMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/10 bg-[#0B1226]/80 font-mono text-[11px] text-white/70 hover:text-white hover:border-[#00E5FF]/40 transition-all capitalize cursor-pointer"
          >
            <Box className="h-3 w-3 text-[#00E5FF]" />
            <span className="capitalize">{shadingMode}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isShadingMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-white/15 bg-[#070C1B] p-1.5 shadow-2xl backdrop-blur-2xl z-50 font-mono text-xs animate-fade-in">
              {(['lit', 'cutaway', 'wireframe', 'unlit'] as ShadingMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    onShadingModeChange(mode);
                    setIsShadingMenuOpen(false);
                    workshopAudio.playClick(1300);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize transition-colors flex items-center justify-between cursor-pointer ${
                    shadingMode === mode
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{mode}</span>
                  {mode === 'cutaway' && <Layers className="h-3 w-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lighting Environment Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLightingMenuOpen(!isLightingMenuOpen);
              setIsShadingMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/10 bg-[#0B1226]/80 font-mono text-[11px] text-white/70 hover:text-white hover:border-[#F27D26]/40 transition-all capitalize cursor-pointer"
          >
            <Sun className="h-3 w-3 text-[#F27D26]" />
            <span className="capitalize">{lightingEnvironmentMode}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isLightingMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-white/15 bg-[#070C1B] p-1.5 shadow-2xl backdrop-blur-2xl z-50 font-mono text-xs animate-fade-in">
              {(['cleanroom', 'orbit', 'eclipse'] as LightingEnvironmentMode[]).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => {
                    onLightingEnvironmentModeChange?.(env);
                    setIsLightingMenuOpen(false);
                    workshopAudio.playClick(1350);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize transition-colors flex items-center justify-between cursor-pointer ${
                    lightingEnvironmentMode === env
                      ? 'bg-[#F27D26]/20 text-[#F27D26] font-bold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{env}</span>
                  {env === 'cleanroom' && <Sparkles className="h-3 w-3 text-amber-400" />}
                  {env === 'orbit' && <Sun className="h-3 w-3 text-yellow-300" />}
                  {env === 'eclipse' && <Moon className="h-3 w-3 text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export 3D GLB Button */}
        {onExportGLB && (
          <button
            type="button"
            onClick={onExportGLB}
            title="Export 3D Model as Binary GLTF (.GLB)"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/10 bg-[#0B1226] text-[#38BDF8] font-mono text-[11px] font-bold hover:border-[#00E5FF]/50 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>GLB</span>
          </button>
        )}

        {/* Test Flight CTA Button */}
        {onTestFlight && (
          <button
            type="button"
            onClick={() => {
              onTestFlight();
              workshopAudio.playClick(1600);
            }}
            title="Launch Created Spacecraft into Controlled 3D Simulation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F27D26] to-[#EE3F2C] text-white font-sans text-xs font-bold shadow-[0_0_15px_rgba(242,125,38,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Rocket className="h-3.5 w-3.5 fill-current" />
            <span>Test Flight</span>
          </button>
        )}

        {/* Undo */}
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => {
            onUndo();
            workshopAudio.playClick(800);
          }}
          title="Undo (Ctrl+Z)"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => {
            onRedo();
            workshopAudio.playClick(950);
          }}
          title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        {/* Snapshot Viewport */}
        <button
          type="button"
          onClick={() => {
            onTakeSnapshot();
            workshopAudio.playClick(1500);
          }}
          title="Capture Viewport Screenshot"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>

        {/* Fullscreen Viewport Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Viewport'}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5 text-[#00E5FF]" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopEditorToolbar;
