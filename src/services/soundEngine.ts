/**
 * Sound & Voice Engine for PETA CYBERAYA: MISI KOORDINAT
 * Features:
 * - Real Malay Speech Synthesis with per-character pitch/rate
 * - Cyberpunk Web Audio API synthesized SFX & futuristic BGM
 * - Coordinate Theme Song with beat generator
 * - Volume ducking during voiceover
 */

import { CharacterId } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private bgmVolume: number = 0.35;
  private speechEnabled: boolean = true;
  private isSpeaking: boolean = false;
  private lastSpokenText: string = '';
  private lastSpeaker: CharacterId = 'ammar';
  private bgmIntervalId: number | null = null;
  private isBgmPlaying: boolean = false;
  private isThemeSongPlaying: boolean = false;
  private listeners: Set<(state: { isSpeaking: boolean; isBgmPlaying: boolean; isThemeSongPlaying: boolean }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Warm up voices
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.getPreferredVoice();
        };
      }
    }
  }

  public subscribe(cb: (state: { isSpeaking: boolean; isBgmPlaying: boolean; isThemeSongPlaying: boolean }) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb({
      isSpeaking: this.isSpeaking,
      isBgmPlaying: this.isBgmPlaying,
      isThemeSongPlaying: this.isThemeSongPlaying
    }));
  }

  public initAudioContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (mute) {
      this.stopSpeaking();
      this.stopBGM();
      this.stopThemeSong();
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setBgmVolume(vol: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
  }

  public setSpeechEnabled(enabled: boolean): void {
    this.speechEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public isSpeechOn(): boolean {
    return this.speechEnabled;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  // --- SPEECH SYNTHESIS (Bahasa Melayu / Malaysian Malay) ---
  private getPreferredVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Malay (Malaysia), then standard Malay, then Indonesian as natural Austronesian phonetics match
    const msVoice = voices.find(v => v.lang.toLowerCase() === 'ms-my' || v.lang.toLowerCase().startsWith('ms'));
    if (msVoice) return msVoice;
    const idVoice = voices.find(v => v.lang.toLowerCase() === 'id-id' || v.lang.toLowerCase().startsWith('id'));
    if (idVoice) return idVoice;
    return voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0] || null;
  }

  public speak(text: string, speaker: CharacterId = 'ammar', onEnd?: () => void): void {
    this.lastSpokenText = text;
    this.lastSpeaker = speaker;

    if (this.isMuted || !this.speechEnabled) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playTalkBeep(speaker);
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    // Cancel existing
    window.speechSynthesis.cancel();

    // Clean text for speech
    const cleanText = text
      .replace(/\(x, y\)/g, 'x koma y')
      .replace(/\(0, 0\)/g, 'sifar koma sifar')
      .replace(/\(0,0\)/g, 'sifar koma sifar')
      .replace(/\((\d+),\s*(\d+)\)/g, '$1 koma $2')
      .replace(/Paksi-X/g, 'Paksi X')
      .replace(/Paksi-Y/g, 'Paksi Y')
      .replace(/M\.A\.T\.A\./g, 'MATA');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = this.getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'ms-MY';
    }

    // Voice characterization
    if (speaker === 'ali') {
      utterance.pitch = 1.35; // Energetic, youthful hero
      utterance.rate = 1.08;
    } else if (speaker === 'ammar') {
      utterance.pitch = 0.95; // Warm, authoritative teacher
      utterance.rate = 0.95;
    } else if (speaker === 'comot') {
      utterance.pitch = 1.6;  // Playful high-pitch robotic companion
      utterance.rate = 1.2;
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
    }

    utterance.volume = 1.0;

    this.isSpeaking = true;
    this.notify();

    // Play initial tech chirp for dialogue start
    this.playDialogueChirp(speaker);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    }
  }

  public repeatLastSpoken(): void {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, this.lastSpeaker);
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  // --- SOUND EFFECTS (Web Audio API Synthesizer) ---

  public playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.2, startDelay: number = 0): void {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

    const effectiveGain = gainVal * this.sfxVolume;
    gain.gain.setValueAtTime(effectiveGain, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startDelay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration);
  }

  public playAlert(): void {
    this.playTone(330, 'sawtooth', 0.25, 0.2);
    setTimeout(() => this.playTone(440, 'sawtooth', 0.35, 0.25), 180);
  }

  public playClick(): void {
    this.playTone(880, 'sine', 0.06, 0.15);
  }

  public playSelect(): void {
    this.playTone(660, 'triangle', 0.08, 0.2);
    this.playTone(990, 'sine', 0.1, 0.25, 0.04);
  }

  public playCorrect(): void {
    if (this.isMuted) return;
    // Cyber triumphant chime: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.28, 0.3, idx * 0.08);
      this.playTone(freq * 2, 'sine', 0.18, 0.15, idx * 0.08 + 0.02);
    });
  }

  public playWrong(): void {
    if (this.isMuted) return;
    // Glitch buzz: Low saw descent
    this.initAudioContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  public playScan(): void {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  public playLockCoordinate(): void {
    // Hologram target lock
    this.playTone(1200, 'square', 0.05, 0.12);
    this.playTone(1800, 'sine', 0.1, 0.2, 0.06);
  }

  public playAxisActive(): void {
    this.playTone(440, 'sine', 0.15, 0.2);
    this.playTone(880, 'triangle', 0.2, 0.25, 0.08);
  }

  public playOriginPulse(): void {
    this.playTone(330, 'triangle', 0.2, 0.25);
    this.playTone(550, 'sine', 0.25, 0.3, 0.05);
    this.playTone(1100, 'sine', 0.3, 0.2, 0.1);
  }

  public playMissionStart(): void {
    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((freq, idx) => {
      this.playTone(freq, 'sawtooth', 0.4, 0.15, idx * 0.05);
      this.playTone(freq * 1.5, 'sine', 0.35, 0.1, idx * 0.05);
    });
  }

  public playVictoryFanfare(): void {
    const melody = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5, 1318.51];
    melody.forEach((f, i) => {
      this.playTone(f, 'triangle', 0.35, 0.25, i * 0.12);
    });
  }

  public playComotPurr(): void {
    this.playTone(900, 'sine', 0.08, 0.18);
    this.playTone(1200, 'sine', 0.1, 0.22, 0.06);
    this.playTone(1600, 'triangle', 0.14, 0.2, 0.12);
  }

  private playTalkBeep(speaker: CharacterId): void {
    const pitch = speaker === 'ali' ? 680 : speaker === 'ammar' ? 440 : 920;
    this.playTone(pitch, 'sine', 0.08, 0.15);
  }

  private playDialogueChirp(speaker: CharacterId): void {
    const baseFreq = speaker === 'ali' ? 700 : speaker === 'ammar' ? 480 : 950;
    this.playTone(baseFreq, 'sine', 0.05, 0.08);
    this.playTone(baseFreq * 1.25, 'triangle', 0.07, 0.06, 0.04);
  }

  // --- FUTURISTIC CYBERAYA BGM (Synthesizer Loop) ---
  public startBGM(): void {
    if (this.isBgmPlaying || this.isMuted) return;
    this.initAudioContext();
    this.isBgmPlaying = true;
    this.notify();

    // Chord progression in Cyberaya style: Am - F - C - G
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [261.63, 329.63, 392], // C
      [196, 246.94, 293.66], // G
    ];

    let step = 0;
    const beatTime = 600; // ~100 bpm

    this.bgmIntervalId = window.setInterval(() => {
      if (this.isMuted || !this.isBgmPlaying || !this.ctx) return;
      if (this.isThemeSongPlaying) return; // Do not overlap with song

      const volumeMultiplier = this.isSpeaking ? 0.25 : 1.0; // Ducking!
      const currentChord = chords[step % chords.length];

      // Play soft bass
      this.playTone(currentChord[0] / 2, 'sawtooth', 0.45, 0.06 * this.bgmVolume * volumeMultiplier);

      // Play arpeggiated synth
      const noteIdx = (step * 2) % currentChord.length;
      this.playTone(currentChord[noteIdx] * 2, 'sine', 0.22, 0.04 * this.bgmVolume * volumeMultiplier);

      // Hi-hat pulse on every beat
      this.playTone(3200, 'triangle', 0.02, 0.015 * this.bgmVolume * volumeMultiplier);

      step++;
    }, beatTime);
  }

  public stopBGM(): void {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
    this.notify();
  }

  // --- LAGU TEMA KOORDINAT CYBERAYA (Catchy Melody & Vocal Song) ---
  public playThemeSong(onComplete?: () => void): void {
    if (this.isMuted) return;
    this.initAudioContext();
    this.stopThemeSong();
    this.isThemeSongPlaying = true;
    this.notify();

    // Sing/recite coordinate theme song lyrics in Malay with timed audio!
    const lyricsData = [
      { text: "Jom kita teroka Cyberaya!", time: 0, speaker: 'ali' as CharacterId },
      { text: "Paksi-X mendatar, kiri ke kanan!", time: 3000, speaker: 'ammar' as CharacterId },
      { text: "Paksi-Y menegak, bawah ke atas!", time: 6500, speaker: 'ammar' as CharacterId },
      { text: "Mula di Asalan, sifar-sifar!", time: 10000, speaker: 'ali' as CharacterId },
      { text: "Nilai X dahulu, barulah Y! Kuasai koordinat!", time: 13500, speaker: 'ammar' as CharacterId },
      { text: "Ejen Cyberaya, misi berjaya!", time: 18000, speaker: 'ali' as CharacterId },
    ];

    // Melodic synth notes playing energetic upbeat 4/4 rhythm
    const melodyNotes = [
      { f: 523.25, t: 0 }, { f: 587.33, t: 250 }, { f: 659.25, t: 500 }, { f: 783.99, t: 750 },
      { f: 659.25, t: 1000 }, { f: 783.99, t: 1250 }, { f: 1046.5, t: 1500 }, { f: 880, t: 2000 },
      // bar 2
      { f: 440, t: 3000 }, { f: 523.25, t: 3300 }, { f: 659.25, t: 3600 }, { f: 587.33, t: 4000 },
      { f: 523.25, t: 4500 }, { f: 659.25, t: 5000 }, { f: 783.99, t: 5500 },
      // bar 3
      { f: 659.25, t: 6500 }, { f: 783.99, t: 6800 }, { f: 880, t: 7200 }, { f: 1046.5, t: 7600 },
      { f: 880, t: 8000 }, { f: 783.99, t: 8500 }, { f: 659.25, t: 9000 },
      // bar 4
      { f: 523.25, t: 10000 }, { f: 523.25, t: 10400 }, { f: 659.25, t: 10800 }, { f: 783.99, t: 11200 },
      { f: 880, t: 11800 }, { f: 1046.5, t: 12400 },
      // bar 5
      { f: 1046.5, t: 13500 }, { f: 1174.66, t: 14000 }, { f: 1318.51, t: 14500 }, { f: 1046.5, t: 15200 },
      // finish
      { f: 783.99, t: 18000 }, { f: 880, t: 18400 }, { f: 1046.5, t: 18800 }, { f: 1318.51, t: 19400 }
    ];

    melodyNotes.forEach(m => {
      setTimeout(() => {
        if (!this.isThemeSongPlaying || this.isMuted) return;
        this.playTone(m.f, 'sine', 0.22, 0.18 * this.bgmVolume);
        this.playTone(m.f / 2, 'triangle', 0.28, 0.12 * this.bgmVolume);
      }, m.t);
    });

    // Schedule voice singing/recitation
    lyricsData.forEach(line => {
      setTimeout(() => {
        if (!this.isThemeSongPlaying || this.isMuted) return;
        this.speak(line.text, line.speaker);
      }, line.time);
    });

    setTimeout(() => {
      this.isThemeSongPlaying = false;
      this.notify();
      if (onComplete) onComplete();
    }, 22000);
  }

  public stopThemeSong(): void {
    this.isThemeSongPlaying = false;
    this.stopSpeaking();
    this.notify();
  }

  public isSongPlaying(): boolean {
    return this.isThemeSongPlaying;
  }
}

export const sound = new SoundEngine();
