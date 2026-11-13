import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Orbit } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the most unique rotational feature of Uranus compared to other planets?',
    options: [
      'It does not rotate at all',
      'It rotates completely on its side with an axial tilt of nearly 98°',
      'It spins faster than any other celestial body in the universe',
      'Its magnetic field points directly toward the Sun',
    ],
    correctIndex: 1,
    explanation: 'Uranus has an axial tilt of 97.77°, meaning it orbits the Sun rolling almost completely on its side, likely caused by an ancient collision with an Earth-sized protoplanet.',
  },
  {
    id: 2,
    question: 'Why do Uranus and Neptune appear distinctly blue-green in color?',
    options: [
      'They have liquid water oceans covering their entire surface',
      'Atmospheric methane absorbs red light and reflects blue and green wavelengths',
      'High concentrations of copper minerals in their cloud decks',
      'Radiation from the solar wind ionizes their nitrogen',
    ],
    correctIndex: 1,
    explanation: 'Methane gas (CH₄) in the upper atmospheres of Uranus and Neptune strongly absorbs red visible light from the Sun, leaving blue and teal photons to reflect back into space.',
  },
  {
    id: 3,
    question: 'What theoretical meteorological phenomenon is hypothesized to occur in the high-pressure mantles of Uranus and Neptune?',
    options: [
      'Liquid iron rain',
      'Superheated helium tornadoes',
      'Precipitation of solid diamonds falling toward the rocky core',
      'Frozen oxygen snowstorms',
    ],
    correctIndex: 2,
    explanation: 'Extreme pressures (millions of atmospheres) and temperatures inside the methane-rich mantle compress carbon atoms directly into diamond crystals that sink toward the planet’s core.',
  },
  {
    id: 4,
    question: 'How long does a single season last on Uranus as it completes its 84 Earth-year orbit?',
    options: [
      'Approximately 3 Earth months',
      '1 Earth year',
      'Approximately 21 Earth years per season',
      '42 Earth years per season',
    ],
    correctIndex: 2,
    explanation: 'Because Uranus rolls on its side, each pole gets 42 years of continuous sunlight followed by 42 years of darkness during its 84-year orbit, making each season last 21 Earth years.',
  },
];

export const UranusQuizScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('uranus');

  // Interactive 98-deg Tilt Canvas state
  const [axialTilt, setAxialTilt] = useState<number>(97.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  // Interactive Axial Tilt & Magnetic Decoupling Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let spin = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Rotate by axial tilt (97.8 deg)
      const rad = (axialTilt * Math.PI) / 180;
      ctx.rotate(rad);

      // Rotational Axis Line
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.lineTo(0, 110);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vertical Ring Plane
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 95, 20, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Uranus Globe
      const globeGrad = ctx.createRadialGradient(-15, -15, 5, 0, 0, 50);
      globeGrad.addColorStop(0, '#A7F3D0');
      globeGrad.addColorStop(0.5, '#5EEAD4');
      globeGrad.addColorStop(1, '#0F766E');

      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      // Magnetic field axis (tilted 59 deg from spin axis!)
      ctx.save();
      ctx.rotate((59 * Math.PI) / 180);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -90);
      ctx.lineTo(0, 90);
      ctx.stroke();

      // Magnetic Pole label
      ctx.fillStyle = '#F59E0B';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('MAG POLE (59° OFFSET)', 8, -75);
      ctx.restore();

      ctx.restore();

      spin += 0.01;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [axialTilt]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#5EEAD4]/30 bg-gradient-to-r from-[#04201D] via-[#05070D] to-[#062624] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5EEAD4] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#5EEAD4]">
                  ICE GIANT AXIAL COLLISION & ASTROPHYSICS LAB
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Uranus 98° Tilt Simulator & Knowledge Challenge
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Analyze why Uranus rolls on its side along its orbital plane. 
                Interact with the 97.8° axial tilt simulator, witness its 59° decoupled magnetic dynamo, 
                and master astrophysics principles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#5EEAD4]">
                97.8° AXIAL TILT // 59° MAG OFFSET
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive 98-deg Tilt & Magnetic Dynamo Canvas */}
          <div className="lg:col-span-1 relative aspect-square min-h-[320px] rounded-3xl border border-white/10 bg-[#061214] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Orbit className="h-4 w-4 text-[#5EEAD4]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  AXIAL TILT GYRO
                </span>
              </div>

              <span className="font-mono text-xs font-bold text-[#5EEAD4]">
                {axialTilt}°
              </span>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="absolute inset-0 h-full w-full"
            />

            {/* Tilt Scrubber */}
            <div className="z-10 flex flex-col gap-1 border-t border-white/5 pt-2">
              <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                <span>Earth (23.5°)</span>
                <span>Uranus (97.8°)</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="0.5"
                value={axialTilt}
                onChange={(e) => setAxialTilt(parseFloat(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#5EEAD4] cursor-pointer"
              />
            </div>
          </div>

          {/* Right 2 Columns: Astrophysics Knowledge Challenge */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#05070D]/85 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            {!isQuizComplete ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-mono text-xs text-[#5EEAD4] font-bold">
                    QUESTION {currentQuestionIndex + 1} OF {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="font-mono text-xs text-[#94A3B8]">
                    Score: {score} / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                  </span>
                </div>

                <h3 className="font-sans text-lg sm:text-xl font-bold text-[#F8FAFC] leading-snug">
                  {currentQ.question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="flex flex-col gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                    const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                          isCorrect
                            ? 'border-[#10B981] bg-[#10B981]/20 text-[#F8FAFC]'
                            : isWrong
                            ? 'border-red-500 bg-red-500/20 text-red-200'
                            : isSelected
                            ? 'border-[#5EEAD4] bg-[#5EEAD4]/15 text-[#F8FAFC]'
                            : 'border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span className="font-sans text-xs sm:text-sm">{opt}</span>
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />}
                        {isWrong && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Callout */}
                {isAnswerSubmitted && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 animate-fade-in text-left">
                    <span className="font-mono text-[10px] text-[#5EEAD4] font-bold uppercase">
                      ASTROPHYSICS INSIGHT
                    </span>
                    <p className="mt-1 font-sans text-xs text-[#CBD5E1] leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Next / Submit Button */}
                <div className="mt-2 flex justify-end">
                  {!isAnswerSubmitted ? (
                    <button
                      type="button"
                      disabled={selectedOption === null}
                      onClick={handleSubmitAnswer}
                      className="rounded-xl bg-[#5EEAD4] px-5 py-2 font-mono text-xs font-bold text-[#05070D] transition-all hover:bg-[#2DD4BF] disabled:opacity-40"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="rounded-xl bg-[#5EEAD4] px-5 py-2 font-mono text-xs font-bold text-[#05070D] transition-all hover:bg-[#2DD4BF]"
                    >
                      {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Results'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Complete Celebration */
              <div className="flex flex-col items-center justify-center p-6 text-center gap-4 my-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5EEAD4]/15 border border-[#5EEAD4]/40 text-[#5EEAD4] shadow-[0_0_24px_rgba(94,234,212,0.5)]">
                  <Trophy className="h-8 w-8" />
                </div>

                <h3 className="font-sans text-2xl font-bold text-[#F8FAFC]">
                  Challenge Complete!
                </h3>

                <p className="font-mono text-sm text-[#5EEAD4]">
                  Final Score: {score} / {QUIZ_QUESTIONS.length} Correct
                </p>

                <p className="font-sans text-xs text-[#94A3B8] max-w-md">
                  {score === QUIZ_QUESTIONS.length
                    ? 'Flawless mastery! You have unlocked the Uranus Ice Giant Scholar certification.'
                    : 'Great exploration! Review the unique tilt and methane spectroscopy dynamics to sharpen your knowledge.'}
                </p>

                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-[#5EEAD4] px-6 py-2.5 font-mono text-xs font-bold text-[#05070D] transition-all hover:bg-[#2DD4BF]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Challenge</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
