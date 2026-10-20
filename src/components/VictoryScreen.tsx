import React, { useState, useEffect } from 'react';
import { VICTORY_DIALOGUES } from '../data/cyberayaData';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { Award, Star, Trophy, RotateCcw, Download, Sparkles, ShieldCheck, CheckCircle2, User } from 'lucide-react';

interface VictoryScreenProps {
  score: number;
  stageProgress: {
    stage1Stars: number;
    stage2Stars: number;
    stage3Stars: number;
  };
  onPlayAgain: () => void;
  onOpenThemeSong: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  stageProgress,
  onPlayAgain,
  onOpenThemeSong,
}) => {
  const [playerName, setPlayerName] = useState<string>('Ejen Pintar');
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  useEffect(() => {
    sound.playVictoryFanfare();

    // Multistage celebratory confetti
    const end = Date.now() + 3 * 1000;
    const colors = ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const totalStars = stageProgress.stage1Stars + stageProgress.stage2Stars + stageProgress.stage3Stars;
  const currentDialogue = VICTORY_DIALOGUES[dialogueIdx];

  const handleNextDialogue = () => {
    if (dialogueIdx < VICTORY_DIALOGUES.length - 1) {
      setDialogueIdx(dialogueIdx + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-4 sm:p-6 bg-slate-950 text-white overflow-y-auto select-none print:bg-white print:text-black">
      {/* Background Cyber City Celebration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-black pointer-events-none print:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* Header Congratulations */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-1 mb-3 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>MISI KOORDINAT SELESAI DENGAN JAYA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-cyan-300 uppercase">
          CYBERAYA TELAH SELAMAT!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Terima kasih Ejen! Berkat kemahiran Koordinat Matematik Tahun 5 anda, sistem bandar kembali beroperasi dengan sempurna.
        </p>
      </div>

      {/* Official M.A.T.A. Certificate & Agent Badge Card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-blue-950/95 border-3 border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.3)] print:border-black print:shadow-none print:text-black">
        {/* Certificate Watermark / Hologram Badge */}
        <div className="flex items-center justify-between border-b-2 border-amber-400/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                SIJIL PENGHARGAAN RASMI M.A.T.A.
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white print:text-black">
                EJEN KOORDINAT TAHAP ELIT
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">KOD SIJIL:</span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              CYB-COORD-2026
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 text-center my-4">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Dengan ini diperakui bahawa
          </p>

          {/* Editable Agent Name */}
          <div className="inline-flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border-2 border-cyan-400 shadow-inner max-w-xs mx-auto">
            <User className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Masukkan Nama Ejen Anda"
              className="bg-transparent text-base sm:text-lg font-black text-center text-yellow-300 focus:outline-none w-full"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
            telah berjaya menguasai <strong className="text-white">Paksi-X Mendatar</strong>, <strong className="text-white">Paksi-Y Menegak</strong>, <strong className="text-white">Titik Asalan (0,0)</strong>, serta <strong className="text-white">Pasangan Tertib (x,y)</strong> dalam kurikulum Matematik Tahun 5.
          </p>

          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30">
              <span className="text-[10px] font-mono text-slate-400 block">JUMLAH MARKAH</span>
              <span className="text-lg font-black text-cyan-300 font-mono">{score}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-yellow-500/30">
              <span className="text-[10px] font-mono text-slate-400 block">BINTANG MISI</span>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-base font-black text-yellow-400 font-mono">{totalStars}/9</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-slate-400 block">STATUS MISI</span>
              <span className="text-sm font-black text-emerald-400 font-mono uppercase">100% PULIH</span>
            </div>
          </div>
        </div>

        {/* Certificate Signatures */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-amber-400/40 text-xs font-mono text-slate-400">
          <div className="text-left">
            <div className="font-bold text-white">CIKGU AMMAR</div>
            <div className="text-[10px] text-cyan-400">Mentor Matematik Cyberaya</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border border-amber-400/60 mx-auto flex items-center justify-center text-[8px] font-bold text-amber-400 rotate-12">
              M.A.T.A.
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white">EJEN ALI</div>
            <div className="text-[10px] text-rose-400">Ejen Tekno Utama</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-600 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>CETAK / SIMPAN SIJIL</span>
        </button>

        <button
          onClick={() => {
            sound.playSelect();
            onOpenThemeSong();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/50 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>DENGAR LAGU TEMA</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>MAIN SEMULA MISI</span>
        </button>
      </div>

      {/* Victory Dialogue Box */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-4 print:hidden">
        <DialogueBox
          key={currentDialogue.id}
          speaker={currentDialogue.speaker}
          speakerName={currentDialogue.speakerName}
          text={currentDialogue.text}
          speechText={currentDialogue.speechText}
          emotion={currentDialogue.emotion}
          onNext={dialogueIdx < VICTORY_DIALOGUES.length - 1 ? handleNextDialogue : undefined}
          nextLabel="DIALOG SETERUSNYA"
          autoSpeak={true}
        />
      </div>
    </div>
  );
};
