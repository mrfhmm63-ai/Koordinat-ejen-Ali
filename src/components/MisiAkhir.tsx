import React, { useState, useEffect } from 'react';
import { FINAL_MISSION_TARGETS } from '../data/cyberayaData';
import { CyberayaGrid3D } from './CyberayaGrid3D';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { ShieldAlert, Zap, CheckCircle2, AlertTriangle, ArrowRight, Activity, Flame } from 'lucide-react';

interface MisiAkhirProps {
  onComplete: (earnedScore: number) => void;
  onBackToMap: () => void;
}

export const MisiAkhir: React.FC<MisiAkhirProps> = ({ onComplete, onBackToMap }) => {
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const [activatedNodes, setActivatedNodes] = useState<[number, number][]>([]);
  const [selectedCoord, setSelectedCoord] = useState<[number, number] | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
    speechMessage: string;
  }>({ type: null, message: '', speechMessage: '' });
  const [timerLeft, setTimerLeft] = useState<number>(120); // 2 minutes emergency countdown
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const currentTarget = FINAL_MISSION_TARGETS[targetIdx];

  useEffect(() => {
    sound.speak(
      `Amaran! Kunci koordinat bagi ${currentTarget.name} pada pasangan tertib ${currentTarget.coordinate[0]} koma ${currentTarget.coordinate[1]} untuk menstabilkan kuasa Cyberaya!`,
      'ammar'
    );
  }, [targetIdx]);

  useEffect(() => {
    if (isSuccess) return;
    const interval = setInterval(() => {
      setTimerLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess]);

  const handleSelectCoord = (coord: [number, number]) => {
    if (feedback.type === 'correct' || isSuccess) return;
    setSelectedCoord(coord);
    sound.playLockCoordinate();
  };

  const handleConfirmNode = () => {
    if (!selectedCoord) return;

    const [tx, ty] = currentTarget.coordinate;
    const [sx, sy] = selectedCoord;

    if (sx === tx && sy === ty) {
      sound.playCorrect();
      const updated = [...activatedNodes, selectedCoord];
      setActivatedNodes(updated);

      if (targetIdx < FINAL_MISSION_TARGETS.length - 1) {
        setFeedback({
          type: 'correct',
          message: `Hebat! Nod ${currentTarget.codeName} berjaya dihubungkan pada (${tx}, ${ty})!`,
          speechMessage: `Hebat! Nod ${currentTarget.codeName} berjaya dihubungkan! Seterusnya, cari nod seterusnya!`,
        });
        sound.speak(`Hebat! Nod ${currentTarget.codeName} berjaya dihubungkan! Seterusnya, cari nod seterusnya!`, 'ali');
      } else {
        // All nodes unlocked!
        setIsSuccess(true);
        sound.playVictoryFanfare();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
        });
        setFeedback({
          type: 'correct',
          message: 'SEMUA NOD NAVIGASI TELAH TERSAMBUNG! SISTEM CYBERAYA KEMBALI PULIH SEPENUHNYA!',
          speechMessage: 'Semua nod navigasi telah tersambung! Sistem Cyberaya kembali pulih sepenuhnya!',
        });
        sound.speak('Semua nod navigasi telah tersambung! Sistem Cyberaya kembali pulih sepenuhnya!', 'ammar');
      }
    } else {
      sound.playWrong();
      const hint = `Awas Ejen! Anda menyambungkan ke (${sx}, ${sy}). Sasaran ${currentTarget.codeName} berada pada (${tx}, ${ty}). Semak semula: ${currentTarget.hint}.`;
      setFeedback({
        type: 'wrong',
        message: hint,
        speechMessage: hint,
      });
      sound.speak(hint, 'ammar');
    }
  };

  const handleNextTarget = () => {
    sound.playClick();
    if (targetIdx < FINAL_MISSION_TARGETS.length - 1) {
      setTargetIdx(targetIdx + 1);
      setSelectedCoord(null);
      setFeedback({ type: null, message: '', speechMessage: '' });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-3 sm:p-5 bg-slate-950 text-white overflow-y-auto select-none">
      {/* Top Alert Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-500/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 animate-pulse">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-rose-300 uppercase tracking-wide flex items-center gap-2">
              <span>MISI AKHIR: PULIHKAN TERAS CYBERAYA</span>
              <span className="text-[10px] font-mono bg-rose-900/60 border border-rose-500 px-1.5 py-0.2 rounded text-rose-200">
                KOD MERAH
              </span>
            </h2>
            <p className="text-[11px] text-slate-300 font-mono">
              Sambungkan 3 nod frekuensi berkoordinat untuk membentuk perisai pemulihan!
            </p>
          </div>
        </div>

        {/* Emergency Adrenaline Clock */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-rose-500/40 text-xs font-mono">
          <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-slate-400">MASA KECEMASAN:</span>
          <span className={`font-black tracking-widest text-sm ${timerLeft < 30 ? 'text-rose-400 animate-ping' : 'text-amber-300'}`}>
            {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left: Interactive 3D Grid with Node Connections */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <CyberayaGrid3D
            selectedCoordinate={selectedCoord}
            animatedTarget={currentTarget ? currentTarget.coordinate : null}
            showRulerSteps={feedback.type === 'correct'}
            onSelectCoordinate={handleSelectCoord}
            isInteractive={feedback.type !== 'correct' && !isSuccess}
            gridOverlayText={
              isSuccess
                ? 'TERAS NAVIGASI BERJAYA DIPULIHKAN 100%'
                : `KUNCI SASARAN: ${currentTarget.name} (${currentTarget.coordinate[0]}, ${currentTarget.coordinate[1]})`
            }
          />
        </div>

        {/* Right: Target Briefing & Emergency Shield Progress */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-3">
          {!isSuccess ? (
            <>
              {/* Nodes Progress Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">
                  STATUS PENYAMBUNGAN PERISAI TERAS ({activatedNodes.length}/3)
                </span>
                <div className="space-y-1.5">
                  {FINAL_MISSION_TARGETS.map((t, idx) => {
                    const isDone = activatedNodes.some((c) => c[0] === t.coordinate[0] && c[1] === t.coordinate[1]);
                    const isCurrent = idx === targetIdx && !isDone;

                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition ${
                          isDone
                            ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                            : isCurrent
                            ? 'bg-rose-950/70 border-rose-500 text-rose-200 animate-pulse'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </div>
                          )}
                          <span className="font-bold">{t.name}</span>
                        </div>
                        <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                          ({t.coordinate[0]}, {t.coordinate[1]})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Active Mission Target */}
              <div className="p-4 rounded-xl bg-rose-950/50 border-2 border-rose-500/70 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold">
                    SASARAN KINI: {currentTarget.codeName}
                  </span>
                  <span className="text-xs font-black text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/50">
                    ({currentTarget.coordinate[0]}, {currentTarget.coordinate[1]})
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  Plotkan {currentTarget.name} pada grid!
                </h3>
                <p className="text-xs text-rose-200/80 mt-1 font-mono">
                  Petunjuk: {currentTarget.hint}
                </p>
              </div>

              {/* Action Button: Sahkan Sambungan */}
              {feedback.type !== 'correct' && (
                <button
                  onClick={handleConfirmNode}
                  disabled={!selectedCoord}
                  className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
                    selectedCoord
                      ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 text-slate-950 shadow-rose-500/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>
                    {selectedCoord
                      ? `SAMBUNGKAN NOD PADA (${selectedCoord[0]}, ${selectedCoord[1]})`
                      : 'PILIH TITIK PADA GRID TERLEBIH DAHULU'}
                  </span>
                </button>
              )}

              {/* Feedback Alert */}
              {feedback.type && (
                <div
                  className={`p-3 rounded-xl border-2 flex items-start gap-3 transition-all ${
                    feedback.type === 'correct'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}
                >
                  {feedback.type === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                    {feedback.message}
                  </div>
                </div>
              )}

              {/* Next Target Button */}
              {feedback.type === 'correct' && targetIdx < FINAL_MISSION_TARGETS.length - 1 && (
                <button
                  onClick={handleNextTarget}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>KUNCI NOD SETERUSNYA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Mission Complete Victory Trigger */
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-cyan-950/90 border-2 border-cyan-400 text-center space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  STATUS PEMULIHAN SISTEM: 100%
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  CYBERAYA TELAH DISELAMATKAN!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Sistem navigasi kembali pulih dan selamat. Ejen Ali dan Cikgu Ammar sangat berbangga dengan anda!
                </p>
              </div>

              <button
                onClick={() => onComplete(500)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 text-slate-950 font-black text-sm tracking-wider uppercase transition shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>LIHAT PENGANUGERAHAN LENCANA & MARKAH</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dialogue Box */}
      <div className="w-full max-w-4xl mx-auto mt-2">
        <DialogueBox
          speaker="ali"
          speakerName="Ejen Ali"
          text={
            isSuccess
              ? 'YAY! Kita berjaya selamatkan Cyberaya kawan-kawan! Koordinat memang hebat!'
              : `Kawan-kawan, mari bantu saya kunci koordinat (${currentTarget.coordinate[0]}, ${currentTarget.coordinate[1]})!`
          }
          speechText={
            isSuccess
              ? 'Yay! Kita berjaya selamatkan Cyberaya kawan-kawan! Koordinat memang hebat!'
              : `Kawan-kawan, mari bantu saya kunci koordinat ${currentTarget.coordinate[0]} koma ${currentTarget.coordinate[1]}!`
          }
          autoSpeak={false}
        />
      </div>
    </div>
  );
};
