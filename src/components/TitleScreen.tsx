import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2, Shield } from 'lucide-react';
import { sound } from '../services/soundEngine';

interface TitleScreenProps {
  onStartMission: () => void;
  onOpenThemeSong: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartMission,
  onOpenThemeSong,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const unsub = sound.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return unsub;
  }, []);

  const handleStart = () => {
    sound.initAudioContext();
    sound.playMissionStart();
    sound.startBGM();
    onStartMission();
  };

  const handleDialogueVoice = () => {
    sound.initAudioContext();
    sound.speak(
      "Jom kita mulakan misi! Kita perlu memulihkan Peta Cyberaya menggunakan kemahiran koordinat.",
      "ali"
    );
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Hero Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/Untitled__Website__20261021_015416_0000_b23b49a1.png"
          alt="Peta Cyberaya: Misi Koordinat"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle tech ambient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />
      </div>

      {/* Top Banner HUD */}
      <header className="relative z-10 w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">M.A.T.A. CYBERAYA</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-semibold">MATEMATIK TAHUN 5: KOORDINAT</span>
        </div>

        {/* Theme Song Quick Launcher */}
        <button
          onClick={() => {
            sound.initAudioContext();
            sound.playSelect();
            onOpenThemeSong();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-400/70 text-amber-300 hover:text-amber-200 transition text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
          <span>LAGU TEMA KOORDINAT</span>
        </button>
      </header>

      {/* Interactive Floating "MULA MISI" Button (Positioned on the right side) */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-end px-6 sm:px-12 md:px-16 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-3 max-w-sm mt-8 sm:mt-16 mr-0 sm:mr-4 md:mr-8">
          {/* Main Gadget Button Container with Animated Rings */}
          <div className="relative group">
            {/* Outer IRIS Energy Wave Pulse (Expands on hover) */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-yellow-400 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse group-hover:scale-110 pointer-events-none" />

            {/* Rotating Cyber Brackets (Tech Reticle) on Hover */}
            <div className="absolute -inset-3 rounded-full border border-cyan-400/0 group-hover:border-cyan-400/80 border-dashed animate-spin transition-all duration-500 pointer-events-none" style={{ animationDuration: '10s' }} />

            <button
              onClick={handleStart}
              onMouseEnter={() => sound.playSelect()}
              className="relative flex items-center justify-between gap-4 sm:gap-6 px-7 sm:px-10 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xl sm:text-2xl tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.8),0_0_70px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_60px_rgba(245,158,11,1),0_0_90px_rgba(6,182,212,0.8)] transform group-hover:scale-110 active:scale-95 transition-all duration-300 border-2 sm:border-3 border-white ring-2 ring-amber-300/50 group-hover:ring-4 group-hover:ring-cyan-300 cursor-pointer overflow-hidden"
            >
              {/* Play Circle Gadget Icon */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover:bg-gradient-to-tr group-hover:from-slate-950 group-hover:to-cyan-950 border border-amber-400/50 group-hover:border-cyan-400 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 group-hover:fill-cyan-300 group-hover:text-cyan-300 translate-x-0.5 transition-colors" />
              </div>

              {/* Glowing Button Label */}
              <span className="font-black tracking-wider text-slate-950 group-hover:text-slate-900 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]">
                MULA MISI
              </span>

              {/* Animated Chevrons */}
              <span className="text-amber-950 group-hover:text-cyan-950 font-black text-2xl sm:text-3xl group-hover:translate-x-2 transition-transform duration-300">
                »
              </span>

              {/* High-speed Laser Sweep Effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700" />
              </div>
            </button>
          </div>

          {/* Subtitle Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">KLIK UNTUK MENGAKTIFKAN AUDIO & MISI</span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Dialogue Audio Area (Synchronized with artwork's bottom-left speech bubble) */}
      <footer className="relative z-10 w-full p-4 flex items-end justify-between pointer-events-none">
        {/* Interactive hotspot covering the dialogue box in the image */}
        <div
          onClick={handleDialogueVoice}
          className="pointer-events-auto cursor-pointer group relative max-w-sm sm:max-w-md p-2 rounded-2xl transition hover:ring-2 hover:ring-cyan-400/60"
          title="Klik untuk dengar suara Ejen Ali"
        >
          {/* Subtle audio indicator chip on hover or when speaking */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-sm border border-cyan-500/50 text-[11px] font-mono text-cyan-300 shadow group-hover:border-cyan-300 transition">
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-cyan-400' : 'text-slate-400'}`} />
            <span>{isSpeaking ? 'EJEN ALI SEDANG BERCAKAP...' : 'KLIK UNTUK DENGAR SUARA ALI'}</span>
          </div>
        </div>

        {/* Learning Standard Tag at bottom right */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="text-cyan-400">KSSR Semakan</span>
          <span>•</span>
          <span>Matematik Tahun 5</span>
          <span>•</span>
          <span className="text-yellow-400 font-bold">3 Stage + Misi Akhir</span>
        </div>
      </footer>
    </div>
  );
};
