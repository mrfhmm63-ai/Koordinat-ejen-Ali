import React, { useState, useEffect } from 'react';
import { STORY_INTRO_DIALOGUES } from '../data/cyberayaData';
import { DialogueBox } from './DialogueBox';
import { sound } from '../services/soundEngine';
import { AlertTriangle, ArrowRight, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface StoryIntroProps {
  onComplete: () => void;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentDialogue = STORY_INTRO_DIALOGUES[currentIdx];

  useEffect(() => {
    // Alert sound when story starts
    sound.playAlert();
  }, []);

  const handleNext = () => {
    if (currentIdx < STORY_INTRO_DIALOGUES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      sound.playMissionStart();
      onComplete();
    }
  };

  const handleSkip = () => {
    sound.playClick();
    sound.stopSpeaking();
    onComplete();
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-4 sm:p-6 bg-slate-950 overflow-hidden text-white select-none">
      {/* Background Animated Glitch City Hologram */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black">
        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Red emergency warning beacons */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Top Alert Bar */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/60 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
          <span className="text-xs font-black tracking-wider text-rose-300 font-mono">
            STATUS: SISTEM NAVIGASI CYBERAYA TERGANGGU
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-cyan-300 underline font-mono transition cursor-pointer"
        >
          Langkau Cerita »
        </button>
      </div>

      {/* Center Visual: The Corrupted Cyberaya Holographic Core */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-rose-500/80 flex items-center justify-center animate-spin" style={{ animationDuration: '24s' }}>
          {/* Inner ring */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-400/60 flex items-center justify-center animate-spin" style={{ animationDirection: 'reverse', animationDuration: '16s' }}>
            <Cpu className="w-12 h-12 text-rose-400 animate-pulse" />
          </div>

          {/* Coordinate glitch artifacts */}
          <span className="absolute -top-3 bg-rose-900 text-rose-200 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-400 animate-pulse">
            ERR: [X: ?, Y: ?]
          </span>
          <span className="absolute -bottom-3 bg-cyan-900 text-cyan-200 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-400">
            KOORDINAT TERPUTUS
          </span>
        </div>

        {/* Story Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {STORY_INTRO_DIALOGUES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                  : idx < currentIdx
                  ? 'w-4 bg-cyan-700'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Dialogue Box */}
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <DialogueBox
          key={currentDialogue.id}
          speaker={currentDialogue.speaker}
          speakerName={currentDialogue.speakerName}
          text={currentDialogue.text}
          speechText={currentDialogue.speechText}
          emotion={currentDialogue.emotion}
          onNext={handleNext}
          nextLabel={currentIdx === STORY_INTRO_DIALOGUES.length - 1 ? 'MASUK PETA CYBERAYA' : 'TERUSKAN'}
          autoSpeak={true}
        />
      </div>
    </div>
  );
};
