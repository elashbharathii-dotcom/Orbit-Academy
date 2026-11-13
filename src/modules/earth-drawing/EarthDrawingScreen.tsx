import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import {
  Paintbrush,
  Eraser,
  RotateCcw,
  Download,
  Sparkles,
  Palette,
  CheckCircle2,
  Info,
} from 'lucide-react';

const EARTH_PALETTE = [
  { name: 'Ocean Azure', color: '#38BDF8' },
  { name: 'Biosphere Green', color: '#10B981' },
  { name: 'Cloud White', color: '#F8FAFC' },
  { name: 'Solar Amber', color: '#F59E0B' },
  { name: 'Martian Terracotta', color: '#EF4444' },
  { name: 'Aurora Cyan', color: '#06B6D4' },
  { name: 'Stellar Violet', color: '#A855F7' },
  { name: 'Deep Space', color: '#0F172A' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 3 },
  { label: 'Medium', size: 8 },
  { label: 'Bold', size: 16 },
  { label: 'Marker', size: 28 },
];

const INSPIRATION_PROMPTS = [
  '✦ Draw Earth’s invisible magnetic field lines deflecting the solar wind',
  '✦ Sketch swirling hurricane cloud patterns over the Pacific Ocean',
  '✦ Paint a satellite in Low Earth Orbit observing continental coastlines',
  '✦ Illustrate the vibrant green auroral oval dancing over the poles',
];

export const EarthDrawingScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('earth');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeColor, setActiveColor] = useState<string>(EARTH_PALETTE[0].color);
  const [brushSize, setBrushSize] = useState<number>(8);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Initialize canvas with dark space background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Fill background with dark navy space texture
    ctx.fillStyle = '#080C1A';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Initial stars in drawing background
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(248, 250, 252, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Save initial state to history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    setIsDrawing(true);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#080C1A' : activeColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), snapshot]);
  };

  const handleUndo = useCallback(() => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  }, [history]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#080C1A';
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(248, 250, 252, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([snapshot]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `orbit-academy-earth-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-5 w-full">
        {/* Top Activity Banner & Creative Inspiration */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0A0F1D]/80 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Earth Creative Science & Astro-Art Canvas
              </h2>
              <p className="font-mono text-xs text-[#94A3B8]">
                {INSPIRATION_PROMPTS[promptIndex]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPromptIndex((prev) => (prev + 1) % INSPIRATION_PROMPTS.length)}
            className="flex items-center gap-1.5 rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-3 py-1.5 font-mono text-xs text-[#38BDF8] transition-colors hover:border-[#38BDF8] hover:bg-[#38BDF8]/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next Inspiration Prompt</span>
          </button>
        </div>

        {/* Drawing Workspace & Toolbar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Left / Top: Interactive Tool Palette */}
          <div className="lg:col-span-1 flex flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/90 p-4 shadow-xl backdrop-blur-md">
            {/* Tool Mode: Brush vs Eraser */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Drawing Tool
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEraser(false)}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 font-mono text-xs transition-all ${!isEraser
                      ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                >
                  <Paintbrush className="h-4 w-4" />
                  <span>Brush</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 font-mono text-xs transition-all ${isEraser
                      ? 'border border-[#F59E0B] bg-[#F59E0B]/15 font-bold text-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                >
                  <Eraser className="h-4 w-4" />
                  <span>Eraser</span>
                </button>
              </div>
            </div>

            {/* Earth Astro-Color Palette */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Celestial Palette
              </span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {EARTH_PALETTE.map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    title={swatch.name}
                    aria-label={`Select ${swatch.name}`}
                    onClick={() => {
                      setActiveColor(swatch.color);
                      setIsEraser(false);
                    }}
                    className={`relative h-10 w-full rounded-xl border transition-all ${activeColor === swatch.color && !isEraser
                        ? 'border-[#F8FAFC] scale-105 shadow-[0_0_10px_rgba(248,250,252,0.4)]'
                        : 'border-black/40 hover:scale-102'
                      }`}
                    style={{ backgroundColor: swatch.color }}
                  >
                    {activeColor === swatch.color && !isEraser && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 drop-shadow"
                          style={{
                            color: swatch.color === '#F8FAFC' ? '#0F172A' : '#FFFFFF',
                          }}
                        />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Brush Gauge
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {BRUSH_SIZES.map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setBrushSize(b.size)}
                    className={`rounded-xl py-2 font-mono text-xs transition-all ${brushSize === b.size
                        ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#38BDF8]'
                        : 'border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                  >
                    {b.label} ({b.size}px)
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Actions: Undo, Clear, Download */}
            <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-[rgba(148,163,184,0.12)]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                  aria-label="Undo last stroke"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] py-2 font-mono text-xs text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear canvas"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 py-2 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/20"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#38BDF8] bg-[#38BDF8] py-2.5 font-mono text-xs font-bold text-[#05070D] shadow-lg transition-all hover:bg-[#7DD3FC]"
              >
                <Download className="h-4 w-4" />
                <span>Download Artwork (PNG)</span>
              </button>

              {saveToast && (
                <div className="text-center font-mono text-[10px] text-[#10B981] animate-fade-in">
                  ✓ Artwork exported to downloads!
                </div>
              )}
            </div>
          </div>

          {/* Right / Bottom: Full-Screen Responsive HTML5 Drawing Canvas */}
          <div className="lg:col-span-3 flex flex-col items-center rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-[rgba(148,163,184,0.12)] shadow-inner touch-none cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block"
              />
            </div>

            <div className="w-full flex items-center justify-between pt-2 px-1 text-[11px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-[#38BDF8]" />
                Touch & stylus supported • 60 FPS vector smoothing
              </span>
              <span>EARTH // 12,742 KM DIAMETER</span>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
