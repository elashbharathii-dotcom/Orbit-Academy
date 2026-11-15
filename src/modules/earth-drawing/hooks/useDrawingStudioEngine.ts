import { useState, useRef, useCallback, useEffect } from 'react';
import {
  StudioTool,
  StrokeStyle,
  StudioBlendMode,
  CanvasDimensionPreset,
  CanvasDimensions,
  CanvasGridType,
  CanvasBackdropType,
  StudioLayer,
  SavedStudioProject,
  ColoringArtwork,
} from '../types';

export const CANVAS_PRESETS: Record<CanvasDimensionPreset, CanvasDimensions> = {
  widescreen: { preset: 'widescreen', width: 960, height: 600, label: '16:10 Widescreen (960×600)' },
  square: { preset: 'square', width: 720, height: 720, label: '1:1 Square (720×720)' },
  standard: { preset: 'standard', width: 800, height: 600, label: '4:3 Standard (800×600)' },
  portrait: { preset: 'portrait', width: 600, height: 800, label: '3:4 Portrait (600×800)' },
};

const STORAGE_SAVED_PROJECTS_KEY = 'orbit_cosmic_studio_projects_v1';

export function useDrawingStudioEngine() {
  // Canvas dimensions
  const [dimensionPreset, setDimensionPreset] = useState<CanvasDimensionPreset>('widescreen');
  const dimensions = CANVAS_PRESETS[dimensionPreset];

  // Grid & Backdrop
  const [gridType, setGridType] = useState<CanvasGridType>('space-grid');
  const [backdropType, setBackdropType] = useState<CanvasBackdropType>('ivory');

  // Active Tool & Parameters
  const [activeTool, setActiveTool] = useState<StudioTool>('brush');
  const [color, setColor] = useState<string>('#0B0B0B');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#0B0B0B',
    '#00E5FF',
    '#0070F3',
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#A855F7',
    '#FFFFFF',
  ]);
  const [brushSize, setBrushSize] = useState<number>(6);
  const [brushOpacity, setBrushOpacity] = useState<number>(1.0);
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>('solid');
  const [blendMode, setBlendMode] = useState<StudioBlendMode>('source-over');
  const [isFilledShape, setIsFilledShape] = useState<boolean>(false);

  // Layers State
  const [layers, setLayers] = useState<StudioLayer[]>([
    { id: 'layer-1', name: 'Background Layer', visible: true, locked: false, opacity: 1 },
    { id: 'layer-2', name: 'Drawing Layer', visible: true, locked: false, opacity: 1 },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-2');

  // Layer canvas refs mapping: layerId -> HTMLCanvasElement
  const layerCanvasesRef = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Template Underlay (Optional space sketch or coloring outline)
  const [activeTemplate, setActiveTemplate] = useState<ColoringArtwork | null>(null);
  const [templateOpacity, setTemplateOpacity] = useState<number>(0.35);

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse Coordinates on Canvas
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // History Stacks (Undo / Redo)
  const [undoStack, setUndoStack] = useState<{ layerId: string; dataUrl: string }[]>([]);
  const [redoStack, setRedoStack] = useState<{ layerId: string; dataUrl: string }[]>([]);

  // Drawing state refs
  const isDrawingRef = useRef<boolean>(false);
  const startPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Saved Projects List
  const [savedProjects, setSavedProjects] = useState<SavedStudioProject[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>('Cosmic Mission');

  // Load saved projects on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_PROJECTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedProjects(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save recent color
  const pushRecentColor = useCallback((newColor: string) => {
    setColor(newColor);
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== newColor.toLowerCase());
      return [newColor, ...filtered].slice(0, 10);
    });
  }, []);

  // Save current active layer canvas state to undo stack
  const captureUndoState = useCallback(() => {
    const canvas = layerCanvasesRef.current.get(activeLayerId);
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setUndoStack((prev) => [...prev.slice(-25), { layerId: activeLayerId, dataUrl }]);
    setRedoStack([]); // clear redo on new action
  }, [activeLayerId]);

  // Undo
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastStep = undoStack[undoStack.length - 1];
    const targetCanvas = layerCanvasesRef.current.get(lastStep.layerId);
    if (!targetCanvas) return;

    // Capture current for redo
    const currentDataUrl = targetCanvas.toDataURL();
    setRedoStack((prev) => [...prev, { layerId: lastStep.layerId, dataUrl: currentDataUrl }]);

    // Pop undo
    setUndoStack((prev) => prev.slice(0, -1));

    // Restore previous state
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastStep.dataUrl;
  }, [undoStack]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextStep = redoStack[redoStack.length - 1];
    const targetCanvas = layerCanvasesRef.current.get(nextStep.layerId);
    if (!targetCanvas) return;

    // Capture current for undo
    const currentDataUrl = targetCanvas.toDataURL();
    setUndoStack((prev) => [...prev, { layerId: nextStep.layerId, dataUrl: currentDataUrl }]);

    // Pop redo
    setRedoStack((prev) => prev.slice(0, -1));

    // Restore redo state
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = nextStep.dataUrl;
  }, [redoStack]);

  // Layer Management
  const addLayer = useCallback(() => {
    const newId = `layer-${Date.now()}`;
    const newName = `Layer ${layers.length + 1}`;
    setLayers((prev) => [...prev, { id: newId, name: newName, visible: true, locked: false, opacity: 1 }]);
    setActiveLayerId(newId);
  }, [layers.length]);

  const deleteLayer = useCallback(
    (layerId: string) => {
      if (layers.length <= 1) return; // Keep at least one layer
      setLayers((prev) => prev.filter((l) => l.id !== layerId));
      layerCanvasesRef.current.delete(layerId);
      if (activeLayerId === layerId) {
        const remaining = layers.filter((l) => l.id !== layerId);
        setActiveLayerId(remaining[remaining.length - 1].id);
      }
    },
    [layers, activeLayerId]
  );

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l))
    );
  }, []);

  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, opacity: Math.max(0, Math.min(1, opacity)) } : l))
    );
  }, []);

  const moveLayer = useCallback((layerId: string, direction: 'up' | 'down') => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === layerId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  }, []);

  // Zoom and Pan Handlers
  const zoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(4.0, parseFloat((z + 0.15).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((z) => Math.max(0.3, parseFloat((z - 0.15).toFixed(2))));
  }, []);

  const fitToScreen = useCallback(() => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Flood Fill Algorithm (fill tool)
  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: string) => {
      const canvas = layerCanvasesRef.current.get(activeLayerId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      captureUndoState();

      const width = canvas.width;
      const height = canvas.height;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Parse target color from start coordinates
      const startPos = (startY * width + startX) * 4;
      const startR = data[startPos];
      const startG = data[startPos + 1];
      const startB = data[startPos + 2];
      const startA = data[startPos + 3];

      // Parse replacement color
      const dummyDiv = document.createElement('div');
      dummyDiv.style.color = fillColor;
      document.body.appendChild(dummyDiv);
      const compColor = getComputedStyle(dummyDiv).color;
      document.body.removeChild(dummyDiv);
      const rgbMatch = compColor.match(/\d+/g);
      if (!rgbMatch) return;
      const fillR = parseInt(rgbMatch[0], 10);
      const fillG = parseInt(rgbMatch[1], 10);
      const fillB = parseInt(rgbMatch[2], 10);
      const fillA = Math.round(brushOpacity * 255);

      if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) {
        return; // Already target color
      }

      const colorMatch = (pos: number) => {
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        const a = data[pos + 3];
        // Allow slight tolerance
        return (
          Math.abs(r - startR) < 28 &&
          Math.abs(g - startG) < 28 &&
          Math.abs(b - startB) < 28 &&
          Math.abs(a - startA) < 28
        );
      };

      const queue: [number, number][] = [[startX, startY]];
      const visited = new Uint8Array(width * height);

      while (queue.length > 0) {
        const [x, y] = queue.pop()!;
        const index = y * width + x;
        if (visited[index]) continue;
        visited[index] = 1;

        const pos = index * 4;
        if (!colorMatch(pos)) continue;

        data[pos] = fillR;
        data[pos + 1] = fillG;
        data[pos + 2] = fillB;
        data[pos + 3] = fillA;

        if (x > 0 && !visited[index - 1]) queue.push([x - 1, y]);
        if (x < width - 1 && !visited[index + 1]) queue.push([x + 1, y]);
        if (y > 0 && !visited[index - width]) queue.push([x, y - 1]);
        if (y < height - 1 && !visited[index + width]) queue.push([x, y + 1]);
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [activeLayerId, brushOpacity, captureUndoState]
  );

  // Clear Active Layer or Full Canvas
  const clearActiveLayer = useCallback(() => {
    const canvas = layerCanvasesRef.current.get(activeLayerId);
    if (!canvas) return;
    captureUndoState();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeLayerId, captureUndoState]);

  const clearAllLayers = useCallback(() => {
    captureUndoState();
    layerCanvasesRef.current.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }, [captureUndoState]);

  // Export to PNG (Merges visible layers)
  const exportPng = useCallback(() => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = dimensions.width;
    exportCanvas.height = dimensions.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Optional solid backdrop
    if (backdropType === 'ivory') {
      ctx.fillStyle = '#F1F1F0';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    } else if (backdropType === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // Draw visible layers in order
    layers.forEach((layer) => {
      if (!layer.visible) return;
      const layerCanvas = layerCanvasesRef.current.get(layer.id);
      if (layerCanvas) {
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layerCanvas, 0, 0);
      }
    });

    const link = document.createElement('a');
    link.download = `orbit-academy-${projectTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [dimensions, backdropType, layers, projectTitle]);

  // Save Project to LocalStorage
  const saveProject = useCallback(() => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 300;
    exportCanvas.height = Math.round((300 / dimensions.width) * dimensions.height);
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw mini composite for thumbnail
    ctx.fillStyle = backdropType === 'white' ? '#FFFFFF' : '#F1F1F0';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    layers.forEach((layer) => {
      if (!layer.visible) return;
      const layerCanvas = layerCanvasesRef.current.get(layer.id);
      if (layerCanvas) {
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layerCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
      }
    });

    const thumbnailDataUrl = exportCanvas.toDataURL('image/jpeg', 0.82);

    const layerSnapshots = layers.map((layer) => {
      const layerCanvas = layerCanvasesRef.current.get(layer.id);
      return {
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        locked: layer.locked,
        opacity: layer.opacity,
        dataUrl: layerCanvas ? layerCanvas.toDataURL() : '',
      };
    });

    const newProject: SavedStudioProject = {
      id: `project-${Date.now()}`,
      title: projectTitle || 'Untitled Cosmic Work',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      thumbnailDataUrl,
      width: dimensions.width,
      height: dimensions.height,
      layers: layerSnapshots,
      templateId: activeTemplate?.id,
    };

    setSavedProjects((prev) => {
      const filtered = prev.filter((p) => p.title !== newProject.title);
      const updated = [newProject, ...filtered];
      try {
        localStorage.setItem(STORAGE_SAVED_PROJECTS_KEY, JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });

    return newProject;
  }, [dimensions, backdropType, layers, projectTitle, activeTemplate]);

  // Load a Saved Project
  const loadProject = useCallback((project: SavedStudioProject) => {
    setProjectTitle(project.title);
    const restoredLayers: StudioLayer[] = project.layers.map((l) => ({
      id: l.id,
      name: l.name,
      visible: l.visible,
      locked: l.locked,
      opacity: l.opacity,
    }));
    setLayers(restoredLayers);
    setActiveLayerId(restoredLayers[0]?.id || 'layer-1');

    // Restore canvases after React render cycle
    setTimeout(() => {
      project.layers.forEach((l) => {
        const canvas = layerCanvasesRef.current.get(l.id);
        if (canvas && l.dataUrl) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
            };
            img.src = l.dataUrl;
          }
        }
      });
    }, 50);
  }, []);

  // Delete a Saved Project
  const deleteSavedProject = useCallback((projectId: string) => {
    setSavedProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      try {
        localStorage.setItem(STORAGE_SAVED_PROJECTS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Text stamping prompt
  const stampText = useCallback(
    (x: number, y: number, textToStamp?: string) => {
      const text = textToStamp || window.prompt('Enter Space Label / Notes:', 'ORBIT ACADEMY');
      if (!text) return;
      const canvas = layerCanvasesRef.current.get(activeLayerId);
      if (!canvas) return;
      captureUndoState();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.globalAlpha = brushOpacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${Math.max(14, brushSize * 3)}px "Silkscreen", monospace`;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    },
    [activeLayerId, brushOpacity, color, brushSize, captureUndoState]
  );

  return {
    dimensions,
    dimensionPreset,
    setDimensionPreset,
    gridType,
    setGridType,
    backdropType,
    setBackdropType,
    activeTool,
    setActiveTool,
    color,
    setColor: pushRecentColor,
    recentColors,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    strokeStyle,
    setStrokeStyle,
    blendMode,
    setBlendMode,
    isFilledShape,
    setIsFilledShape,
    layers,
    activeLayerId,
    setActiveLayerId,
    layerCanvasesRef,
    previewCanvasRef,
    activeTemplate,
    setActiveTemplate,
    templateOpacity,
    setTemplateOpacity,
    zoomLevel,
    setZoomLevel,
    zoomIn,
    zoomOut,
    fitToScreen,
    panOffset,
    setPanOffset,
    isPanning,
    setIsPanning,
    panStartRef,
    cursorPos,
    setCursorPos,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undo,
    redo,
    captureUndoState,
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerOpacity,
    moveLayer,
    floodFill,
    clearActiveLayer,
    clearAllLayers,
    exportPng,
    projectTitle,
    setProjectTitle,
    saveProject,
    savedProjects,
    loadProject,
    deleteSavedProject,
    stampText,
    isDrawingRef,
    startPointRef,
    lastPointRef,
  };
}

export type DrawingStudioEngine = ReturnType<typeof useDrawingStudioEngine>;
