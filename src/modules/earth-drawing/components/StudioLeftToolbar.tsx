import React from 'react';
import { StudioTool } from '../types';
import {
  Pencil,
  Paintbrush,
  Eraser,
  Minus,
  Square,
  Circle,
  Sparkles,
  PaintBucket,
  Type,
  MousePointer,
  Hand,
} from 'lucide-react';

interface StudioLeftToolbarProps {
  activeTool: StudioTool;
  onSelectTool: (tool: StudioTool) => void;
}

interface ToolDefinition {
  id: StudioTool;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hotkey: string;
  description: string;
}

const TOOLS: ToolDefinition[] = [
  { id: 'pencil', label: 'Pencil', icon: Pencil, hotkey: 'P', description: 'Fine crisp drafting line' },
  { id: 'brush', label: 'Brush', icon: Paintbrush, hotkey: 'B', description: 'Smooth artistic brush' },
  { id: 'eraser', label: 'Eraser', icon: Eraser, hotkey: 'E', description: 'Clean targeted eraser' },
  { id: 'line', label: 'Line', icon: Minus, hotkey: 'L', description: 'Straight trajectory line' },
  { id: 'rect', label: 'Rectangle', icon: Square, hotkey: 'R', description: 'Box & satellite chassis' },
  { id: 'circle', label: 'Circle', icon: Circle, hotkey: 'C', description: 'Planets, orbits & craters' },
  { id: 'polygon', label: 'Star / Poly', icon: Sparkles, hotkey: 'S', description: 'Cosmic stars & polygons' },
  { id: 'fill', label: 'Fill Bucket', icon: PaintBucket, hotkey: 'F', description: 'Flood fill enclosed areas' },
  { id: 'text', label: 'Text Stamp', icon: Type, hotkey: 'T', description: 'Add technical space labels' },
  { id: 'select', label: 'Select', icon: MousePointer, hotkey: 'V', description: 'Select & inspect objects' },
  { id: 'pan', label: 'Pan / Hand', icon: Hand, hotkey: 'H', description: 'Drag to navigate canvas' },
];

export const StudioLeftToolbar: React.FC<StudioLeftToolbarProps> = ({
  activeTool,
  onSelectTool,
}) => {
  return (
    <aside
      className="flex flex-row lg:flex-col items-center justify-start gap-2 p-2 bg-[#FFFFFF] border-2 border-[#0B0B0B] overflow-x-auto lg:overflow-y-auto max-w-full lg:max-w-none shadow-[4px_4px_0px_#0B0B0B]"
      aria-label="Drawing Tools"
    >
      <div className="hidden lg:flex items-center justify-between w-full pb-1 border-b-2 border-dashed border-[#9A9A9A] mb-1">
        <span
          className="font-mono text-[10px] font-black uppercase tracking-wider text-[#0B0B0B]"
          style={{ fontFamily: '"Silkscreen", monospace' }}
        >
          TOOLS
        </span>
        <span className="w-2 h-2 bg-[#0B0B0B]" />
      </div>

      <div className="flex flex-row lg:flex-col gap-1.5 w-full">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              title={`${tool.label} (${tool.hotkey}) — ${tool.description}`}
              className={`group relative flex items-center gap-2 p-2 w-10 h-10 lg:w-full lg:h-auto border-2 transition-all select-none ${
                isActive
                  ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_#9A9A9A]'
                  : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FFFFFF] shadow-[3px_3px_0px_#9A9A9A]'
              }`}
            >
              <Icon className="w-4 h-4 flex-none" />

              <span className="hidden lg:inline font-mono text-xs font-bold truncate">
                {tool.label}
              </span>

              {/* Hotkey Badge */}
              <span
                className={`hidden lg:inline-flex ml-auto text-[9px] font-mono px-1 py-0.2 border ${
                  isActive
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#070C1B]'
                    : 'border-[#0B0B0B] text-[#555555] bg-[#FFFFFF]'
                }`}
              >
                {tool.hotkey}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
