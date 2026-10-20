import React, { useEffect, useState } from 'react';
import { Volume2, ChevronRight, User, Bot, GraduationCap, AlertTriangle } from 'lucide-react';
import { CharacterId } from '../types/game';
import { sound } from '../services/soundEngine';

interface DialogueBoxProps {
  speaker: CharacterId;
  speakerName: string;
  text: string;
  speechText?: string;
  emotion?: 'curious' | 'happy' | 'determined' | 'confused' | 'mentor' | 'alert';
  onNext?: () => void;
  nextLabel?: string;
  autoSpeak?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  speakerName,
  text,
  speechText,
  emotion,
  onNext,
  nextLabel = 'TERUSKAN',
  autoSpeak = true,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = sound.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (autoSpeak) {
      sound.speak(speechText || text, speaker);
    }
    return () => {
      // Don't cut off if transitioning smoothly unless needed
    };
  }, [text, speechText, speaker, autoSpeak]);

  const handleReplay = () => {
    sound.speak(speechText || text, speaker);
  };

  const getSpeakerStyle = () => {
    switch (speaker) {
      case 'ali':
        return {
          borderColor: 'border-red-500/80',
          bgColor: 'bg-red-950/40',
          badgeBg: 'bg-red-600',
          textColor: 'text-red-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
          avatarBg: 'bg-gradient-to-tr from-red-600 to-rose-400',
          icon: <User className="w-5 h-5 text-white" />,
        };
      case 'ammar':
        return {
          borderColor: 'border-cyan-500/80',
          bgColor: 'bg-cyan-950/40',
          badgeBg: 'bg-cyan-600',
          textColor: 'text-cyan-400',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
          avatarBg: 'bg-gradient-to-tr from-cyan-600 to-blue-400',
          icon: <GraduationCap className="w-5 h-5 text-white" />,
        };
      case 'comot':
        return {
          borderColor: 'border-amber-500/80',
          bgColor: 'bg-amber-950/40',
          badgeBg: 'bg-amber-600',
          textColor: 'text-amber-400',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
          avatarBg: 'bg-gradient-to-tr from-amber-500 to-yellow-300',
          icon: <Bot className="w-5 h-5 text-white" />,
        };
      default:
        return {
          borderColor: 'border-rose-500/80',
          bgColor: 'bg-rose-950/40',
          badgeBg: 'bg-rose-600',
          textColor: 'text-rose-400',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          avatarBg: 'bg-gradient-to-tr from-rose-600 to-red-500',
          icon: <AlertTriangle className="w-5 h-5 text-white" />,
        };
    }
  };

  const style = getSpeakerStyle();

  return (
    <div className={`relative w-full rounded-xl border-2 ${style.borderColor} ${style.bgColor} ${style.glow} backdrop-blur-md p-3.5 transition-all duration-300`}>
      {/* Sci-Fi Corner Accents */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white pointer-events-none" />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white pointer-events-none" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white pointer-events-none" />
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white pointer-events-none" />

      <div className="flex items-start gap-3.5">
        {/* Character Avatar with Speaking Indicator */}
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-xl ${style.avatarBg} p-0.5 flex items-center justify-center shadow-lg border border-white/30 overflow-hidden`}>
            {/* Visual character representations */}
            {speaker === 'ali' ? (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xl">🕶️</span>
                <span className="text-[8px] font-black text-white tracking-tighter -mt-1">ALI</span>
              </div>
            ) : speaker === 'ammar' ? (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xl">👨‍🏫</span>
                <span className="text-[8px] font-black text-white tracking-tighter -mt-1">CIKGU</span>
              </div>
            ) : speaker === 'comot' ? (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xl">🤖</span>
                <span className="text-[8px] font-black text-white tracking-tighter -mt-1">COMOT</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xl">⚠️</span>
                <span className="text-[8px] font-black text-white tracking-tighter -mt-1">SISTEM</span>
              </div>
            )}
          </div>

          {/* Speaking Audio Wave Pulse Animation */}
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 bg-slate-950 px-1 py-0.5 rounded-full border border-cyan-400">
              <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Content & Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-black tracking-wider text-white uppercase ${style.badgeBg} shadow-sm`}>
                {speakerName}
              </span>
              {emotion && (
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  [{emotion}]
                </span>
              )}
            </div>

            {/* Replay Voice Button */}
            <button
              onClick={handleReplay}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-mono transition cursor-pointer"
              title="Ulang Suara Dialog"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">ULANG SUARA</span>
            </button>
          </div>

          {/* Subtitle Dialogue Text */}
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow">
            {text}
          </p>

          {/* Forward Button if provided */}
          {onNext && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  onNext();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <span>{nextLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
