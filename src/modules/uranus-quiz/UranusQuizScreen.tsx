import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Award } from 'lucide-react';

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
    explanation: 'Because Uranus takes 84 Earth years to orbit the Sun and is tilted on its side, each pole experiences continuous direct sunlight for 21 years followed by 21 years of uninterrupted polar darkness.',
  },
  {
    id: 5,
    question: 'Which of the following moons orbiting Uranus features the highest cliff face in the Solar System (Verona Rupes)?',
    options: [
      'Titania',
      'Oberon',
      'Miranda',
      'Ariel',
    ],
    correctIndex: 2,
    explanation: 'Miranda hosts Verona Rupes, an enormous icy scarp estimated to be 20 kilometers (12 miles) high—more than 10 times deeper than the Grand Canyon on Earth!',
  },
];

export const UranusQuizScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('uranus');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const q = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === q.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Quiz Banner */}
        <div className="rounded-2xl border border-[#2DD4BF]/30 bg-gradient-to-r from-[#041F1B] via-[#0A0F1D] to-[#082924] p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#2DD4BF]">
                CELESTIAL KNOWLEDGE ARENA
              </span>
              <h2 className="font-sans text-2xl font-bold text-[#F8FAFC]">
                Uranus Astronomy Quiz Arena
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3.5 py-1.5 font-mono text-sm font-bold text-[#2DD4BF]">
              <Trophy className="h-4 w-4" />
              <span>Score: {score}/{QUIZ_QUESTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Quiz Workspace */}
        {!isCompleted ? (
          <div className="flex flex-col gap-5 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>Ice Giant Astrophysics</span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#11182E] overflow-hidden">
              <div
                className="h-full bg-[#2DD4BF] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="font-sans text-lg sm:text-xl font-bold text-[#F8FAFC] leading-snug">
              {q.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-3 mt-2">
              {q.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswerSubmitted && idx === q.correctIndex;
                const isWrong = isAnswerSubmitted && isSelected && idx !== q.correctIndex;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center justify-between rounded-xl p-4 text-left font-sans text-sm transition-all ${
                      isCorrect
                        ? 'border border-[#10B981] bg-[#10B981]/20 font-semibold text-[#F8FAFC]'
                        : isWrong
                        ? 'border border-[#EF4444] bg-[#EF4444]/20 text-[#FCA5A5]'
                        : isSelected
                        ? 'border border-[#2DD4BF] bg-[#2DD4BF]/15 font-semibold text-[#F8FAFC]'
                        : 'border border-[rgba(148,163,184,0.14)] bg-[#11182E] text-[#CBD5E1] hover:border-[#2DD4BF] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span>{option}</span>
                    {isCorrect && <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0" />}
                    {isWrong && <XCircle className="h-5 w-5 text-[#EF4444] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card */}
            {isAnswerSubmitted && (
              <div className="rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 p-4 font-sans text-xs text-[#CBD5E1] animate-fade-in leading-relaxed">
                <span className="block font-bold text-[#2DD4BF] mb-1">ASTROPHYSICAL EXPLANATION:</span>
                {q.explanation}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="rounded-xl bg-[#2DD4BF] px-6 py-2.5 font-mono text-xs font-bold text-[#05070D] shadow-lg transition-all hover:bg-[#5EEAD4] disabled:opacity-40"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-[#2DD4BF] px-6 py-2.5 font-mono text-xs font-bold text-[#05070D] shadow-lg transition-all hover:bg-[#5EEAD4]"
                >
                  {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Results 🏆'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion Certificate Card */
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#2DD4BF]/30 bg-[#0A0F1D]/95 p-8 text-center shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF]">
              <Award className="h-8 w-8" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#2DD4BF]">
                ORBIT ACADEMY CERTIFICATE OF ASTRONOMICAL EXCELLENCE
              </span>
              <h3 className="font-sans text-2xl font-bold text-[#F8FAFC] mt-1">
                Challenge Complete!
              </h3>
              <p className="mt-1 font-sans text-sm text-[#CBD5E1]">
                You scored <strong className="text-[#2DD4BF]">{score} out of {QUIZ_QUESTIONS.length}</strong> ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#11182E] p-4 max-w-md w-full text-xs font-mono text-[#94A3B8]">
              {score === 5
                ? '🌟 Rank: Master Heliophysicist & Ice Giant Scholar'
                : score >= 3
                ? '🚀 Rank: Senior Flight Navigator'
                : '🪐 Rank: Cadet Observer — Review the telemetry and try again!'}
            </div>

            <button
              type="button"
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-2.5 font-mono text-xs font-bold text-[#05070D] shadow-lg transition-all hover:bg-[#5EEAD4]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Quiz Challenge</span>
            </button>
          </div>
        )}
      </div>
    </ModuleShell>
  );
};
