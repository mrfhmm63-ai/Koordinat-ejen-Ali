import React, { useState, useEffect } from 'react';
import { STAGE_3_QUESTIONS } from '../data/cyberayaData';
import { CyberayaGrid3D } from './CyberayaGrid3D';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, ArrowRight, Award, MapPin, Check, RotateCcw } from 'lucide-react';

interface Stage3Props {
  onComplete: (stars: number, earnedScore: number) => void;
  onBackToMap: () => void;
}

export const Stage3CariLokasi: React.FC<Stage3Props> = ({ onComplete, onBackToMap }) => {
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedCoord, setSelectedCoord] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
    speechMessage: string;
  }>({ type: null, message: '', speechMessage: '' });
  const [isStageDone, setIsStageDone] = useState<boolean>(false);

  const currentQ = STAGE_3_QUESTIONS[questionIdx];

  useEffect(() => {
    if (!isStageDone && currentQ) {
      sound.speak(currentQ.speechClue, 'ammar');
      setSelectedCoord(null);
      setFeedback({ type: null, message: '', speechMessage: '' });
    }
  }, [questionIdx, isStageDone]);

  const handleGridClick = (coord: [number, number]) => {
    if (feedback.type === 'correct' || isStageDone) return;
    setSelectedCoord(coord);
    sound.playSelect();
  };

  const handleCheckAnswer = () => {
    if (!selectedCoord) {
      sound.speak('Sila klik pada grid terlebih dahulu untuk memplot titik koordinat!', 'ammar');
      return;
    }

    const [tx, ty] = currentQ.targetCoordinate;
    const [sx, sy] = selectedCoord;

    if (sx === tx && sy === ty) {
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

      let hint = `Anda telah memplot pada titik (${sx}, ${sy}). Sasaran sebenar ialah (${tx}, ${ty}). Dari asalan (0,0), bergerak ${tx} unit ke kanan (X) dan ${ty} unit ke atas (Y)!`;
      if (sx === ty && sy === tx) {
        hint = `Hati-hati! Anda telah meletakkan koordinat secara terbalik (${sx}, ${sy}). Kira nilai mendatar ${tx} dahulu, baru naik ke atas ${ty}!`;
      }

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
    if (questionIdx < STAGE_3_QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setIsStageDone(true);
      sound.playVictoryFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      sound.speak(
        'Hebat Ali! Anda telah berjaya memplot semua lokasi penting Cyberaya. Misi Akhir kini telah dibuka!',
        'ammar'
      );
    }
  };

  const handleFinishStage = () => {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const earnedScore = Math.max(120, 450 - mistakes * 40);
    onComplete(stars, earnedScore);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-3 sm:p-5 bg-slate-950 text-white overflow-y-auto select-none">
      {/* Top Stage Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-2 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
              STAGE 3: CARI & PLOT LOKASI
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Objektif: Plotkan titik pada grid interaktif mengikut koordinat yang diberikan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs text-amber-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-amber-500/30">
          <span>SOALAN {questionIdx + 1}</span>
          <span className="text-slate-500">/</span>
          <span>{STAGE_3_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left / Center: Interactive Coordinate Grid with Click-to-Plot */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <CyberayaGrid3D
            selectedCoordinate={selectedCoord}
            animatedTarget={feedback.type === 'correct' ? currentQ.targetCoordinate : null}
            showRulerSteps={feedback.type === 'correct'}
            onSelectCoordinate={handleGridClick}
            isInteractive={feedback.type !== 'correct' && !isStageDone}
            gridOverlayText={
              selectedCoord
                ? `TITIK DIPILIH: (${selectedCoord[0]}, ${selectedCoord[1]}) - TEKAN "SEMAK JAWAPAN"`
                : 'KLIK MANA-MANA PERSILANGAN GRID UNTUK MEMPLOT TITIK'
            }
          />
        </div>

        {/* Right: Mission Task, Target Details, Action Controls */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-3">
          {!isStageDone ? (
            <>
              {/* Mission Clue Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-amber-500/50 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                    LOKASI YANG PERLU DILOT
                  </span>
                  <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    {currentQ.targetName}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {currentQ.clue}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
                  <span>SASARAN KOORDINAT:</span>
                  <span className="font-black text-white text-sm bg-amber-600/60 px-2 py-0.5 rounded">
                    ({currentQ.targetCoordinate[0]}, {currentQ.targetCoordinate[1]})
                  </span>
                </div>
              </div>

              {/* Current Plotted Point Indicator & Action */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Titik Anda:</span>
                  <span className="text-cyan-300 font-bold text-sm">
                    {selectedCoord ? `(${selectedCoord[0]}, ${selectedCoord[1]})` : 'Belum Dipilih'}
                  </span>
                </div>

                {selectedCoord && feedback.type !== 'correct' && (
                  <button
                    onClick={() => setSelectedCoord(null)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition cursor-pointer"
                    title="Reset Pilihan"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Check Answer Button */}
              {feedback.type !== 'correct' && (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedCoord}
                  className={`w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                    selectedCoord
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-400/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>SEMAK JAWAPAN</span>
                </button>
              )}

              {/* Feedback Alert */}
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

              {/* Next Question Button */}
              {feedback.type === 'correct' && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer"
                >
                  <span>
                    {questionIdx === STAGE_3_QUESTIONS.length - 1 ? 'SELESAIKAN STAGE 3' : 'SOALAN SETERUSNYA'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Stage 3 Complete Card */
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-amber-950/80 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  STATUS PEMETAAN LOKASI
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  SEMUA MERCU TANDA BERJAYA DIPLOT!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Kemahiran memplot titik koordinat anda sangat mantap. Kini masanya untuk Misi Akhir!
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-amber-500/30 text-xs font-mono text-amber-300 flex justify-around">
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
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 text-slate-950 text-xs font-black tracking-wider uppercase transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>BUKA MISI AKHIR SEKARANG!</span>
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
              ? currentQ?.explanation || 'Tepat sekali!'
              : currentQ?.speechClue || 'Plot titik dengan menyentuh grid.'
          }
          speechText={
            feedback.type === 'correct'
              ? currentQ?.speechExplanation
              : currentQ?.speechClue
          }
          autoSpeak={false}
        />
      </div>
    </div>
  );
};
