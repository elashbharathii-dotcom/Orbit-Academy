import { useState, useEffect, useRef, useCallback } from 'react';
import { ColoringArtwork, ColoringHistoryStep } from '../types';
import { NUMBERED_COLOR_PALETTE } from '../coloringData';

export interface UseColoringEngineReturn {
  filledRegions: Record<string, string>;
  activeColor: string;
  setActiveColor: (color: string) => void;
  recentColors: string[];
  activeTool: 'fill' | 'eraser';
  setActiveTool: (tool: 'fill' | 'eraser') => void;
  undoStack: ColoringHistoryStep[];
  redoStack: ColoringHistoryStep[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  resetArtwork: () => void;
  handleRegionClick: (regionId: string) => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  handleMouseDownPan: (e: React.MouseEvent) => void;
  handleMouseMovePan: (e: React.MouseEvent) => void;
  handleMouseUpPan: () => void;
  handleTouchStartPan: (e: React.TouchEvent) => void;
  handleTouchMovePan: (e: React.TouchEvent) => void;
  handleTouchEndPan: () => void;
  downloadPng: () => void;
  printArtwork: (uncolored?: boolean) => void;
  isComplete: boolean;
  progressPercent: number;
  showNumberHints: boolean;
  setShowNumberHints: (show: boolean | ((prev: boolean) => boolean)) => void;
  toggleNumberHints: () => void;
  hoveredSuggestionNumber: number | null;
  setHoveredSuggestionNumber: (num: number | null) => void;
  applySuggestedColor: (number: number) => void;
}

const STORAGE_PREFIX = 'orbit_coloring_progress_';

export function useColoringEngine(artwork: ColoringArtwork | null): UseColoringEngineReturn {
  const [filledRegions, setFilledRegions] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState<string>('#38BDF8');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#EF4444',
    '#F59E0B',
    '#FBBF24',
    '#10B981',
    '#38BDF8',
    '#3B82F6',
    '#A855F7',
    '#FFFFFF',
  ]);
  const [activeTool, setActiveTool] = useState<'fill' | 'eraser'>('fill');
  const [undoStack, setUndoStack] = useState<ColoringHistoryStep[]>([]);
  const [redoStack, setRedoStack] = useState<ColoringHistoryStep[]>([]);

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Color by Number & Number Hints
  const [showNumberHints, setShowNumberHints] = useState<boolean>(true);
  const [hoveredSuggestionNumber, setHoveredSuggestionNumber] = useState<number | null>(null);

  const toggleNumberHints = useCallback(() => {
    setShowNumberHints((prev) => !prev);
  }, []);

  const applySuggestedColor = useCallback((num: number) => {
    const sug = NUMBERED_COLOR_PALETTE.find((s) => s.number === num);
    if (sug) {
      setActiveColor(sug.hex);
      setActiveTool('fill');
    }
  }, []);

  // Load saved state from localStorage whenever artwork changes
  useEffect(() => {
    if (!artwork) {
      setFilledRegions({});
      setUndoStack([]);
      setRedoStack([]);
      setZoomLevel(1.0);
      setPanOffset({ x: 0, y: 0 });
      return;
    }

    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${artwork.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          setFilledRegions(parsed);
        } else {
          setFilledRegions({});
        }
      } else {
        setFilledRegions({});
      }
    } catch (e) {
      console.warn('Could not read saved coloring progress:', e);
      setFilledRegions({});
    }

    setUndoStack([]);
    setRedoStack([]);
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setActiveTool('fill');
  }, [artwork?.id]);

  // Persist to localStorage whenever filledRegions changes
  const saveToStorage = useCallback(
    (newRegions: Record<string, string>) => {
      if (!artwork) return;
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${artwork.id}`, JSON.stringify(newRegions));
      } catch (e) {
        console.warn('Could not save coloring progress:', e);
      }
    },
    [artwork?.id]
  );

  // Region click handler (fill or erase)
  const handleRegionClick = useCallback(
    (regionId: string) => {
      if (!artwork) return;

      const previousColor = filledRegions[regionId] || '#FFFFFF';
      const targetColor = activeTool === 'eraser' ? '#FFFFFF' : activeColor;

      // Don't record a no-op action
      if (previousColor.toLowerCase() === targetColor.toLowerCase()) {
        return;
      }

      const step: ColoringHistoryStep = {
        regionId,
        previousColor,
        newColor: targetColor,
      };

      const updated = { ...filledRegions, [regionId]: targetColor };
      setFilledRegions(updated);
      setUndoStack((prev) => [...prev, step]);
      setRedoStack([]);
      saveToStorage(updated);

      // Track recent colors if using fill tool and not white/black
      if (activeTool === 'fill') {
        setRecentColors((prev) => {
          const filtered = prev.filter((c) => c.toLowerCase() !== targetColor.toLowerCase());
          return [targetColor, ...filtered].slice(0, 10);
        });
      }
    },
    [artwork, filledRegions, activeTool, activeColor, saveToStorage]
  );

  // Undo
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastStep = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastStep]);

    setFilledRegions((prev) => {
      const updated = { ...prev, [lastStep.regionId]: lastStep.previousColor };
      saveToStorage(updated);
      return updated;
    });
  }, [undoStack, saveToStorage]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextStep = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, nextStep]);

    setFilledRegions((prev) => {
      const updated = { ...prev, [nextStep.regionId]: nextStep.newColor };
      saveToStorage(updated);
      return updated;
    });
  }, [redoStack, saveToStorage]);

  // Reset Artwork
  const resetArtwork = useCallback(() => {
    if (!artwork) return;
    if (window.confirm('Reset this coloring artwork back to clean white outlines?')) {
      setFilledRegions({});
      setUndoStack([]);
      setRedoStack([]);
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${artwork.id}`);
      } catch (e) {
        console.warn('Could not reset coloring progress:', e);
      }
    }
  }, [artwork]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((z) => Math.max(0.6, Math.round((z - 0.25) * 100) / 100));
  }, []);

  const fitToScreen = useCallback(() => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Pan handlers for Mouse
  const handleMouseDownPan = useCallback(
    (e: React.MouseEvent) => {
      // Only drag if left click and clicking background or with spacebar / zoomed in
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      // If clicking directly on an SVG path, allow region fill instead of drag
      if (target.tagName.toLowerCase() === 'path') return;

      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      };
    },
    [panOffset]
  );

  const handleMouseMovePan = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    },
    [isPanning]
  );

  const handleMouseUpPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Pan handlers for Touch
  const handleTouchStartPan = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'path') return;

        setIsPanning(true);
        panStartRef.current = {
          x: e.touches[0].clientX - panOffset.x,
          y: e.touches[0].clientY - panOffset.y,
        };
      }
    },
    [panOffset]
  );

  const handleTouchMovePan = useCallback(
    (e: React.TouchEvent) => {
      if (!isPanning || e.touches.length !== 1) return;
      setPanOffset({
        x: e.touches[0].clientX - panStartRef.current.x,
        y: e.touches[0].clientY - panStartRef.current.y,
      });
    },
    [isPanning]
  );

  const handleTouchEndPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  // High-Resolution PNG Download
  const downloadPng = useCallback(() => {
    if (!artwork) return;
    const svgElement = document.getElementById('coloring-svg-canvas');
    if (!svgElement) return;

    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    // Strip number hint overlay before exporting to clean PNG
    const hintOverlay = svgClone.querySelector('.number-hint-overlay');
    if (hintOverlay) {
      hintOverlay.remove();
    }
    // Ensure width and height attributes exist on clone for canvas rendering
    svgClone.setAttribute('width', '1200');
    svgClone.setAttribute('height', '900');

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 960;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clean paper white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw SVG artwork centered
      ctx.drawImage(image, 50, 40, 1100, 825);

      // Academic Footer Watermark
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px Exo, sans-serif';
      ctx.fillText(`ORBIT ACADEMY // PLANET PAINTER // ${artwork.title.toUpperCase()}`, 50, 915);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillText(`Planet Painter: Space & Astronomy Coloring Studio • Verified Academic Artwork`, 50, 938);

      const a = document.createElement('a');
      a.download = `Orbit-Academy-${artwork.id}-${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  }, [artwork]);

  // Clean A4 Print Layout
  const printArtwork = useCallback(
    (uncolored: boolean = false) => {
      if (!artwork) return;

      // Generate printable HTML document in an iframe or popup
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print your coloring page.');
        return;
      }

      const underlayHtml = artwork.underlaySvg ? `<g class="underlay">${artwork.underlaySvg}</g>` : '';
      const overlayHtml = artwork.overlaySvg ? `<g class="overlay">${artwork.overlaySvg}</g>` : '';

      const pathsHtml = artwork.regions
        .map((r) => {
          const fill = uncolored ? '#FFFFFF' : filledRegions[r.id] || '#FFFFFF';
          return `<path d="${r.path}" fill="${fill}" stroke="#000000" stroke-width="2.5" />`;
        })
        .join('\n');

      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${artwork.title} — Orbit Academy Coloring Page</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 12mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #000;
              background: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 100vh;
              box-sizing: border-box;
            }
            .header {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
            }
            .title {
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 11px;
              color: #555;
            }
            .canvas-container {
              width: 100%;
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px 0;
            }
            svg {
              max-width: 95%;
              max-height: 82vh;
              width: 100%;
              height: auto;
            }
            .footer {
              width: 100%;
              border-top: 1px dashed #666;
              padding-top: 6px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #444;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">${artwork.title}</div>
              <div class="subtitle">Orbit Academy — Planet Painter Studio (${artwork.learningTopic})</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <span>Name: ______________________</span><br>
              <span style="font-size: 9px; color: #777;">Date: ${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div class="canvas-container">
            <svg viewBox="${artwork.viewBox}">
              ${underlayHtml}
              ${pathsHtml}
              ${overlayHtml}
            </svg>
          </div>

          <div class="footer">
            <div><strong>ASTROPHYSICS FACT:</strong> ${artwork.educationalFact}</div>
            <div>www.orbitacademy.space</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    },
    [artwork, filledRegions]
  );

  // Completion calculation
  const totalRegions = artwork?.regions.length || 0;
  const coloredCount = artwork
    ? artwork.regions.filter((r) => Boolean(filledRegions[r.id]) && filledRegions[r.id] !== '#FFFFFF')
        .length
    : 0;
  const progressPercent = totalRegions > 0 ? Math.round((coloredCount / totalRegions) * 100) : 0;
  const isComplete = totalRegions > 0 && coloredCount === totalRegions;

  return {
    filledRegions,
    activeColor,
    setActiveColor,
    recentColors,
    activeTool,
    setActiveTool,
    undoStack,
    redoStack,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undo,
    redo,
    resetArtwork,
    handleRegionClick,
    zoomLevel,
    zoomIn,
    zoomOut,
    fitToScreen,
    panOffset,
    isPanning,
    handleMouseDownPan,
    handleMouseMovePan,
    handleMouseUpPan,
    handleTouchStartPan,
    handleTouchMovePan,
    handleTouchEndPan,
    downloadPng,
    printArtwork,
    isComplete,
    progressPercent,
    showNumberHints,
    setShowNumberHints,
    toggleNumberHints,
    hoveredSuggestionNumber,
    setHoveredSuggestionNumber,
    applySuggestedColor,
  };
}
