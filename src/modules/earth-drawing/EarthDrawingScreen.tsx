import React, { useState, useRef, useEffect } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import {
  DRAWING_CATEGORIES,
  DRAWING_ACTIVITIES,
  DrawingActivity,
  ColorDefinition,
} from './drawingData';
import {
  Paintbrush,
  PaintBucket,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Award,
  Sparkles,
  ArrowLeft,
  Layers,
} from 'lucide-react';

type ToolMode = 'bucket' | 'brush' | 'eraser';

interface FillHistoryStep {
  type: 'fill';
  regionId: string;
  previousColor: string | null;
  newColor: string;
}

interface BrushHistoryStep {
  type: 'brush';
  imageData: ImageData;
}

type HistoryStep = FillHistoryStep | BrushHistoryStep;

export const EarthDrawingScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('earth');

  // Navigation State: Gallery vs Studio
  const [selectedActivity, setSelectedActivity] = useState<DrawingActivity | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Studio Interactive Tool State
  const [activeTool, setActiveTool] = useState<ToolMode>('bucket');
  const [selectedColor, setSelectedColor] = useState<ColorDefinition | null>(null);
  const [brushSize, setBrushSize] = useState<number>(6);

  // Region Fill State: regionId -> hex color
  const [filledRegions, setFilledRegions] = useState<Record<string, string>>({});
  const [showNumbers, setShowNumbers] = useState<boolean>(true);

  // Zoom and Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // History for Undo / Redo
  const [undoStack, setUndoStack] = useState<HistoryStep[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryStep[]>([]);

  // Freehand Canvas Overlay
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Celebration & Reward State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Initialize selected activity
  const handleSelectActivity = (activity: DrawingActivity) => {
    setSelectedActivity(activity);
    setSelectedColor(activity.palette[0]);
    setFilledRegions({});
    setUndoStack([]);
    setRedoStack([]);
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setIsCompleted(false);
    setShowRewardModal(false);
  };

  // Check completion
  useEffect(() => {
    if (!selectedActivity) return;
    const totalRegions = selectedActivity.regions.length;
    const filledCount = Object.keys(filledRegions).length;

    if (totalRegions > 0 && filledCount === totalRegions && !isCompleted) {
      setIsCompleted(true);
      setShowRewardModal(true);
    }
  }, [filledRegions, selectedActivity, isCompleted]);

  // Paint Bucket Region Click Handler
  const handleRegionClick = (regionId: string, _targetColorNumber: number) => {
    if (activeTool !== 'bucket' || !selectedColor) return;

    const previousColor = filledRegions[regionId] || null;
    const newColor = selectedColor.hex;

    if (previousColor === newColor) return;

    // Apply fill
    setFilledRegions((prev) => ({ ...prev, [regionId]: newColor }));

    // Record Undo Step
    const step: FillHistoryStep = {
      type: 'fill',
      regionId,
      previousColor,
      newColor,
    };
    setUndoStack((prev) => [...prev, step]);
    setRedoStack([]); // Clear redo on new action
  };

  // Undo Handler
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastStep = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    if (lastStep.type === 'fill') {
      const currentFill = filledRegions[lastStep.regionId];
      if (lastStep.previousColor) {
        setFilledRegions((prev) => ({ ...prev, [lastStep.regionId]: lastStep.previousColor! }));
      } else {
        setFilledRegions((prev) => {
          const updated = { ...prev };
          delete updated[lastStep.regionId];
          return updated;
        });
      }
      setRedoStack((prev) => [
        ...prev,
        {
          type: 'fill',
          regionId: lastStep.regionId,
          previousColor: lastStep.previousColor,
          newColor: currentFill,
        },
      ]);
    } else if (lastStep.type === 'brush') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(lastStep.imageData, 0, 0);
    }
  };

  // Redo Handler
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextStep = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    if (nextStep.type === 'fill') {
      setFilledRegions((prev) => ({ ...prev, [nextStep.regionId]: nextStep.newColor }));
      setUndoStack((prev) => [...prev, nextStep]);
    }
  };

  // Reset Canvas & Fills
  const handleReset = () => {
    setFilledRegions({});
    setUndoStack([]);
    setRedoStack([]);
    setIsCompleted(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Freehand Canvas Drawing Handlers
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel,
    };
  };

  const startBrushDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save previous snapshot for undo
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, { type: 'brush', imageData: snapshot }]);
    setRedoStack([]);

    const pos = getCanvasPos(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor?.hex || '#FFFFFF';
    ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
  };

  const drawBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopBrushDraw = () => {
    setIsDrawing(false);
  };

  // Pan Handlers
  const handleMouseDownPan = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) {
      // Middle click or Alt+Drag for pan
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMovePan = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUpPan = () => {
    setIsPanning(false);
  };

  // Export to PNG with Academic Watermark
  const handleExportPng = () => {
    if (!selectedActivity) return;

    const svgElement = document.getElementById('coloring-svg-canvas');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1200;
      exportCanvas.height = 900;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Draw dark cosmic space background
      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw rendered SVG
      ctx.drawImage(img, 0, 0, 1200, 900);

      // Draw overlay canvas if present
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0, 1200, 900);
      }

      // Add Academic Watermark
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('ORBIT ACADEMY // EARTH DRAWING STUDIO', 40, 850);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px JetBrains Mono, monospace';
      ctx.fillText(
        `Activity: ${selectedActivity.title} | Certified Space Explorer | ${new Date().toLocaleDateString()}`,
        40,
        875
      );

      // Trigger Download
      const link = document.createElement('a');
      link.download = `orbit-academy-${selectedActivity.id}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = blobURL;
  };

  // Filtered Activities
  const filteredActivities = DRAWING_ACTIVITIES.filter((act) => {
    if (activeCategory === 'all') return true;
    return act.category === activeCategory;
  });

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* VIEW 1: Visual Illustration Gallery */}
        {!selectedActivity && (
          <div className="flex flex-col gap-6 w-full">
            {/* Gallery Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#031A2A] via-[#05070D] to-[#0A2540] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#10B981]">
                      EARTH SCIENCE & ART STUDIO
                    </span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#38BDF8]">
                      8 EXPLORATION CATEGORIES
                    </span>
                  </div>

                  <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
                    Cosmic Illustration & Color-by-Number Studio
                  </h1>

                  <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                    Explore original space science illustrations across 8 dedicated categories. 
                    Fill closed scientific vector regions with verified spectral colors, paint freely with brushes, 
                    and earn academic space exploration badges!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-[#94A3B8]">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span>8 Certifications Available</span>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                    activeCategory === 'all'
                      ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                      : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                  }`}
                >
                  All Categories ({DRAWING_ACTIVITIES.length})
                </button>
                {DRAWING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all ${
                      activeCategory === cat.id
                        ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                        : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Illustration Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleSelectActivity(act)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#05070D]/85 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#38BDF8]/50 hover:bg-white/[0.04] hover:-translate-y-1 cursor-pointer"
                >
                  {/* Thumbnail Preview Banner */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#080C1A] flex items-center justify-center border border-white/5 p-2">
                    {/* Embedded Scaled Preview */}
                    <svg
                      viewBox={act.viewBox}
                      className="h-full w-full object-contain opacity-85 transition-transform duration-500 group-hover:scale-105"
                    >
                      {act.regions.map((r) => {
                        const defaultCol = act.palette.find((p) => p.number === r.targetColorNumber)?.hex || '#334155';
                        return (
                          <path
                            key={r.id}
                            d={r.path}
                            fill={defaultCol}
                            stroke="#05070D"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </svg>

                    {/* Difficulty Badge */}
                    <span className="absolute top-2 right-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] font-bold text-[#38BDF8] backdrop-blur-md">
                      {act.difficulty}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="mt-3 flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                      <span>{act.categoryLabel}</span>
                      <span>{act.regions.length} Regions</span>
                    </div>

                    <h3 className="font-sans text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {act.title}
                    </h3>

                    <p className="font-sans text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{act.badgeReward}</span>
                    </span>

                    <span className="rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2.5 py-1 font-mono text-[10px] font-bold text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#05070D] transition-colors">
                      Start Studio →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive SVG Colour-by-Number Studio */}
        {selectedActivity && (
          <div className="flex flex-col gap-4 w-full">
            {/* Studio Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#05070D]/85 p-3.5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Gallery</span>
                </button>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-sans text-sm font-bold text-[#F8FAFC] sm:text-base">
                      {selectedActivity.title}
                    </h2>
                    <span className="rounded-full bg-[#10B981]/15 px-2 py-0.2 font-mono text-[9px] font-bold text-[#10B981]">
                      {Object.keys(filledRegions).length} / {selectedActivity.regions.length} Colored
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {selectedActivity.categoryLabel} // {selectedActivity.difficulty}
                  </span>
                </div>
              </div>

              {/* Studio Actions: Undo, Redo, Reset, Numbers Toggle, Export */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  title="Undo last action"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30"
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  title="Redo action"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowNumbers((prev) => !prev)}
                  title="Toggle Region Numbers"
                  className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 font-mono text-xs transition-colors ${
                    showNumbers
                      ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]'
                      : 'border-white/10 bg-white/5 text-[#94A3B8]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Numbers</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset illustration"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-red-400 hover:text-red-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleExportPng}
                  title="Export PNG Artwork"
                  className="flex items-center gap-1.5 rounded-xl bg-[#38BDF8] px-3 py-1 font-mono text-xs font-bold text-[#05070D] shadow-md transition-all hover:bg-[#7DD3FC]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export PNG</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Studio Canvas Workspace */}
            <div className="relative flex flex-col lg:flex-row gap-4 w-full">
              {/* Left/Main Canvas Viewer */}
              <div
                onMouseDown={handleMouseDownPan}
                onMouseMove={handleMouseMovePan}
                onMouseUp={handleMouseUpPan}
                className="relative flex-1 aspect-[4/3] min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#080C1A] shadow-2xl flex items-center justify-center select-none"
              >
                {/* Scalable Container for SVG & Canvas Overlay */}
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transition: isPanning ? 'none' : 'transform 0.15s ease-out',
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* 1. Underlying Interactive SVG Color-by-Number Vector */}
                  <svg
                    id="coloring-svg-canvas"
                    viewBox={selectedActivity.viewBox}
                    className="w-full h-full max-h-[90%] max-w-[95%] pointer-events-auto"
                  >
                    {/* SVG Closed Regions */}
                    {selectedActivity.regions.map((region) => {
                      const isFilled = Boolean(filledRegions[region.id]);
                      const fillColor = isFilled
                        ? filledRegions[region.id]
                        : '#111827';
                      const isTargetColor =
                        selectedColor?.number === region.targetColorNumber;

                      return (
                        <path
                          key={region.id}
                          d={region.path}
                          fill={fillColor}
                          stroke={isTargetColor && !isFilled ? '#38BDF8' : '#334155'}
                          strokeWidth={isTargetColor && !isFilled ? '2.5' : '1.5'}
                          onClick={() =>
                            handleRegionClick(region.id, region.targetColorNumber)
                          }
                          className="transition-colors duration-200 cursor-pointer hover:opacity-90"
                          style={{
                            filter:
                              isTargetColor && !isFilled
                                ? 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))'
                                : undefined,
                          }}
                        />
                      );
                    })}

                    {/* Number Labels for Closed Regions */}
                    {showNumbers &&
                      selectedActivity.regions.map((region) => {
                        const isFilled = Boolean(filledRegions[region.id]);
                        if (isFilled) return null; // Hide number once colored

                        const isTargetColor =
                          selectedColor?.number === region.targetColorNumber;

                        return (
                          <g
                            key={`label-${region.id}`}
                            className="pointer-events-none select-none"
                          >
                            <circle
                              cx={region.labelPos.x}
                              cy={region.labelPos.y}
                              r={isTargetColor ? '11' : '9'}
                              fill={isTargetColor ? '#38BDF8' : '#0F172A'}
                              stroke={isTargetColor ? '#FFFFFF' : '#475569'}
                              strokeWidth="1"
                            />
                            <text
                              x={region.labelPos.x}
                              y={region.labelPos.y + 3.5}
                              textAnchor="middle"
                              fill={isTargetColor ? '#05070D' : '#F8FAFC'}
                              fontSize={isTargetColor ? '10' : '9'}
                              fontFamily="JetBrains Mono, monospace"
                              fontWeight="bold"
                            >
                              {region.targetColorNumber}
                            </text>
                          </g>
                        );
                      })}
                  </svg>

                  {/* 2. Freehand Brush & Eraser Overlay Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={startBrushDraw}
                    onMouseMove={drawBrush}
                    onMouseUp={stopBrushDraw}
                    onMouseLeave={stopBrushDraw}
                    className={`absolute inset-0 h-full w-full ${
                      activeTool === 'bucket' ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair'
                    }`}
                  />
                </div>

                {/* Floating Zoom & Pan Controls */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-white/10 bg-[#05070D]/80 p-1 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    title="Zoom in"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-[10px] text-[#94A3B8] px-1 tabular-nums">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.25))}
                    title="Zoom out"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1.0);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    title="Reset view"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Side: Tools & Numbered Color Palette */}
              <div className="lg:w-80 flex flex-col gap-4">
                {/* Tool Selector Bar */}
                <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-3 backdrop-blur-xl">
                  <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Creative Tools
                  </span>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('bucket')}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 font-mono text-xs transition-all ${
                        activeTool === 'bucket'
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                          : 'border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5'
                      }`}
                    >
                      <PaintBucket className="h-4 w-4 text-[#38BDF8]" />
                      <span>Bucket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTool('brush')}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 font-mono text-xs transition-all ${
                        activeTool === 'brush'
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                          : 'border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5'
                      }`}
                    >
                      <Paintbrush className="h-4 w-4 text-[#F59E0B]" />
                      <span>Brush</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTool('eraser')}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 font-mono text-xs transition-all ${
                        activeTool === 'eraser'
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                          : 'border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5'
                      }`}
                    >
                      <Eraser className="h-4 w-4 text-red-400" />
                      <span>Eraser</span>
                    </button>
                  </div>

                  {/* Brush Size Slider (if brush/eraser active) */}
                  {activeTool !== 'bucket' && (
                    <div className="mt-3 flex flex-col gap-1 border-t border-white/5 pt-2">
                      <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                        <span>Stroke Width</span>
                        <span>{brushSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="28"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                        className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Numbered Scientific Color Palette */}
                <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-3.5 backdrop-blur-xl flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Color-By-Number Palette
                      </span>
                      <span className="font-mono text-[9px] text-[#38BDF8]">
                        Tap number to highlight
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                      {selectedActivity.palette.map((colorDef) => {
                        const isSelected = selectedColor?.number === colorDef.number;
                        const matchingRegions = selectedActivity.regions.filter(
                          (r) => r.targetColorNumber === colorDef.number
                        );
                        const filledMatches = matchingRegions.filter(
                          (r) => filledRegions[r.id] === colorDef.hex
                        );

                        return (
                          <button
                            key={colorDef.number}
                            type="button"
                            onClick={() => setSelectedColor(colorDef)}
                            className={`group flex items-center justify-between rounded-xl border p-2 transition-all ${
                              isSelected
                                ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                                : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Number Badge */}
                              <span
                                className="flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#05070D]"
                                style={{ backgroundColor: colorDef.hex }}
                              >
                                {colorDef.number}
                              </span>

                              <div className="flex flex-col text-left">
                                <span className="font-sans text-xs font-semibold text-[#F8FAFC]">
                                  {colorDef.name}
                                </span>
                                <span className="font-mono text-[9px] text-[#94A3B8]">
                                  {colorDef.hex}
                                </span>
                              </div>
                            </div>

                            {/* Region Progress for this Color */}
                            <span className="font-mono text-[10px] text-[#94A3B8]">
                              {filledMatches.length}/{matchingRegions.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Educational Fact Callout */}
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
                    <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-[#F59E0B]">
                      <Sparkles className="h-3 w-3" />
                      <span>ASTROPHYSICS FACT</span>
                    </div>
                    <p className="mt-1 font-sans text-xs text-[#94A3B8] leading-relaxed">
                      {selectedActivity.educationalFact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPLETION MODAL & EDUCATIONAL REWARD */}
            {showRewardModal && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
              >
                <div className="relative flex max-w-md w-full flex-col items-center rounded-3xl border border-[#F59E0B]/40 bg-[#05070D]/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl">
                  {/* Glowing Award Star */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.5)]">
                    <Award className="h-8 w-8 animate-bounce" />
                  </div>

                  <span className="mt-4 font-mono text-xs uppercase tracking-widest text-[#F59E0B]">
                    ACTIVITY COMPLETE!
                  </span>

                  <h3 className="mt-1 font-sans text-2xl font-extrabold text-[#F8FAFC]">
                    {selectedActivity.badgeReward}
                  </h3>

                  <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Splendid work, Explorer! You have accurately rendered the{' '}
                    <strong className="text-[#F8FAFC]">{selectedActivity.title}</strong>{' '}
                    scientific illustration with verified astronomical pigments.
                  </p>

                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-left">
                    <span className="font-mono text-[9.5px] text-[#38BDF8] font-bold">
                      ACQUIRED KNOWLEDGE:
                    </span>
                    <p className="mt-1 font-sans text-xs text-[#CBD5E1]">
                      {selectedActivity.educationalFact}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => setShowRewardModal(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Keep Refining
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRewardModal(false);
                        handleExportPng();
                      }}
                      className="flex-1 rounded-xl bg-[#F59E0B] py-2.5 font-mono text-xs font-bold text-[#05070D] hover:bg-[#FBBF24] shadow-lg"
                    >
                      Export & Claim
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ModuleShell>
  );
};
