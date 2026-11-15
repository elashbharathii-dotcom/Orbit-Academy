import React, { useState } from 'react';
import { Camera, Maximize2, Minimize2 } from 'lucide-react';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { QuizQuestion } from '../types';

interface ImageIdRendererProps {
  question?: QuizQuestion;
  imageUrl?: string;
  imageCaption?: string;
  imageSensor?: string;
  options?: string[];
  selectedOption: number | null;
  correctIndex?: number;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const ImageIdRenderer: React.FC<ImageIdRendererProps> = ({
  question,
  imageUrl,
  imageCaption,
  imageSensor,
  options,
  selectedOption,
  correctIndex,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const effectiveImageUrl = imageUrl || question?.imageUrl || 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80';
  const effectiveCaption = imageCaption || question?.imageCaption || 'Official NASA Planetary Observation';
  const effectiveSensor = imageSensor || question?.imageSensor || 'High Resolution Imaging Science Experiment (HiRISE)';
  const effectiveOptions = options || question?.options || [];
  const effectiveCorrectIndex = correctIndex ?? question?.correctIndex ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Image Viewer Container */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#070C1B]/80 group shadow-2xl">
        <div className="relative w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={effectiveImageUrl}
            alt={effectiveCaption}
            className={`w-full object-cover transition-all duration-300 ${
              isExpanded ? 'max-h-[500px]' : 'h-64 sm:h-72'
            }`}
          />

          {/* Sensor Watermark Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] text-cyan-300">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>SENSOR: {effectiveSensor}</span>
          </div>

          {/* Expand/Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            title={isExpanded ? 'Minimize Viewport' : 'Expand Viewport'}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Caption Bar */}
        {effectiveCaption && (
          <div className="p-3 bg-[#0B1226]/90 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-300">
            <span className="truncate">{effectiveCaption}</span>
            <span className="text-[10px] text-slate-400 shrink-0 ml-2">NASA PDS RAW</span>
          </div>
        )}
      </div>

      {/* Multiple Choice Identification Options */}
      <MultipleChoiceRenderer
        options={effectiveOptions}
        selectedOption={selectedOption}
        correctIndex={effectiveCorrectIndex}
        isSubmitted={isSubmitted}
        onSelectOption={onSelectOption}
        disabled={disabled}
      />
    </div>
  );
};
