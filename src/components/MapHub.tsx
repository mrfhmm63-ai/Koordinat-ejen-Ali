import React, { useEffect } from 'react';
import { GameScene } from '../types/game';
import { sound } from '../services/soundEngine';
import { Sparkles, Lock, Star, ChevronRight, CheckCircle2, ShieldCheck, Flame, Compass, Crosshair, Map } from 'lucide-react';

interface MapHubProps {
  stageProgress: {
    stage1Complete: boolean;
    stage2Complete: boolean;
    stage3Complete: boolean;
    finalMissionComplete: boolean;
    stage1Stars: number;
    stage2Stars: number;
    stage3Stars: number;
  };
  onSelectScene: (scene: GameScene) => void;
  onOpenThemeSong: () => void;
}

export const MapHub: React.FC<MapHubProps> = ({
  stageProgress,
  onSelectScene,
  onOpenThemeSong,
}) => {
  useEffect(() => {
    sound.speak(
      "Selamat datang ke Peta Cyberaya! Pilih mana-mana stage untuk memulihkan sistem koordinat bandar.",
      "ammar"
    );
  }, []);

  const stages = [
    {
      id: 'stage_1' as GameScene,
      title: 'STAGE 1: AKTIFKAN PAKSI',
      desc: 'Kenal pasti Paksi-X (mendatar), Paksi-Y (menegak) dan Titik Asalan (0,0).',
      unlocked: true,
      completed: stageProgress.stage1Complete,
      stars: stageProgress.stage1Stars,
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      accentColor: 'from-cyan-600 to-blue-700',
      borderColor: 'border-cyan-500/60',
      badge: 'ASAS KOORDINAT',
    },
    {
      id: 'stage_2' as GameScene,
      title: 'STAGE 2: BACA KOORDINAT',
      desc: 'Fahami pasangan tertib (x, y). Bergerak mengikut X dahulu, kemudian Y!',
      unlocked: true, // Allow direct access or linear
      completed: stageProgress.stage2Complete,
      stars: stageProgress.stage2Stars,
      icon: <Crosshair className="w-6 h-6 text-emerald-400" />,
      accentColor: 'from-emerald-600 to-teal-700',
      borderColor: 'border-emerald-500/60',
      badge: 'PASANGAN TERTIB (X,Y)',
    },
    {
      id: 'stage_3' as GameScene,
      title: 'STAGE 3: CARI & PLOT LOKASI',
      desc: 'Cari lokasi berdasarkan koordinat dan plot titik pada grid interaktif.',
      unlocked: true,
      completed: stageProgress.stage3Complete,
      stars: stageProgress.stage3Stars,
      icon: <Map className="w-6 h-6 text-amber-400" />,
      accentColor: 'from-amber-600 to-orange-700',
      borderColor: 'border-amber-500/60',
      badge: 'PLOTTING MERCU TANDA',
    },
  ];

  const allStagesCompleted = stageProgress.stage1Complete && stageProgress.stage2Complete && stageProgress.stage3Complete;

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-4 sm:p-6 bg-slate-950 text-white overflow-y-auto select-none">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-slate-950 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-cyan-300 uppercase">
              PETA MISI CYBERAYA
            </h2>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-400">
              SEKTOR UTAMA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Pilih stage di bawah untuk memulihkan koordinat sektor bandar.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playSelect();
            onOpenThemeSong();
          }}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>LAGU TEMA KOORDINAT</span>
        </button>
      </div>

      {/* Stages Grid (3 Main Stages) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {stages.map((stage) => {
          return (
            <div
              key={stage.id}
              onClick={() => {
                sound.playSelect();
                onSelectScene(stage.id);
              }}
              className={`relative rounded-2xl p-5 border-2 ${stage.borderColor} bg-slate-900/80 backdrop-blur-md hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between group overflow-hidden`}
            >
              {/* Glowing header banner */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-700/80 group-hover:border-white/50 transition">
                  {stage.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    {stage.badge}
                  </span>
                  {/* Stars Display */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stage.stars
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_#facc15]'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black tracking-wide text-white group-hover:text-cyan-300 transition mb-1">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 font-medium leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {/* Status and Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {stage.completed ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SELESAI ({stage.stars}/3 BINTANG)
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-cyan-400">
                    SEDIA UNTUK MISI
                  </span>
                )}

                <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MISI AKHIR BANNER (Ultimate Mission) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div
          onClick={() => {
            if (allStagesCompleted) {
              sound.playMissionStart();
              onSelectScene('final_mission');
            } else {
              sound.playWrong();
              sound.speak('Selesaikan ketiga-tiga stage dahulu untuk membuka Misi Akhir!', 'ammar');
            }
          }}
          className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
            allStagesCompleted
              ? 'bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-amber-950/80 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-[1.01]'
              : 'bg-slate-950/60 border-slate-800 opacity-75'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`p-3 rounded-xl ${allStagesCompleted ? 'bg-rose-600 text-white shadow-lg animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                {allStagesCompleted ? <Flame className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
                    CABARAN TERAKHIR
                  </span>
                  {allStagesCompleted && (
                    <span className="bg-rose-500/30 text-rose-300 border border-rose-400/50 text-[10px] font-mono px-2 py-0.5 rounded animate-pulse">
                      TERBUKA SEKARANG!
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-wider text-white">
                  MISI AKHIR: PULIHKAN SISTEM NAVIGASI CYBERAYA
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {allStagesCompleted
                    ? 'Gunakan semua kemahiran koordinat untuk menyambungkan 3 nod frekuensi dan selamatkan bandar!'
                    : 'Kunci: Lengkapkan Stage 1, Stage 2, dan Stage 3 untuk mengaktifkan Misi Akhir ini.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {allStagesCompleted ? (
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer">
                  <span>SERTAI MISI AKHIR</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>TERKUNCI</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
