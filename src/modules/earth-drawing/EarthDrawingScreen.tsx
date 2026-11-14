import React, { useState, useRef, useEffect } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
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
  Check,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) / zoomLevel,
      y: (touch.clientY - rect.top) / zoomLevel,
    };
  };

  const startBrushDraw = (pos: { x: number; y: number }) => {
    if (activeTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save previous snapshot for undo
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, { type: 'brush', imageData: snapshot }]);
    setRedoStack([]);

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor?.hex || '#FFFFFF';
    ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
  };

  const drawBrush = (pos: { x: number; y: number }) => {
    if (!isDrawing || activeTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopBrushDraw = () => {
    setIsDrawing(false);
  };

  // Pan Handlers
  const handleMouseDownPan = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) {
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

    // Clone SVG to ensure clean serialization
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // If there is an image overlay, remove it from the cloned SVG so browser doesn't block blob subresource
    const nestedImages = svgClone.querySelectorAll('image');
    nestedImages.forEach((img) => img.remove());

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const finishExport = (renderedSvgImg: HTMLImageElement, overlayImg?: HTMLImageElement) => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1200;
      exportCanvas.height = 900;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Dark cosmic space background
      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Parse viewBox to preserve aspect ratio
      const vbParts = selectedActivity.viewBox.split(' ').map(Number);
      const vbWidth = vbParts[2] || 600;
      const vbHeight = vbParts[3] || 450;
      const vbAspect = vbWidth / vbHeight;

      // Available drawing area inside canvas
      const maxDrawWidth = 1120;
      const maxDrawHeight = 760;
      const canvasAspect = maxDrawWidth / maxDrawHeight;

      let drawW: number;
      let drawH: number;
      if (vbAspect > canvasAspect) {
        drawW = maxDrawWidth;
        drawH = maxDrawWidth / vbAspect;
      } else {
        drawH = maxDrawHeight;
        drawW = maxDrawHeight * vbAspect;
      }

      const drawX = (exportCanvas.width - drawW) / 2;
      const drawY = 40 + (maxDrawHeight - drawH) / 2;

      // Draw SVG fills
      ctx.drawImage(renderedSvgImg, drawX, drawY, drawW, drawH);

      // If line art overlay exists, blend on top with multiply
      if (overlayImg && overlayImg.complete) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(overlayImg, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // Overlay freehand canvas
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, drawX, drawY, drawW, drawH);
      }

      // Academic Watermark
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('ORBIT ACADEMY // COSMIC CREATIVE STUDIO', 40, 845);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px JetBrains Mono, monospace';
      ctx.fillText(
        `Plate: ${selectedActivity.title} | Certified Space Artist | ${new Date().toLocaleDateString()}`,
        40,
        872
      );

      // Clean up blob URL
      URL.revokeObjectURL(blobURL);

      // Download
      const link = document.createElement('a');
      link.download = `orbit-academy-${selectedActivity.id}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };

    const svgImg = new Image();
    svgImg.onload = () => {
      if (selectedActivity.lineArtOverlayUrl) {
        const overlayImg = new Image();
        overlayImg.onload = () => finishExport(svgImg, overlayImg);
        overlayImg.onerror = () => finishExport(svgImg);
        overlayImg.src = selectedActivity.lineArtOverlayUrl;
      } else {
        finishExport(svgImg);
      }
    };
    svgImg.src = blobURL;
  };

  // Filtered Activities
  const filteredActivities = DRAWING_ACTIVITIES.filter((act) => {
    if (activeCategory === 'all') return true;
    return act.category === activeCategory;
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      {/* Subtle Starfield & Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,40,60,0.3),rgba(3,6,17,0.95))]"
        aria-hidden="true"
      />

      {/* Universal Master Header */}
      <MasterHeader />

      <main className="relative z-10 flex-1 flex flex-col p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 max-w-7xl w-full mx-auto">
        <div className="flex flex-col gap-6 w-full">
          {/* VIEW 1: Visual Illustration Gallery */}
          {!selectedActivity && (
            <div className="flex flex-col gap-8 w-full animate-fade-in">
              {/* Gallery Hero Banner */}
              <GlassCard
                variant="elevated"
                className="p-6 sm:p-8 flex flex-col justify-between border-white/10 bg-gradient-to-r from-[#031A2A]/90 via-[#070C1B]/95 to-[#0A2540]/80 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TelemetryBadge
                        label="COSMIC CREATIVE STUDIO"
                        tone="emerald"
                        pulsing
                        size="sm"
                      />
                      <TelemetryBadge
                        label={`${DRAWING_ACTIVITIES.length} COLORING PLATES`}
                        tone="cyan"
                        size="sm"
                      />
                      <TelemetryBadge
                        label="FREEHAND & VECTOR"
                        tone="amber"
                        size="sm"
                      />
                    </div>

                    <h1 className="mt-3 font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                      Cosmic Creative Studio & Color-by-Number
                    </h1>

                    <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                      Explore aerospace illustrations across {DRAWING_CATEGORIES.length} dedicated categories. 
                      Fill closed vector regions with spectral pigments, sketch freehand with brushes, 
                      and export certified space artwork!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-2.5 font-mono text-xs text-[#94A3B8]">
                      <Award className="h-4 w-4 text-[#F59E0B]" />
                      <span className="text-[#F8FAFC] font-bold">{DRAWING_ACTIVITIES.length} Badges</span>
                      <span>Available</span>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                      activeCategory === 'all'
                        ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                        : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                    }`}
                  >
                    All Plates ({DRAWING_ACTIVITIES.length})
                  </button>

                  {DRAWING_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                        activeCategory === cat.id
                          ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Illustration Gallery Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Creative Plates ({filteredActivities.length})
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">
                    Select a plate to open studio
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredActivities.map((act) => (
                    <GlassCard
                      key={act.id}
                      variant="interactive"
                      onClick={() => handleSelectActivity(act)}
                      className="group p-4 flex flex-col justify-between border-white/10 bg-[#070C1B]/80 hover:bg-[#0B1528]/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      {/* Scaled Preview Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#040814] flex items-center justify-center border border-white/5 p-2 group-hover:border-[#38BDF8]/30 transition-colors">
                        {act.thumbnailUrl ? (
                          <div className="relative h-full w-full flex items-center justify-center bg-white rounded-lg p-1 overflow-hidden">
                            <img
                              src={act.thumbnailUrl}
                              alt={act.title}
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <svg
                            viewBox={act.viewBox}
                            className="h-full w-full object-contain opacity-85 transition-transform duration-500 group-hover:scale-105"
                          >
                            {act.regions.map((r) => {
                              const defaultCol =
                                act.palette.find((p) => p.number === r.targetColorNumber)?.hex ||
                                '#334155';
                              return (
                                <path
                                  key={r.id}
                                  d={r.path}
                                  fill={defaultCol}
                                  stroke="#040814"
                                  strokeWidth="1.5"
                                />
                              );
                            })}
                          </svg>
                        )}

                        {/* Difficulty Badge */}
                        <div className="absolute top-2 right-2">
                          <TelemetryBadge
                            label={act.difficulty}
                            tone={
                              act.difficulty === 'Beginner'
                                ? 'emerald'
                                : act.difficulty === 'Intermediate'
                                ? 'amber'
                                : 'violet'
                            }
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Card Meta Content */}
                      <div className="mt-3.5 flex flex-col gap-1 flex-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                          <span className="uppercase tracking-wider">{act.categoryLabel}</span>
                          <span className="text-[#38BDF8]">{act.regions.length} Regions</span>
                        </div>

                        <h3 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                          {act.title}
                        </h3>

                        <p className="font-sans text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1 font-bold">
                          <Sparkles className="h-3 w-3" />
                          <span>{act.badgeReward}</span>
                        </span>

                        <span className="rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-3 py-1 font-mono text-[10.5px] font-bold text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#030611] transition-colors tracking-wide">
                          OPEN STUDIO →
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Interactive SVG Colour-by-Number Studio */}
          {selectedActivity && (
            <div className="flex flex-col gap-5 w-full animate-fade-in">
              {/* Studio Header Bar */}
              <GlassCard
                variant="elevated"
                className="p-3.5 flex flex-wrap items-center justify-between gap-4 border-white/10"
              >
                <div className="flex items-center gap-3">
                  <SpaceButton
                    variant="secondary"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={() => setSelectedActivity(null)}
                  >
                    Gallery
                  </SpaceButton>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC]">
                        {selectedActivity.title}
                      </h2>
                      <TelemetryBadge
                        label="COLORED"
                        value={`${Object.keys(filledRegions).length} / ${selectedActivity.regions.length}`}
                        tone={
                          Object.keys(filledRegions).length === selectedActivity.regions.length
                            ? 'emerald'
                            : 'cyan'
                        }
                        size="sm"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#94A3B8]">
                      {selectedActivity.categoryLabel} // {selectedActivity.difficulty} Plate
                    </span>
                  </div>
                </div>

                {/* Studio Actions: Undo, Redo, Numbers Toggle, Reset, Export */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    title="Undo last action"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    title="Redo action"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNumbers((prev) => !prev)}
                    title="Toggle Region Numbers"
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs transition-colors ${
                      showNumbers
                        ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]'
                        : 'border-white/10 bg-[#0B1226]/80 text-[#94A3B8]'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Numbers</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset illustration"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>

                  <SpaceButton
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={handleExportPng}
                  >
                    Export PNG
                  </SpaceButton>
                </div>
              </GlassCard>

              {/* Main Interactive Studio Canvas Workspace */}
              <div className="relative flex flex-col lg:flex-row gap-5 w-full">
                {/* Left/Main Canvas Viewer */}
                <div
                  onMouseDown={handleMouseDownPan}
                  onMouseMove={handleMouseMovePan}
                  onMouseUp={handleMouseUpPan}
                  className="relative flex-1 aspect-[4/3] min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#040814] shadow-2xl flex items-center justify-center select-none"
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
                      {/* Base Paper Surface for line art overlay artwork */}
                      {selectedActivity.lineArtOverlayUrl && (
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          fill="#FFFFFF"
                          rx="4"
                        />
                      )}

                      {/* SVG Closed Regions */}
                      {selectedActivity.regions.map((region) => {
                        const isFilled = Boolean(filledRegions[region.id]);
                        const defaultUnfilled = selectedActivity.lineArtOverlayUrl ? '#FFFFFF' : '#0B1226';
                        const fillColor = isFilled
                          ? filledRegions[region.id]
                          : defaultUnfilled;
                        const isTargetColor =
                          selectedColor?.number === region.targetColorNumber;
                        const strokeCol = isTargetColor && !isFilled
                          ? '#38BDF8'
                          : selectedActivity.lineArtOverlayUrl
                          ? 'transparent'
                          : '#1E293B';

                        return (
                          <path
                            key={region.id}
                            d={region.path}
                            fill={fillColor}
                            stroke={strokeCol}
                            strokeWidth={isTargetColor && !isFilled ? '2.5' : '1.5'}
                            onClick={() =>
                              handleRegionClick(region.id, region.targetColorNumber)
                            }
                            className="transition-colors duration-200 cursor-pointer hover:opacity-90"
                            style={{
                              filter:
                                isTargetColor && !isFilled
                                  ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.5))'
                                  : undefined,
                            }}
                          />
                        );
                      })}

                      {/* Line Art Overlay on top of colorable regions */}
                      {selectedActivity.lineArtOverlayUrl && (
                        <image
                          href={selectedActivity.lineArtOverlayUrl}
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          preserveAspectRatio="xMidYMid meet"
                          style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
                        />
                      )}

                      {/* Number Labels for Closed Regions */}
                      {showNumbers &&
                        selectedActivity.regions.map((region) => {
                          const isFilled = Boolean(filledRegions[region.id]);
                          if (isFilled) return null; // Hide number once colored

                          const isTargetColor =
                            selectedColor?.number === region.targetColorNumber;

                          const circleFill = isTargetColor
                            ? '#38BDF8'
                            : selectedActivity.lineArtOverlayUrl
                            ? '#FFFFFF'
                            : '#0B1226';
                          const circleStroke = isTargetColor
                            ? '#FFFFFF'
                            : selectedActivity.lineArtOverlayUrl
                            ? '#64748B'
                            : '#475569';
                          const textFill = isTargetColor
                            ? '#030611'
                            : selectedActivity.lineArtOverlayUrl
                            ? '#0F172A'
                            : '#F8FAFC';

                          return (
                            <g
                              key={`label-${region.id}`}
                              className="pointer-events-none select-none"
                            >
                              <circle
                                cx={region.labelPos.x}
                                cy={region.labelPos.y}
                                r={isTargetColor ? '11' : '9'}
                                fill={circleFill}
                                stroke={circleStroke}
                                strokeWidth={selectedActivity.lineArtOverlayUrl ? '1.5' : '1'}
                              />
                              <text
                                x={region.labelPos.x}
                                y={region.labelPos.y + 3.5}
                                textAnchor="middle"
                                fill={textFill}
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
                      onMouseDown={(e) => startBrushDraw(getCanvasPos(e))}
                      onMouseMove={(e) => drawBrush(getCanvasPos(e))}
                      onMouseUp={stopBrushDraw}
                      onMouseLeave={stopBrushDraw}
                      onTouchStart={(e) => {
                        startBrushDraw(getTouchPos(e));
                      }}
                      onTouchMove={(e) => {
                        drawBrush(getTouchPos(e));
                      }}
                      onTouchEnd={stopBrushDraw}
                      className={`absolute inset-0 h-full w-full ${
                        activeTool === 'bucket'
                          ? 'pointer-events-none'
                          : 'pointer-events-auto cursor-crosshair touch-none'
                      }`}
                    />
                  </div>

                  {/* Floating Zoom & Pan Controls */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-white/10 bg-[#070C1B]/85 p-1 backdrop-blur-md shadow-lg">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                      title="Zoom in"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-[#94A3B8] px-1 tabular-nums font-bold">
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
                <div className="lg:w-84 flex flex-col gap-4">
                  {/* Tool Selector Card */}
                  <GlassCard variant="elevated" className="p-4 border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Studio Tools
                      </span>
                      <TelemetryBadge
                        label={activeTool.toUpperCase()}
                        tone="cyan"
                        size="sm"
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTool('bucket')}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 font-mono text-xs transition-all ${
                          activeTool === 'bucket'
                            ? 'border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                            : 'border-white/5 bg-[#0B1226]/50 text-[#94A3B8] hover:bg-white/5'
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
                            ? 'border-[#F59E0B] bg-[#F59E0B]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'border-white/5 bg-[#0B1226]/50 text-[#94A3B8] hover:bg-white/5'
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
                            ? 'border-red-400 bg-red-400/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(248,113,113,0.25)]'
                            : 'border-white/5 bg-[#0B1226]/50 text-[#94A3B8] hover:bg-white/5'
                        }`}
                      >
                        <Eraser className="h-4 w-4 text-red-400" />
                        <span>Eraser</span>
                      </button>
                    </div>

                    {/* Brush Size Slider (if brush/eraser active) */}
                    {activeTool !== 'bucket' && (
                      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3 animate-fade-in">
                        <div className="flex justify-between items-center font-mono text-[10px] text-[#94A3B8]">
                          <span>Stroke Width: {brushSize}px</span>
                          <span
                            className="inline-block rounded-full bg-white transition-all"
                            style={{
                              width: `${Math.max(4, brushSize)}px`,
                              height: `${Math.max(4, brushSize)}px`,
                            }}
                          />
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
                  </GlassCard>

                  {/* Numbered Scientific Color Palette */}
                  <GlassCard
                    variant="elevated"
                    className="p-4 border-white/10 flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          Color Palette ({selectedActivity.palette.length})
                        </span>
                        <span className="font-mono text-[9px] text-[#38BDF8]">
                          Tap to select
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
                          const isColorDone =
                            matchingRegions.length > 0 &&
                            filledMatches.length === matchingRegions.length;

                          return (
                            <button
                              key={colorDef.number}
                              type="button"
                              onClick={() => setSelectedColor(colorDef)}
                              className={`group flex items-center justify-between rounded-xl border p-2.5 transition-all text-left ${
                                isSelected
                                  ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                                  : 'border-white/5 bg-[#0B1226]/50 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {/* Number Swatch */}
                                <span
                                  className="flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#030611] shadow-sm"
                                  style={{
                                    backgroundColor: colorDef.hex,
                                    border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                                  }}
                                >
                                  {colorDef.number}
                                </span>

                                <div className="flex flex-col">
                                  <span className="font-sans text-xs font-semibold text-[#F8FAFC]">
                                    {colorDef.name}
                                  </span>
                                  <span className="font-mono text-[9px] text-[#94A3B8]">
                                    {colorDef.hex}
                                  </span>
                                </div>
                              </div>

                              {/* Progress for this Color */}
                              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                {isColorDone ? (
                                  <span className="flex items-center gap-1 text-[#10B981] font-bold">
                                    <Check className="h-3 w-3" />
                                    <span>Done</span>
                                  </span>
                                ) : (
                                  <span className="text-[#94A3B8]">
                                    {filledMatches.length}/{matchingRegions.length}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Educational Astrophysics Fact Callout */}
                    <div className="mt-4 rounded-xl border border-white/5 bg-[#0B1226]/60 p-3 text-left">
                      <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-[#F59E0B] font-bold">
                        <Sparkles className="h-3 w-3" />
                        <span>ASTROPHYSICS FACT</span>
                      </div>
                      <p className="mt-1 font-sans text-xs text-[#CBD5E1] leading-relaxed">
                        {selectedActivity.educationalFact}
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* COMPLETION MODAL & EDUCATIONAL REWARD */}
              {showRewardModal && (
                <div
                  role="dialog"
                  aria-modal="true"
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                >
                  <GlassCard
                    variant="elevated"
                    glowingBorder="amber"
                    className="relative flex max-w-md w-full flex-col items-center p-6 sm:p-8 text-center bg-[#070C1B]/95 border-[#F59E0B]/40 shadow-2xl"
                  >
                    {/* Glowing Award Star */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.5)]">
                      <Award className="h-8 w-8 animate-bounce" />
                    </div>

                    <TelemetryBadge
                      label="ACTIVITY COMPLETE"
                      tone="amber"
                      size="sm"
                      className="mt-4"
                    />

                    <h3 className="mt-2 font-sans text-2xl font-extrabold text-[#F8FAFC]">
                      {selectedActivity.badgeReward}
                    </h3>

                    <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Splendid work, Explorer! You have accurately rendered the{' '}
                      <strong className="text-[#F8FAFC]">{selectedActivity.title}</strong>{' '}
                      space science illustration with verified astronomical pigments.
                    </p>

                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 text-left w-full">
                      <span className="font-mono text-[9.5px] text-[#38BDF8] font-bold block mb-1">
                        ACQUIRED KNOWLEDGE:
                      </span>
                      <p className="font-sans text-xs text-[#CBD5E1]">
                        {selectedActivity.educationalFact}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-3 w-full">
                      <SpaceButton
                        variant="secondary"
                        size="md"
                        className="flex-1"
                        onClick={() => setShowRewardModal(false)}
                      >
                        Keep Refining
                      </SpaceButton>

                      <SpaceButton
                        variant="primary"
                        size="md"
                        icon={Download}
                        className="flex-1"
                        onClick={() => {
                          setShowRewardModal(false);
                          handleExportPng();
                        }}
                      >
                        Export & Claim
                      </SpaceButton>
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
