import React, { useState, useEffect } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { ColoringArtwork, StudioActiveView, SavedStudioProject } from './types';
import { useDrawingStudioEngine } from './hooks/useDrawingStudioEngine';
import { CosmicDrawingStudio } from './components/CosmicDrawingStudio';
import { TemplateGalleryView } from './components/TemplateGalleryView';
import { MyGalleryView } from './components/MyGalleryView';
import { PlateColoringView } from './components/PlateColoringView';
import { Paintbrush, BookOpen, FolderOpen, Palette } from 'lucide-react';

export const EarthDrawingScreen: React.FC = () => {
  const engine = useDrawingStudioEngine();
  const [activeView, setActiveView] = useState<StudioActiveView>('studio');
  const [activePlate, setActivePlate] = useState<ColoringArtwork | null>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          engine.undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          engine.redo();
        } else if (e.key === 's') {
          e.preventDefault();
          engine.saveProject();
        }
        return;
      }

      const key = e.key.toLowerCase();
      switch (key) {
        case 'p':
          engine.setActiveTool('pencil');
          break;
        case 'b':
          engine.setActiveTool('brush');
          break;
        case 'e':
          engine.setActiveTool('eraser');
          break;
        case 'l':
          engine.setActiveTool('line');
          break;
        case 'r':
          engine.setActiveTool('rect');
          break;
        case 'c':
          engine.setActiveTool('circle');
          break;
        case 's':
          engine.setActiveTool('polygon');
          break;
        case 'f':
          engine.setActiveTool('fill');
          break;
        case 't':
          engine.setActiveTool('text');
          break;
        case 'v':
          engine.setActiveTool('select');
          break;
        case 'h':
          engine.setActiveTool('pan');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  // Handle open template in studio
  const handleSelectStudioTemplate = (artwork: ColoringArtwork) => {
    engine.setActiveTemplate(artwork);
    engine.setProjectTitle(artwork.title);
    setActiveView('studio');
  };

  // Handle open template in coloring mode
  const handleSelectColoringPlate = (artwork: ColoringArtwork) => {
    setActivePlate(artwork);
    setActiveView('plate-coloring');
  };

  // Handle open saved project in studio
  const handleOpenProject = (project: SavedStudioProject) => {
    engine.loadProject(project);
    setActiveView('studio');
  };

  // Start fresh blank canvas
  const handleStartBlank = () => {
    engine.setActiveTemplate(null);
    engine.clearAllLayers();
    engine.setProjectTitle('Cosmic Sketch');
    setActiveView('studio');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#F1F1F0] text-[#0B0B0B] font-mono select-none">
      {/* 1. Global Master Navigation Header (Preserved) */}
      <MasterHeader />

      {/* 2. Scoped Warm Ivory Neo-Brutalist Studio Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col p-3 sm:p-5 md:p-6 pb-16 sm:pb-24 max-w-7xl w-full mx-auto">
        {/* Studio Branding & Primary Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_#0B0B0B] mb-5">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#0B0B0B] bg-[#00E5FF] flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_#0B0B0B]">
              🎨
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-sm sm:text-base font-black tracking-tight uppercase text-[#0B0B0B]"
                  style={{ fontFamily: '"Silkscreen", monospace' }}
                >
                  ORBIT ACADEMY
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#0B0B0B] text-[#F1F1F0] font-mono text-[9px] font-bold">
                  STUDIO
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#555555] uppercase tracking-wider">
                COSMIC CREATIVE STUDIO // NUDGE ART ENGINE
              </span>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveView('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-xs font-black uppercase transition-all ${
                activeView === 'studio'
                  ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] shadow-[2px_2px_0px_#9A9A9A]'
                  : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:bg-[#FFFFFF]'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>STUDIO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-xs font-black uppercase transition-all ${
                activeView === 'templates'
                  ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] shadow-[2px_2px_0px_#9A9A9A]'
                  : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:bg-[#FFFFFF]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>TEMPLATES</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-xs font-black uppercase transition-all ${
                activeView === 'gallery'
                  ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] shadow-[2px_2px_0px_#9A9A9A]'
                  : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:bg-[#FFFFFF]'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>MY GALLERY ({engine.savedProjects.length})</span>
            </button>

            {activeView === 'plate-coloring' && (
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-xs font-black uppercase bg-[#00E5FF] text-[#0B0B0B] border-[#0B0B0B] shadow-[2px_2px_0px_#0B0B0B]"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>COLORING PLATE</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. ACTIVE VIEW CONTAINER */}
        <main className="w-full">
          {activeView === 'studio' && (
            <CosmicDrawingStudio
              engine={engine}
              onOpenTemplateLibrary={() => setActiveView('templates')}
              onOpenGallery={() => setActiveView('gallery')}
            />
          )}

          {activeView === 'templates' && (
            <TemplateGalleryView
              onSelectStudioTemplate={handleSelectStudioTemplate}
              onSelectColoringPlate={handleSelectColoringPlate}
              onStartBlankCanvas={handleStartBlank}
            />
          )}

          {activeView === 'gallery' && (
            <MyGalleryView
              savedProjects={engine.savedProjects}
              onOpenProject={handleOpenProject}
              onDeleteProject={engine.deleteSavedProject}
              onStartBlank={handleStartBlank}
            />
          )}

          {activeView === 'plate-coloring' && activePlate && (
            <PlateColoringView
              artwork={activePlate}
              onBackToGallery={() => setActiveView('templates')}
              onOpenInStudio={handleSelectStudioTemplate}
            />
          )}
        </main>
      </div>
    </div>
  );
};
