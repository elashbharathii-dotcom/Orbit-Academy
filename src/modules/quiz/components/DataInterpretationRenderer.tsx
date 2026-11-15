import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingDown, Info, CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion, ScientificDataPoint } from '../types';

interface DataInterpretationRendererProps {
  question: QuizQuestion;
  selectedOption: number | null;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const DataInterpretationRenderer: React.FC<DataInterpretationRendererProps> = ({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScientificDataPoint | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || disabled) return;
      const key = parseInt(e.key, 10);
      if (key >= 1 && key <= question.options.length) {
        e.preventDefault();
        onSelectOption(key - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, disabled, onSelectOption, question.options.length]);

  const chart = question.chartData;

  // Fallback if no chart data attached
  if (!chart || !chart.points || chart.points.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
        Scientific dataset offline. Proceeding to textual hypothesis.
      </div>
    );
  }

  const values = chart.points.map((p) => p.value);
  const minVal = Math.min(...values, chart.threshold ?? values[0]);
  const maxVal = Math.max(...values, chart.threshold ?? values[0]);
  const valRange = maxVal - minVal || 1;

  // SVG Chart Geometry
  const svgWidth = 600;
  const svgHeight = 220;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getY = (val: number) => {
    const norm = (val - minVal) / valRange;
    return padTop + (1 - norm) * chartH;
  };

  const getX = (index: number) => {
    if (chart.points.length <= 1) return padLeft + chartW / 2;
    return padLeft + (index / (chart.points.length - 1)) * chartW;
  };

  return (
    <div className="space-y-4">
      {/* Interactive Scientific Chart Container */}
      <div className="p-4 rounded-xl bg-[#070c1b]/90 border border-violet-500/30 backdrop-blur-md relative">
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-violet-500/20 text-xs font-mono">
          <div className="flex items-center gap-2 text-violet-300 font-semibold tracking-wider uppercase">
            {chart.chartType === 'transit-dip' ? (
              <TrendingDown className="w-4 h-4 text-violet-400" />
            ) : (
              <BarChart3 className="w-4 h-4 text-violet-400" />
            )}
            <span>{chart.title}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hover data points for calibration readout</span>
          </div>
        </div>

        {/* Chart SVG */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[220px] select-none"
          >
            {/* Grid lines */}
            <line
              x1={padLeft}
              y1={padTop}
              x2={svgWidth - padRight}
              y2={padTop}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeDasharray="4 4"
            />
            <line
              x1={padLeft}
              y1={padTop + chartH / 2}
              x2={svgWidth - padRight}
              y2={padTop + chartH / 2}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeDasharray="4 4"
            />
            <line
              x1={padLeft}
              y1={padTop + chartH}
              x2={svgWidth - padRight}
              y2={padTop + chartH}
              stroke="rgba(148, 163, 184, 0.3)"
            />

            {/* Threshold Reference Line */}
            {chart.threshold !== undefined && (
              <g>
                <line
                  x1={padLeft}
                  y1={getY(chart.threshold)}
                  x2={svgWidth - padRight}
                  y2={getY(chart.threshold)}
                  stroke="rgba(244, 63, 94, 0.7)"
                  strokeDasharray="6 3"
                  strokeWidth="1.5"
                />
                <text
                  x={svgWidth - padRight - 5}
                  y={getY(chart.threshold) - 6}
                  fill="#f43f5e"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {chart.thresholdLabel || `Threshold (${chart.threshold})`}
                </text>
              </g>
            )}

            {/* Render Bars or Transit/Line */}
            {chart.chartType === 'bar' ? (
              <g>
                {chart.points.map((point, i) => {
                  const barWidth = Math.min(36, (chartW / chart.points.length) * 0.6);
                  const barX = padLeft + (i + 0.5) * (chartW / chart.points.length) - barWidth / 2;
                  const barY = getY(point.value);
                  const barHeight = Math.max(2, padTop + chartH - barY);
                  const isHovered = hoveredPoint?.label === point.label;

                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="3"
                        fill={isHovered ? '#38bdf8' : '#8b5cf6'}
                        fillOpacity={isHovered ? 0.95 : 0.75}
                        stroke={isHovered ? '#0ea5e9' : '#a78bfa'}
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                      <text
                        x={barX + barWidth / 2}
                        y={padTop + chartH + 16}
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            ) : (
              // Transit Dip / Curve Graph
              <g>
                {/* Area under curve gradient */}
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Polyline Path */}
                <path
                  d={chart.points.reduce((acc, p, i) => {
                    const x = getX(i);
                    const y = getY(p.value);
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chart.points.map((p, i) => {
                  const cx = getX(i);
                  const cy = getY(p.value);
                  const isHovered = hoveredPoint?.label === p.label;

                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 3.5}
                        fill={isHovered ? '#38bdf8' : '#c084fc'}
                        stroke="#070c1b"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      <text
                        x={cx}
                        y={padTop + chartH + 16}
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Y Axis Labels */}
            <text
              x={padLeft - 8}
              y={padTop + 4}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
            >
              {maxVal.toFixed(2)}
            </text>
            <text
              x={padLeft - 8}
              y={padTop + chartH + 3}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
            >
              {minVal.toFixed(2)}
            </text>
            <text
              x={padLeft - 18}
              y={padTop + chartH / 2}
              fill="#64748b"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              transform={`rotate(-90 ${padLeft - 18} ${padTop + chartH / 2})`}
            >
              {chart.yAxisLabel}
            </text>

            {/* X Axis Label */}
            <text
              x={padLeft + chartW / 2}
              y={svgHeight - 6}
              fill="#64748b"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {chart.xAxisLabel}
            </text>
          </svg>
        </div>

        {/* Dynamic Telemetry Tooltip */}
        {hoveredPoint && (
          <div className="mt-2 p-2 rounded bg-violet-950/70 border border-violet-500/40 flex items-center justify-between text-xs font-mono text-violet-200">
            <span>DATA POINT: {hoveredPoint.label}</span>
            <span className="font-bold text-cyan-300">
              VAL: {hoveredPoint.value} {hoveredPoint.unit}
            </span>
          </div>
        )}
      </div>

      {/* Multiple-Choice Interpretation Options */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
          <span>Deduce Scientific Conclusion:</span>
          <span>Hotkeys: 1 - {question.options.length}</span>
        </div>

        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;
          const optionLetter = String.fromCharCode(65 + idx);

          let buttonStyle = 'border-slate-800 bg-[#070c1b]/60 hover:bg-[#0c152e]/80 hover:border-slate-600 text-slate-200';

          if (isSubmitted) {
            if (isCorrect) {
              buttonStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-rose-500 bg-rose-950/40 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
            } else {
              buttonStyle = 'border-slate-800 bg-[#050814]/40 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            buttonStyle = 'border-violet-400 bg-violet-950/40 text-violet-100 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-violet-400/50';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isSubmitted}
              onClick={() => onSelectOption(idx)}
              className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 group cursor-pointer disabled:cursor-default ${buttonStyle}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : isSelected
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                    : isSelected
                    ? 'bg-violet-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                }`}
              >
                {optionLetter}
              </span>

              <div className="flex-1 min-w-0">
                <span className="text-sm md:text-base font-medium leading-snug block">
                  {option}
                </span>
              </div>

              {isSubmitted && (
                <div className="shrink-0 pt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
