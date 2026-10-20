import React, { useState } from 'react';
import { GameScene } from './types/game';
import { Navbar } from './components/Navbar';
import { TitleScreen } from './components/TitleScreen';
import { StoryIntro } from './components/StoryIntro';
import { MapHub } from './components/MapHub';
import { Stage1AktifkanPaksi } from './components/Stage1AktifkanPaksi';
import { Stage2BacaKoordinat } from './components/Stage2BacaKoordinat';
import { Stage3CariLokasi } from './components/Stage3CariLokasi';
import { MisiAkhir } from './components/MisiAkhir';
import { VictoryScreen } from './components/VictoryScreen';
import { ThemeSongPlayer } from './components/ThemeSongPlayer';
import { sound } from './services/soundEngine';

export default function App() {
  const [currentScene, setCurrentScene] = useState<GameScene>('title');
  const [score, setScore] = useState<number>(0);
  const [isThemeSongOpen, setIsThemeSongOpen] = useState<boolean>(false);

  const [stageProgress, setStageProgress] = useState({
    stage1Complete: false,
    stage2Complete: false,
    stage3Complete: false,
    finalMissionComplete: false,
    stage1Stars: 0,
    stage2Stars: 0,
    stage3Stars: 0,
  });

  const handleStartMission = () => {
    setCurrentScene('story_intro');
  };

  const handleStoryComplete = () => {
    setCurrentScene('map_hub');
  };

  const handleStage1Complete = (stars: number, earnedScore: number) => {
    setScore((prev) => prev + earnedScore);
    setStageProgress((prev) => ({
      ...prev,
      stage1Complete: true,
      stage1Stars: Math.max(prev.stage1Stars, stars),
    }));
    setCurrentScene('stage_2');
  };

  const handleStage2Complete = (stars: number, earnedScore: number) => {
    setScore((prev) => prev + earnedScore);
    setStageProgress((prev) => ({
      ...prev,
      stage2Complete: true,
      stage2Stars: Math.max(prev.stage2Stars, stars),
    }));
    setCurrentScene('stage_3');
  };

  const handleStage3Complete = (stars: number, earnedScore: number) => {
    setScore((prev) => prev + earnedScore);
    setStageProgress((prev) => ({
      ...prev,
      stage3Complete: true,
      stage3Stars: Math.max(prev.stage3Stars, stars),
    }));
    setCurrentScene('final_mission');
  };

  const handleFinalMissionComplete = (earnedScore: number) => {
    setScore((prev) => prev + earnedScore);
    setStageProgress((prev) => ({
      ...prev,
      finalMissionComplete: true,
    }));
    setCurrentScene('victory');
  };

  const handleRestartCurrent = () => {
    sound.stopSpeaking();
    // Re-mount current scene
    const curr = currentScene;
    setCurrentScene('map_hub');
    setTimeout(() => setCurrentScene(curr), 50);
  };

  const handlePlayAgain = () => {
    sound.stopSpeaking();
    setScore(0);
    setStageProgress({
      stage1Complete: false,
      stage2Complete: false,
      stage3Complete: false,
      finalMissionComplete: false,
      stage1Stars: 0,
      stage2Stars: 0,
      stage3Stars: 0,
    });
    setCurrentScene('title');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-2 select-none overflow-x-hidden font-sans">
      {/* 16:9 Landscape Frame Container */}
      <div className="relative w-full max-w-[1280px] aspect-[16/9] min-h-[620px] bg-slate-900 shadow-2xl rounded-none sm:rounded-2xl border-0 sm:border-2 border-cyan-500/30 flex flex-col overflow-hidden">
        {/* Top Sci-Fi Navbar */}
        <Navbar
          currentScene={currentScene}
          score={score}
          onNavigateHome={() => {
            sound.stopSpeaking();
            setCurrentScene('map_hub');
          }}
          onRestartCurrent={handleRestartCurrent}
          onOpenThemeSong={() => setIsThemeSongOpen(true)}
        />

        {/* Scene Viewport */}
        <main className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
          {currentScene === 'title' && (
            <TitleScreen
              onStartMission={handleStartMission}
              onOpenThemeSong={() => setIsThemeSongOpen(true)}
            />
          )}

          {currentScene === 'story_intro' && (
            <StoryIntro onComplete={handleStoryComplete} />
          )}

          {currentScene === 'map_hub' && (
            <MapHub
              stageProgress={stageProgress}
              onSelectScene={(scene) => {
                sound.stopSpeaking();
                setCurrentScene(scene);
              }}
              onOpenThemeSong={() => setIsThemeSongOpen(true)}
            />
          )}

          {currentScene === 'stage_1' && (
            <Stage1AktifkanPaksi
              onComplete={handleStage1Complete}
              onBackToMap={() => {
                sound.stopSpeaking();
                setCurrentScene('map_hub');
              }}
            />
          )}

          {currentScene === 'stage_2' && (
            <Stage2BacaKoordinat
              onComplete={handleStage2Complete}
              onBackToMap={() => {
                sound.stopSpeaking();
                setCurrentScene('map_hub');
              }}
            />
          )}

          {currentScene === 'stage_3' && (
            <Stage3CariLokasi
              onComplete={handleStage3Complete}
              onBackToMap={() => {
                sound.stopSpeaking();
                setCurrentScene('map_hub');
              }}
            />
          )}

          {currentScene === 'final_mission' && (
            <MisiAkhir
              onComplete={handleFinalMissionComplete}
              onBackToMap={() => {
                sound.stopSpeaking();
                setCurrentScene('map_hub');
              }}
            />
          )}

          {currentScene === 'victory' && (
            <VictoryScreen
              score={score}
              stageProgress={stageProgress}
              onPlayAgain={handlePlayAgain}
              onOpenThemeSong={() => setIsThemeSongOpen(true)}
            />
          )}
        </main>

        {/* Coordinate Theme Song Karaoke Player Modal */}
        <ThemeSongPlayer
          isOpen={isThemeSongOpen}
          onClose={() => setIsThemeSongOpen(false)}
        />
      </div>
    </div>
  );
}
