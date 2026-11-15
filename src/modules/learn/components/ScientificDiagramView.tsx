import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';

export interface DiagramElement {
  label: string;
  description: string;
  value?: string;
  color?: string;
}

export interface ScientificDiagramData {
  title: string;
  type: string;
  caption: string;
  elements: DiagramElement[];
}

interface ScientificDiagramViewProps {
  diagram: ScientificDiagramData;
  className?: string;
}

export const ScientificDiagramView: React.FC<ScientificDiagramViewProps> = ({
  diagram,
  className = '',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeElement = diagram.elements[selectedIdx] || diagram.elements[0];

  return (
    <div
      className={`flex flex-col rounded-3xl border border-white/10 bg-[#070C1B]/90 backdrop-blur-2xl p-5 shadow-2xl space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-white flex items-center gap-2">
              <span>{diagram.title}</span>
              <TelemetryBadge label="INTERACTIVE DIAGRAM" tone="cyan" size="sm" />
            </h4>
            <p className="font-mono text-[11px] text-[#94A3B8]">{diagram.caption}</p>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graph Stage (SVG Canvas) */}
      <div className="relative w-full h-56 rounded-2xl bg-[#030611] border border-white/5 overflow-hidden flex items-center justify-center p-4">
        {/* Render specialized diagrams based on diagram type */}
        {diagram.type === 'nuclear-fusion' ? (
          <svg className="w-full h-full" viewBox="0 0 500 200">
            {/* Hydrogen Protons */}
            <circle cx="70" cy="60" r="22" fill="#38BDF8" opacity="0.85" />
            <text x="70" y="65" fill="#030611" fontSize="12" fontWeight="bold" textAnchor="middle">¹H</text>

            <circle cx="70" cy="140" r="22" fill="#38BDF8" opacity="0.85" />
            <text x="70" y="145" fill="#030611" fontSize="12" fontWeight="bold" textAnchor="middle">¹H</text>

            <path d="M 95 65 L 170 95" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 4" />
            <path d="M 95 135 L 170 105" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 4" />

            {/* Fusion Node */}
            <circle cx="180" cy="100" r="14" fill="#F59E0B" opacity="0.9" />
            <text x="180" y="104" fill="#030611" fontSize="10" fontWeight="black" textAnchor="middle">FUSE</text>

            {/* Deuteron */}
            <circle cx="280" cy="100" r="26" fill="#10B981" opacity="0.85" />
            <text x="280" y="105" fill="#030611" fontSize="12" fontWeight="bold" textAnchor="middle">²H (D)</text>

            <path d="M 195 100 L 250 100" stroke="#F59E0B" strokeWidth="3" />
            <path d="M 310 100 L 380 100" stroke="#10B981" strokeWidth="3" />

            {/* Final Helium-4 */}
            <circle cx="420" cy="100" r="32" fill="#F43F5E" opacity="0.9" />
            <text x="420" y="105" fill="#FFFFFF" fontSize="13" fontWeight="black" textAnchor="middle">⁴He + γ</text>

            {/* Positron and Neutrino Ejection */}
            <circle cx="230" cy="40" r="9" fill="#C084FC" />
            <text x="230" y="44" fill="#030611" fontSize="9" fontWeight="bold" textAnchor="middle">e⁺</text>
            <path d="M 185 90 L 222 48" stroke="#C084FC" strokeWidth="1.5" />

            <circle cx="230" cy="160" r="9" fill="#A78BFA" />
            <text x="230" y="164" fill="#030611" fontSize="9" fontWeight="bold" textAnchor="middle">νₑ</text>
            <path d="M 185 110 L 222 152" stroke="#A78BFA" strokeWidth="1.5" />
          </svg>
        ) : diagram.type === 'frost-line' ? (
          <svg className="w-full h-full" viewBox="0 0 500 200">
            {/* Protostar */}
            <circle cx="40" cy="100" r="38" fill="#F59E0B" opacity="0.95" />
            <text x="40" y="105" fill="#030611" fontSize="11" fontWeight="black" textAnchor="middle">PROTO-SUN</text>

            {/* Warm Inner Zone */}
            <rect x="85" y="40" width="145" height="120" rx="12" fill="#EF4444" opacity="0.12" stroke="#EF4444" strokeWidth="1" />
            <text x="155" y="70" fill="#F87171" fontSize="11" fontWeight="bold" textAnchor="middle">Inner Silicates & Iron</text>
            <text x="155" y="90" fill="#94A3B8" fontSize="9.5" textAnchor="middle">T &gt; 170 K (Rocky Worlds)</text>

            {/* The Frost Line Divider */}
            <line x1="240" y1="20" x2="240" y2="180" stroke="#00E5FF" strokeWidth="3" strokeDasharray="6 4" />
            <text x="240" y="195" fill="#00E5FF" fontSize="10.5" fontWeight="black" textAnchor="middle">Frost Line (2.7 AU)</text>

            {/* Cold Outer Volatile Ice Zone */}
            <rect x="250" y="40" width="220" height="120" rx="12" fill="#0284C7" opacity="0.12" stroke="#0284C7" strokeWidth="1" />
            <text x="360" y="70" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">Volatile Ices (H₂O, CH₄, NH₃)</text>
            <text x="360" y="90" fill="#94A3B8" fontSize="9.5" textAnchor="middle">T &lt; 150 K (Gas &amp; Ice Giants)</text>
          </svg>
        ) : (
          /* Generic Sequential Data Diagram */
          <div className="flex items-center justify-between w-full max-w-md gap-3">
            {diagram.elements.map((el, idx) => (
              <React.Fragment key={idx}>
                <div
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedIdx === idx
                      ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                      : 'border-white/10 bg-white/5 text-[#94A3B8] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mb-1.5"
                    style={{ backgroundColor: el.color || '#00E5FF' }}
                  />
                  <span className="font-sans text-xs font-bold text-center leading-tight">
                    {el.label}
                  </span>
                  {el.value && (
                    <span className="font-mono text-[9px] text-[#CBD5E1] mt-1">
                      {el.value}
                    </span>
                  )}
                </div>
                {idx < diagram.elements.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Selected Element Insight Detail Card */}
      {activeElement && (
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{activeElement.label}</span>
            </span>
            {activeElement.value && (
              <span className="font-mono text-xs font-extrabold text-[#F59E0B]">
                {activeElement.value}
              </span>
            )}
          </div>
          <p className="font-mono text-[11.5px] text-[#94A3B8] leading-relaxed">
            {activeElement.description}
          </p>
        </div>
      )}

      {/* Bottom Category Selector Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {diagram.elements.map((el, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`px-3 py-1.5 rounded-xl border text-left font-mono text-[11px] transition-all ${
              selectedIdx === idx
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'border-white/5 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
            }`}
          >
            {el.label}
          </button>
        ))}
      </div>
    </div>
  );
};
