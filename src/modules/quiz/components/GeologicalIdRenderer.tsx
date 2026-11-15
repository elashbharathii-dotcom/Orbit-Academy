import React from 'react';
import { Mountain, Compass } from 'lucide-react';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { QuizQuestion } from '../types';

interface GeologicalIdRendererProps {
  question?: QuizQuestion;
  featureName?: string;
  classification?: string;
  targetCelestialId?: string;
  options?: string[];
  selectedOption: number | null;
  correctIndex?: number;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const GeologicalIdRenderer: React.FC<GeologicalIdRendererProps> = ({
  question,
  featureName,
  classification,
  targetCelestialId,
  options,
  selectedOption,
  correctIndex,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  const effectiveFeatureName = featureName || question?.geologicalFeatureName || 'Geological Landmark';
  const effectiveClassification = classification || question?.geologicalClassification || 'Extraterrestrial Geomorphological Formation';
  const effectiveCelestialId = targetCelestialId || question?.targetCelestialId || question?.destinationId || 'MARS';
  const effectiveOptions = options || question?.options || [];
  const effectiveCorrectIndex = correctIndex ?? question?.correctIndex ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Geological Classification Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0B1528] to-[#070C1B] border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Mountain className="w-5 h-5 text-amber-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                NASA ASTROGEOLOGY CLASSIFICATION
              </span>
              {effectiveCelestialId && (
                <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  BODY: {effectiveCelestialId.toUpperCase()}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {effectiveClassification}
            </h4>
          </div>
        </div>

        {effectiveFeatureName && (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Landmark: {effectiveFeatureName}</span>
          </div>
        )}
      </div>

      {/* Answer Options */}
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
