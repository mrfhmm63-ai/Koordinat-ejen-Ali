import React, { useState, useEffect } from 'react';
import { STAGE_1_QUESTIONS } from '../data/cyberayaData';
import { CyberayaGrid3D } from './CyberayaGrid3D';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, ArrowRight, Award, Compass } from 'lucide-react';

interface Stage1Props {
  onComplete: (stars: number, earnedScore: number) => void;
  onBackToMap: () => void;
}

export const Stage1AktifkanPaksi: React.FC<Stage1Props> = ({ onComplete, onBackToMap }) => {
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
    speechMessage: string;
  }>({ type: null, message: '', speechMessage: '' });
  const [isStageDone, setIsStageDone] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<'paksi-x' | 'paksi-y' | 'asalan' | null>(null);

  const currentQ = STAGE_1_QUESTIONS[questionIdx];

  useEffect(() => {
    // Speak prompt on question load
    if (!isStageDone && currentQ) {
      sound.speak(currentQ.speechPrompt, 'ammar');
      setFeedback({ type: null, message: '', speechMessage: '' });
      setActiveHighlight(null);
    }
  }, [questionIdx, isStageDone]);

  const handleSelectAxis = (selectedAxis: 'paksi-x' | 'paksi-y' | 'asalan') => {
    if (feedback.type === 'correct' || isStageDone) return;

    if (selectedAxis === currentQ.targetType) {
      // Correct!
      sound.playCorrect();
      setActiveHighlight(selectedAxis);
      setFeedback({
        type: 'correct',
        message: currentQ.explanation,
        speechMessage: currentQ.speechExplanation,
      });
      sound.speak(currentQ.speechExplanation, 'ammar');
    } else {
      // Wrong
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      const hint =
        currentQ.targetType === 'paksi-x'
          ? 'Cuba lagi! Paksi-X ialah paksi mendatar (mengufuk) dari kiri ke kanan berwarna biru/cyan.'
          : currentQ.targetType === 'paksi-y'
          ? 'Cuba lagi! Paksi-Y ialah paksi menegak (mencancang) dari bawah ke atas berwarna hijau.'
          : 'Cuba lagi! Titik Asalan (0,0) terletak di sudut bawah kiri, pertemuan paksi X dan Y.';

      setFeedback({
        type: 'wrong',
        message: hint,
        speechMessage: hint,
      });
      sound.speak(hint, 'ammar');
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (questionIdx < STAGE_1_QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      // Stage finished
      setIsStageDone(true);
      sound.playVictoryFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sound.speak(
        'Tahniah Ali dan murid-murid! Semua paksi navigasi Cyberaya kini telah diaktifkan dengan jayanya!',
        'ammar'
      );
    }
  };

  const handleFinishStage = () => {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const earnedScore = Math.max(100, 300 - mistakes * 40);
    onComplete(stars, earnedScore);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-3 sm:p-5 bg-slate-950 text-white overflow-y-auto select-none">
      {/* Top Stage Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-2 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-cyan-300 uppercase tracking-wide">
              STAGE 1: AKTIFKAN PAKSI
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Objektif: Kenal pasti Paksi-X, Paksi-Y dan Titik Asalan (0,0)
            </p>
          </div>
        </div>

        {/* Question step indicator */}
        <div className="flex items-center gap-1 font-mono text-xs text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-cyan-500/30">
          <span>SOALAN {questionIdx + 1}</span>
          <span className="text-slate-500">/</span>
          <span>{STAGE_1_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left / Center: Interactive Coordinate Grid */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <CyberayaGrid3D
            highlightAxis={activeHighlight || (feedback.type === 'correct' ? currentQ.targetType : null)}
            onSelectAxis={handleSelectAxis}
            isInteractive={feedback.type !== 'correct' && !isStageDone}
            gridOverlayText="KLIK PADA PAKSI ATAU ASALAN PADA GRID DI ATAS"
          />

          {/* Quick Clickable Buttons for Mobile/Alternative Input */}
          <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-md">
            <button
              onClick={() => handleSelectAxis('paksi-x')}
              disabled={feedback.type === 'correct'}
              className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold font-mono transition cursor-pointer disabled:opacity-60"
            >
              Paksi-X (Mendatar)
            </button>
            <button
              onClick={() => handleSelectAxis('paksi-y')}
              disabled={feedback.type === 'correct'}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono transition cursor-pointer disabled:opacity-60"
            >
              Paksi-Y (Menegak)
            </button>
            <button
              onClick={() => handleSelectAxis('asalan')}
              disabled={feedback.type === 'correct'}
              className="flex-1 py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-bold font-mono transition cursor-pointer disabled:opacity-60"
            >
              Titik Asalan (0,0)
            </button>
          </div>
        </div>

        {/* Right: Task Guidance and Voice Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-3">
          {!isStageDone ? (
            <>
              {/* Task Prompt Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-cyan-500/50 shadow-lg">
                <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 mb-1">
                  MISI AKTIF:
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {currentQ.taskPrompt}
                </h3>
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

              {/* Next Button when Correct */}
              {feedback.type === 'correct' && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer"
                >
                  <span>
                    {questionIdx === STAGE_1_QUESTIONS.length - 1 ? 'SELESAIKAN STAGE 1' : 'TERUSKAN KE SOALAN SETERUSNYA'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Stage 1 Complete Card */
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950/80 border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  STATUS SEKTOR
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  PAKSI NAVIGASI BERJAYA DIAKTIFKAN!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ejen Ali kini memahami paksi-X (mendatar), paksi-Y (menegak) dan asalan (0,0).
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
                  <span>KE STAGE 2: BACA KOORDINAT</span>
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
              ? currentQ?.explanation || 'Bagus sekali Ali!'
              : currentQ?.speechPrompt || 'Sentuh paksi untuk mengaktifkannya.'
          }
          speechText={
            feedback.type === 'correct'
              ? currentQ?.speechExplanation
              : currentQ?.speechPrompt
          }
          autoSpeak={false} // Already spoken via effect to avoid double speak
        />
      </div>
    </div>
  );
};
