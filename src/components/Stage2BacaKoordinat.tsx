import React, { useState, useEffect } from 'react';
import { STAGE_2_QUESTIONS, CYBERAYA_LANDMARKS } from '../data/cyberayaData';
import { CyberayaGrid3D } from './CyberayaGrid3D';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, ArrowRight, Award, Crosshair, Play } from 'lucide-react';

interface Stage2Props {
  onComplete: (stars: number, earnedScore: number) => void;
  onBackToMap: () => void;
}

export const Stage2BacaKoordinat: React.FC<Stage2Props> = ({ onComplete, onBackToMap }) => {
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<[number, number] | null>(null);
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
    speechMessage: string;
  }>({ type: null, message: '', speechMessage: '' });
  const [isStageDone, setIsStageDone] = useState<boolean>(false);

  const currentQ = STAGE_2_QUESTIONS[questionIdx];

  useEffect(() => {
    if (!isStageDone && currentQ) {
      sound.speak(currentQ.speechQuestion, 'ammar');
      setSelectedOption(null);
      setShowRuler(false);
      setFeedback({ type: null, message: '', speechMessage: '' });
    }
  }, [questionIdx, isStageDone]);

  const handleSelectOption = (coord: [number, number]) => {
    if (feedback.type === 'correct' || isStageDone) return;
    setSelectedOption(coord);
    setShowRuler(true);

    const [cx, cy] = currentQ.correctCoordinate;
    const isCorrect = coord[0] === cx && coord[1] === cy;

    if (isCorrect) {
      sound.playCorrect();
      setFeedback({
        type: 'correct',
        message: currentQ.explanation,
        speechMessage: currentQ.speechExplanation,
      });
      sound.speak(currentQ.speechExplanation, 'ammar');
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);

      // Check if reversed misconception (common Year 5 error: reading Y first instead of X)
      let customHint = `Salah! Koordinat (${coord[0]}, ${coord[1]}) tidak menepati lokasi sasaran. Ingat petua: Berjalan di paksi-X (mendatar) dahulu, kemudian panjat paksi-Y (menegak)!`;
      if (coord[0] === cy && coord[1] === cx) {
        customHint = `Awas Ali! Kamu telah terbalikkan nilai X dan Y. Nilai ${cx} mesti ditulis dahulu kerana ia di paksi-X mendatar, diikuti ${cy} di paksi-Y menegak!`;
      }

      setFeedback({
        type: 'wrong',
        message: customHint,
        speechMessage: customHint,
      });
      sound.speak(customHint, 'ammar');
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (questionIdx < STAGE_2_QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setIsStageDone(true);
      sound.playVictoryFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      sound.speak(
        'Syabas Ali! Kemahiran membaca koordinat kamu kini pada tahap ejen elit!',
        'ammar'
      );
    }
  };

  const handleFinishStage = () => {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const earnedScore = Math.max(100, 400 - mistakes * 40);
    onComplete(stars, earnedScore);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-3 sm:p-5 bg-slate-950 text-white overflow-y-auto select-none">
      {/* Top Stage Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-2 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-emerald-300 uppercase tracking-wide">
              STAGE 2: BACA KOORDINAT
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Objektif: Tentukan pasangan tertib (x, y) dengan membaca X mendatar dahulu, kemudian Y menegak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs text-emerald-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-500/30">
          <span>SOALAN {questionIdx + 1}</span>
          <span className="text-slate-500">/</span>
          <span>{STAGE_2_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left / Center: Interactive Coordinate Grid with Landmarks & Steps */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <CyberayaGrid3D
            landmarks={CYBERAYA_LANDMARKS}
            activeLandmarkId={currentQ.landmark.id}
            animatedTarget={currentQ.correctCoordinate}
            selectedCoordinate={selectedOption}
            showRulerSteps={showRuler}
            isInteractive={false} // Selection is via options buttons for precise multiple-choice assessment
            gridOverlayText={`SASARAN: ${currentQ.landmark.name.toUpperCase()}`}
          />

          {/* Demonstration Button to replay visual steps */}
          <button
            onClick={() => {
              sound.playScan();
              setShowRuler(false);
              setTimeout(() => setShowRuler(true), 150);
            }}
            className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>TUNJUK LANGKAH PERGERAKAN (X DAHULU, KEMUDIAN Y)</span>
          </button>
        </div>

        {/* Right: Question, Options, and Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-3">
          {!isStageDone ? (
            <>
              {/* Question Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                    LOKASI MERCU TANDA
                  </span>
                  <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    {currentQ.landmark.name}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* Options Selection (4 Buttons) */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentQ.options.map(([ox, oy], idx) => {
                  const isSelected = selectedOption && selectedOption[0] === ox && selectedOption[1] === oy;
                  const isCorrect = feedback.type === 'correct' && ox === currentQ.correctCoordinate[0] && oy === currentQ.correctCoordinate[1];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption([ox, oy])}
                      disabled={feedback.type === 'correct'}
                      className={`p-3.5 rounded-xl border-2 font-black text-base sm:text-lg font-mono tracking-wider transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                        isCorrect
                          ? 'bg-emerald-600 border-white text-white shadow-[0_0_20px_#10b981]'
                          : isSelected && feedback.type === 'wrong'
                          ? 'bg-rose-900/80 border-rose-500 text-rose-200'
                          : 'bg-slate-900/80 border-slate-700 hover:border-emerald-400 text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <span>({ox}, {oy})</span>
                      <span className="text-[10px] font-normal text-slate-400 mt-0.5">
                        x={ox}, y={oy}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Display */}
              {feedback.type && (
                <div
                  className={`p-3.5 rounded-xl border-2 flex items-start gap-3 transition-all ${
                    feedback.type === 'correct'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}
                >
                  {feedback.type === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                    {feedback.message}
                  </div>
                </div>
              )}

              {/* Next Button */}
              {feedback.type === 'correct' && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer"
                >
                  <span>
                    {questionIdx === STAGE_2_QUESTIONS.length - 1 ? 'SELESAIKAN STAGE 2' : 'SOALAN SETERUSNYA'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Stage 2 Complete Card */
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950/80 border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  STATUS BACAAN KOORDINAT
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  LOKASI MERCU TANDA BERJAYA DIBACA!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ejen Ali kini mahir membaca pasangan tertib (x,y) dengan pantas dan tepat!
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300 flex justify-around">
                <div>
                  <div className="text-slate-400 text-[10px]">KESILAPAN:</div>
                  <div className="font-bold text-sm text-white">{mistakes} kali</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">PENARAFAN:</div>
                  <div className="font-bold text-sm text-yellow-400">
                    {mistakes === 0 ? '⭐⭐⭐ CEMERLANG' : mistakes <= 2 ? '⭐⭐ BAGUS' : '⭐ LULUS'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onBackToMap}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 font-mono transition cursor-pointer"
                >
                  PETA UTAMA
                </button>
                <button
                  onClick={handleFinishStage}
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 text-xs font-black tracking-wider uppercase transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>KE STAGE 3: CARI & PLOT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dialogue Box for Mentorship */}
      <div className="w-full max-w-4xl mx-auto mt-2">
        <DialogueBox
          speaker="ammar"
          speakerName="Cikgu Ammar"
          text={
            feedback.type === 'correct'
              ? currentQ?.explanation || 'Jawapan tepat!'
              : currentQ?.speechQuestion || 'Baca nilai X mendatar dahulu, kemudian nilai Y menegak.'
          }
          speechText={
            feedback.type === 'correct'
              ? currentQ?.speechExplanation
              : currentQ?.speechQuestion
          }
          autoSpeak={false}
        />
      </div>
    </div>
  );
};
