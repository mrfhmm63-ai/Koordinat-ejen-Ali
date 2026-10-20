import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Mic, MicOff, RotateCcw, Home, Radio, Sparkles } from 'lucide-react';
import { sound } from '../services/soundEngine';
import { GameScene } from '../types/game';

interface NavbarProps {
  currentScene: GameScene;
  score: number;
  onNavigateHome: () => void;
  onRestartCurrent: () => void;
  onOpenThemeSong: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScene,
  score,
  onNavigateHome,
  onRestartCurrent,
  onOpenThemeSong,
}) => {
  const [muted, setMuted] = useState(sound.isSoundMuted());
  const [speechOn, setSpeechOn] = useState(sound.isSpeechOn());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  useEffect(() => {
    const unsub = sound.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsBgmPlaying(state.isBgmPlaying);
    });
    return unsub;
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.setMute(next);
  };

  const toggleSpeech = () => {
    const next = !speechOn;
    setSpeechOn(next);
    sound.setSpeechEnabled(next);
  };

  const toggleBgm = () => {
    if (isBgmPlaying) {
      sound.stopBGM();
    } else {
      sound.startBGM();
    }
  };

  const getSceneTitle = () => {
    switch (currentScene) {
      case 'title': return 'PANGKALAN M.A.T.A.';
      case 'story_intro': return 'AMARAN KOD MERAH: CYBERAYA';
      case 'map_hub': return 'PETA MISI CYBERAYA';
      case 'stage_1': return 'STAGE 1: AKTIFKAN PAKSI';
      case 'stage_2': return 'STAGE 2: BACA KOORDINAT';
      case 'stage_3': return 'STAGE 3: CARI & PLOT LOKASI';
      case 'final_mission': return 'MISI AKHIR: PEMULIHAN TERAS';
      case 'victory': return 'PENYELAMAT CYBERAYA';
      default: return 'MISI KOORDINAT';
    }
  };

  return (
    <header className="w-full bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/30 px-3 py-2 flex items-center justify-between z-30 select-none shadow-[0_4px_20px_rgba(6,182,212,0.15)]">
      {/* Brand & M.A.T.A. Badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onNavigateHome();
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition group cursor-pointer"
          title="Kembali ke Peta Misi"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-black text-[10px] text-white tracking-widest shadow-inner shadow-cyan-300">
            M
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-black tracking-wider text-cyan-400 uppercase leading-none">
              M.A.T.A. CYBERAYA
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              MATEMATIK TAHUN 5
            </div>
          </div>
        </button>

        {/* Scene Indicator */}
        <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span className="text-xs font-bold font-mono tracking-wide text-cyan-300 uppercase">
            {getSceneTitle()}
          </span>
        </div>
      </div>

      {/* Middle: Theme Song Button */}
      <button
        onClick={() => {
          sound.playSelect();
          onOpenThemeSong();
        }}
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-400/50 hover:border-amber-300 text-amber-300 hover:text-amber-200 transition text-xs font-bold tracking-wide shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        <span>LAGU TEMA KOORDINAT</span>
      </button>

      {/* Right: Score, Audio Toggles */}
      <div className="flex items-center gap-2">
        {/* Score HUD */}
        <div className="px-3 py-1 rounded bg-slate-900/90 border border-cyan-500/40 flex items-center gap-2 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">MARKAH:</span>
          <span className="text-sm font-black font-mono text-cyan-300 tracking-wider">
            {score.toString().padStart(4, '0')}
          </span>
        </div>

        {/* Voice activity badge */}
        {isSpeaking && (
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono animate-pulse">
            <Radio className="w-3 h-3 animate-spin" />
            <span>SUARA AKTIF</span>
          </div>
        )}

        {/* Audio controls */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          {/* Speech Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              toggleSpeech();
            }}
            className={`p-1.5 rounded transition cursor-pointer ${
              speechOn ? 'text-cyan-400 hover:bg-cyan-950/60' : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={speechOn ? 'Matikan Suara Dialog' : 'Hidupkan Suara Dialog'}
          >
            {speechOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              toggleBgm();
            }}
            className={`p-1.5 rounded transition cursor-pointer ${
              isBgmPlaying ? 'text-amber-400 hover:bg-amber-950/60' : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={isBgmPlaying ? 'Matikan Muzik Latar' : 'Mainkan Muzik Latar'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Master Mute Toggle */}
          <button
            onClick={() => {
              toggleMute();
            }}
            className={`p-1.5 rounded transition cursor-pointer ${
              !muted ? 'text-cyan-400 hover:bg-cyan-950/60' : 'text-rose-400 hover:bg-rose-950/60'
            }`}
            title={muted ? 'Buka Audio' : 'Bisu Semua'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation buttons */}
        {currentScene !== 'title' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                onRestartCurrent();
              }}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition cursor-pointer"
              title="Mula Semula Bahagian Ini"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateHome();
              }}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition cursor-pointer"
              title="Peta Misi Cyberaya"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
