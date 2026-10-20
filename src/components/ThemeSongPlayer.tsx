import React, { useState, useEffect } from 'react';
import { Play, Square, Sparkles, X, Volume2, Music } from 'lucide-react';
import { sound } from '../services/soundEngine';

interface ThemeSongPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSongPlayer: React.FC<ThemeSongPlayerProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);

  const lyrics = [
    { text: "Jom kita teroka Cyberaya!", sub: "Misi bermula bersama Ejen Ali & Cikgu Ammar!", duration: 3000 },
    { text: "Paksi-X mendatar, kiri ke kanan!", sub: "Garis mengufuk dibaca dahulu dari asalan!", duration: 3500 },
    { text: "Paksi-Y menegak, bawah ke atas!", sub: "Garis mencancang dibaca selepas nilai X!", duration: 3500 },
    { text: "Mula di Asalan, sifar-sifar (0,0)!", sub: "Titik temu dua paksi, titik permulaan!", duration: 3500 },
    { text: "Nilai X dahulu, barulah Y!", sub: "Tulis dalam kurungan: Pasangan Tertib (x, y)!", duration: 4500 },
    { text: "Ejen Cyberaya, misi berjaya!", sub: "Sistem selamat, kita ejen koordinat terunggul!", duration: 4000 },
  ];

  useEffect(() => {
    const unsub = sound.subscribe((state) => {
      setIsPlaying(state.isThemeSongPlaying);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let timer: number | null = null;
    if (isPlaying) {
      let currentIdx = 0;
      setActiveLineIdx(0);

      const step = () => {
        if (currentIdx < lyrics.length - 1) {
          timer = window.setTimeout(() => {
            currentIdx++;
            setActiveLineIdx(currentIdx);
            step();
          }, lyrics[currentIdx].duration);
        }
      };
      step();
    } else {
      setActiveLineIdx(0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      sound.stopThemeSong();
      setIsPlaying(false);
    } else {
      sound.playThemeSong(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 border-2 border-amber-400/80 p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-white">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            if (isPlaying) sound.stopThemeSong();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md">
            <Music className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-wider text-amber-300 uppercase">
                Lagu Tema Koordinat Cyberaya
              </h3>
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Melodi Ceria & Lirik Hafalan Matematik Tahun 5
            </p>
          </div>
        </div>

        {/* Visualizer audio bars */}
        <div className="flex items-end justify-center gap-1.5 h-14 bg-slate-950/80 rounded-xl border border-amber-500/30 p-2 mb-4 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 rounded-t-sm transition-all duration-150 ${
                isPlaying ? 'bg-gradient-to-t from-amber-500 to-yellow-300' : 'bg-slate-800 h-2'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, ((i * 19 + (activeLineIdx * 25)) % 85) + 15)}%` : '8px',
              }}
            />
          ))}
        </div>

        {/* Karaoke Lyrics Display */}
        <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
          {lyrics.map((item, idx) => {
            const isCurrent = isPlaying && activeLineIdx === idx;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm sm:text-base font-black ${isCurrent ? 'text-amber-200' : 'text-slate-300'}`}>
                    {item.text}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      SEDANG MENYANYI
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {item.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            {isPlaying ? '🎵 Lagu & Vokal Sedang Dimainkan...' : 'Tekan Butang untuk Mulakan Lagu'}
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase transition cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-400/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>HENTIKAN</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>MAINKAN LAGU TEMA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
