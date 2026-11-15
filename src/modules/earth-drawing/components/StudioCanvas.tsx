import React, { useRef, useCallback } from 'react';
import { DrawingStudioEngine } from '../hooks/useDrawingStudioEngine';

interface StudioCanvasProps {
  engine: DrawingStudioEngine;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({ engine }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    dimensions,
    gridType,
    backdropType,
    activeTool,
    color,
    brushSize,
    brushOpacity,
    strokeStyle,
    blendMode,
    isFilledShape,
    layers,
    activeLayerId,
    layerCanvasesRef,
    previewCanvasRef,
    activeTemplate,
    templateOpacity,
    zoomLevel,
    panOffset,
    setPanOffset,
    isPanning,
    setIsPanning,
    panStartRef,
    setCursorPos,
    captureUndoState,
    floodFill,
    stampText,
    isDrawingRef,
    startPointRef,
    lastPointRef,
  } = engine;

  // Transform screen client coordinates into canvas coordinate space
  const getCanvasCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const container = containerRef.current;
      if (!container) return null;
      const rect = container.getBoundingClientRect();

      // Screen offset from container center
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;

      // Invert pan and zoom
      // The canvas center is at rect.width / 2 + panOffset.x, rect.height / 2 + panOffset.y
      const centerX = rect.width / 2 + panOffset.x;
      const centerY = rect.height / 2 + panOffset.y;

      const canvasLeft = centerX - (dimensions.width * zoomLevel) / 2;
      const canvasTop = centerY - (dimensions.height * zoomLevel) / 2;

      const rawX = (screenX - canvasLeft) / zoomLevel;
      const rawY = (screenY - canvasTop) / zoomLevel;

      return {
        x: Math.round(rawX),
        y: Math.round(rawY),
      };
    },
    [dimensions, zoomLevel, panOffset]
  );

  // Apply stroke parameters to 2D context
  const applyStrokeSettings = useCallback(
    (ctx: CanvasRenderingContext2D, isEraser = false) => {
      ctx.globalAlpha = brushOpacity;
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : blendMode;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (strokeStyle === 'dashed') {
        ctx.setLineDash([brushSize * 2, brushSize * 1.5]);
      } else {
        ctx.setLineDash([]);
      }

      if (strokeStyle === 'glow' && !isEraser) {
        ctx.shadowColor = color;
        ctx.shadowBlur = brushSize * 1.8;
      } else {
        ctx.shadowBlur = 0;
      }
    },
    [brushOpacity, blendMode, color, brushSize, strokeStyle]
  );

  // Draw 5-pointed cosmic star shape
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    if (isFilledShape) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Pan tool or middle mouse button triggers panning
    if (activeTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      return;
    }

    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    // Check bounds
    if (
      coords.x < 0 ||
      coords.x > dimensions.width ||
      coords.y < 0 ||
      coords.y > dimensions.height
    ) {
      return;
    }

    const activeLayer = layers.find((l) => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked || !activeLayer.visible) {
      return; // Cannot draw on locked or hidden layer
    }

    const activeCanvas = layerCanvasesRef.current.get(activeLayerId);
    if (!activeCanvas) return;
    const ctx = activeCanvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === 'fill') {
      floodFill(coords.x, coords.y, color);
      return;
    }

    if (activeTool === 'text') {
      stampText(coords.x, coords.y);
      return;
    }

    // Capture undo snapshot before drawing
    captureUndoState();

    isDrawingRef.current = true;
    startPointRef.current = coords;
    lastPointRef.current = coords;

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      applyStrokeSettings(ctx, activeTool === 'eraser');
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x + 0.1, coords.y + 0.1);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Update cursor readout
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setCursorPos(coords);
    }

    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    if (!isDrawingRef.current || !coords) return;

    const activeCanvas = layerCanvasesRef.current.get(activeLayerId);
    const previewCanvas = previewCanvasRef.current;
    if (!activeCanvas || !previewCanvas) return;

    const ctx = activeCanvas.getContext('2d');
    const pCtx = previewCanvas.getContext('2d');
    if (!ctx || !pCtx) return;

    // 1. Freehand Brush, Pencil, Eraser directly on active canvas
    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      applyStrokeSettings(ctx, activeTool === 'eraser');
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      lastPointRef.current = coords;
      return;
    }

    // 2. Rubber-banding shapes drawn to Preview Canvas
    pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    applyStrokeSettings(pCtx);

    const startX = startPointRef.current.x;
    const startY = startPointRef.current.y;
    const currentX = coords.x;
    const currentY = coords.y;

    if (activeTool === 'line') {
      pCtx.beginPath();
      pCtx.moveTo(startX, startY);
      pCtx.lineTo(currentX, currentY);
      pCtx.stroke();
    } else if (activeTool === 'rect') {
      const w = currentX - startX;
      const h = currentY - startY;
      if (isFilledShape) {
        pCtx.fillRect(startX, startY, w, h);
      } else {
        pCtx.strokeRect(startX, startY, w, h);
      }
    } else if (activeTool === 'circle') {
      const rx = Math.abs(currentX - startX) / 2;
      const ry = Math.abs(currentY - startY) / 2;
      const cx = Math.min(startX, currentX) + rx;
      const cy = Math.min(startY, currentY) + ry;
      pCtx.beginPath();
      pCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (isFilledShape) {
        pCtx.fill();
      } else {
        pCtx.stroke();
      }
    } else if (activeTool === 'polygon') {
      const dist = Math.hypot(currentX - startX, currentY - startY);
      drawStar(pCtx, startX, startY, 5, dist, dist * 0.45);
    }
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const previewCanvas = previewCanvasRef.current;
    const activeCanvas = layerCanvasesRef.current.get(activeLayerId);
    if (!previewCanvas || !activeCanvas) return;

    const ctx = activeCanvas.getContext('2d');
    const pCtx = previewCanvas.getContext('2d');
    if (!ctx || !pCtx) return;

    // Commit preview canvas content to active layer canvas
    if (
      activeTool === 'line' ||
      activeTool === 'rect' ||
      activeTool === 'circle' ||
      activeTool === 'polygon'
    ) {
      ctx.save();
      ctx.globalAlpha = brushOpacity;
      ctx.globalCompositeOperation = blendMode;
      ctx.drawImage(previewCanvas, 0, 0);
      ctx.restore();
      pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      engine.setZoomLevel((z: number) => Math.max(0.3, Math.min(4.0, parseFloat((z + delta).toFixed(2)))));
    } else {
      // Pan
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className={`relative flex-1 w-full min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] bg-[#E2E2E0] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_#0B0B0B] overflow-hidden select-none flex items-center justify-center ${
        isPanning ? 'cursor-grabbing' : activeTool === 'pan' ? 'cursor-grab' : 'cursor-crosshair'
      }`}
    >
      {/* Background Halftone / Technical Coordinate Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(#0B0B0B 1px, transparent 1px), radial-gradient(#0B0B0B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Transformable Canvas Workspace Viewport */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        className="relative flex-none border-2 border-[#0B0B0B] shadow-[10px_10px_0px_#0B0B0B] transition-shadow"
      >
        {/* Layer 0: Backdrop Color / Transparent Checkerboard */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor:
              backdropType === 'ivory'
                ? '#F1F1F0'
                : backdropType === 'white'
                ? '#FFFFFF'
                : 'transparent',
            backgroundImage:
              backdropType === 'transparent'
                ? 'conic-gradient(#E2E2E0 25%, #FFFFFF 0 50%, #E2E2E0 0 75%, #FFFFFF 0)'
                : undefined,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Layer 0.5: Optional Space-Art Trace Template Underlay */}
        {activeTemplate && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 overflow-hidden"
            style={{ opacity: templateOpacity }}
          >
            <svg
              viewBox={activeTemplate.viewBox}
              className="w-full h-full object-contain filter grayscale contrast-150"
            >
              {activeTemplate.regions.map((region) => (
                <path
                  key={region.id}
                  d={region.path}
                  fill="none"
                  stroke="#0B0B0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Stack of User Drawing Layers */}
        {layers.map((layer) => (
          <canvas
            key={layer.id}
            ref={(el) => {
              if (el) {
                layerCanvasesRef.current.set(layer.id, el);
              } else {
                layerCanvasesRef.current.delete(layer.id);
              }
            }}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              opacity: layer.opacity,
              display: layer.visible ? 'block' : 'none',
            }}
            className="absolute inset-0 pointer-events-none"
          />
        ))}

        {/* Topmost Shape Preview Canvas */}
        <canvas
          ref={previewCanvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Optional Technical Space Coordinate Grid Overlay */}
        {gridType === 'space-grid' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0B0B0B 1px, transparent 1px), linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}
        {gridType === 'pixel' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0B0B0B 1px, transparent 1px), linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        )}
      </div>

      {/* Floating Canvas Footer Telemetry (Coordinates & Ratio) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-[#FFFFFF] border-2 border-[#0B0B0B] font-mono text-[10px] font-bold text-[#0B0B0B] shadow-[2px_2px_0px_#0B0B0B] pointer-events-none">
        <span>
          X: {engine.cursorPos.x}px | Y: {engine.cursorPos.y}px
        </span>
        <span className="text-[#9A9A9A]">|</span>
        <span className="uppercase">{dimensions.label}</span>
      </div>
    </div>
  );
};
