import React from 'react';
import { DrawingStudioEngine } from '../hooks/useDrawingStudioEngine';
import { StudioTopToolbar } from './StudioTopToolbar';
import { StudioLeftToolbar } from './StudioLeftToolbar';
import { StudioCanvas } from './StudioCanvas';
import { StudioRightPanel } from './StudioRightPanel';
import { CosmoCompanion } from './CosmoCompanion';

interface CosmicDrawingStudioProps {
  engine: DrawingStudioEngine;
  onOpenTemplateLibrary: () => void;
  onOpenGallery?: () => void;
}

export const CosmicDrawingStudio: React.FC<CosmicDrawingStudioProps> = ({
  engine,
  onOpenTemplateLibrary,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in select-none">
      {/* 1. TOP TOOLBAR */}
      <StudioTopToolbar
        projectTitle={engine.projectTitle}
        onUpdateTitle={engine.setProjectTitle}
        canUndo={engine.canUndo}
        canRedo={engine.canRedo}
        onUndo={engine.undo}
        onRedo={engine.redo}
        onClear={engine.clearActiveLayer}
        brushSize={engine.brushSize}
        onChangeBrushSize={engine.setBrushSize}
        brushOpacity={engine.brushOpacity}
        onChangeBrushOpacity={engine.setBrushOpacity}
        color={engine.color}
        onChangeColor={engine.setColor}
        dimensionPreset={engine.dimensionPreset}
        onChangeDimensions={engine.setDimensionPreset}
        gridType={engine.gridType}
        onChangeGridType={engine.setGridType}
        backdropType={engine.backdropType}
        onChangeBackdropType={engine.setBackdropType}
        onSave={engine.saveProject}
        onExport={engine.exportPng}
        zoomLevel={engine.zoomLevel}
        onZoomIn={engine.zoomIn}
        onZoomOut={engine.zoomOut}
        onFitToScreen={engine.fitToScreen}
      />

      {/* 2. MAIN CREATIVE WORKSPACE (LEFT TOOLBAR + CENTRAL CANVAS + RIGHT PANEL) */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full min-h-[620px]">
        {/* Left Toolbar */}
        <StudioLeftToolbar
          activeTool={engine.activeTool}
          onSelectTool={engine.setActiveTool}
        />

        {/* Central Multi-Layer Canvas */}
        <StudioCanvas engine={engine} />

        {/* Right Inspector & Layer Panel */}
        <StudioRightPanel
          layers={engine.layers}
          activeLayerId={engine.activeLayerId}
          onSelectLayer={engine.setActiveLayerId}
          onAddLayer={engine.addLayer}
          onDeleteLayer={engine.deleteLayer}
          onToggleVisibility={engine.toggleLayerVisibility}
          onToggleLock={engine.toggleLayerLock}
          onChangeOpacity={engine.setLayerOpacity}
          onMoveLayer={engine.moveLayer}
          color={engine.color}
          onChangeColor={engine.setColor}
          recentColors={engine.recentColors}
          strokeStyle={engine.strokeStyle}
          onChangeStrokeStyle={engine.setStrokeStyle}
          blendMode={engine.blendMode}
          onChangeBlendMode={engine.setBlendMode}
          isFilledShape={engine.isFilledShape}
          onToggleFilledShape={engine.setIsFilledShape}
          activeTemplate={engine.activeTemplate}
          templateOpacity={engine.templateOpacity}
          onChangeTemplateOpacity={engine.setTemplateOpacity}
          onClearTemplate={() => engine.setActiveTemplate(null)}
          onOpenTemplateLibrary={onOpenTemplateLibrary}
        />
      </div>

      {/* 3. COSMO COMPANION HUD (BOTTOM SECTION) */}
      <div className="w-full mt-2">
        <CosmoCompanion activeTool={engine.activeTool} />
      </div>
    </div>
  );
};
