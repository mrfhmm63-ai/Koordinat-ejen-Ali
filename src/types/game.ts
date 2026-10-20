export type CharacterId = 'ali' | 'ammar' | 'comot' | 'system';

export interface DialogueLine {
  id: string;
  speaker: CharacterId;
  speakerName: string;
  text: string;
  speechText?: string; // Optimized text for Malay speech synthesis pronunciation
  emotion?: 'curious' | 'happy' | 'determined' | 'confused' | 'mentor' | 'alert';
}

export interface Landmark {
  id: string;
  name: string;
  coordinate: [number, number]; // [x, y]
  description: string;
  iconName: string;
  color: string;
}

export interface QuestionStage1 {
  id: string;
  taskPrompt: string;
  speechPrompt: string;
  targetType: 'paksi-x' | 'paksi-y' | 'asalan';
  explanation: string;
  speechExplanation: string;
}

export interface QuestionStage2 {
  id: string;
  landmark: Landmark;
  questionText: string;
  speechQuestion: string;
  options: [number, number][]; // list of coordinate options
  correctCoordinate: [number, number];
  explanation: string;
  speechExplanation: string;
}

export interface QuestionStage3 {
  id: string;
  targetName: string;
  targetCoordinate: [number, number];
  clue: string;
  speechClue: string;
  landmarkIcon: string;
  explanation: string;
  speechExplanation: string;
}

export interface FinalMissionTarget {
  id: string;
  name: string;
  coordinate: [number, number];
  codeName: string;
  hint: string;
}

export type GameScene = 
  | 'title'           // Scene 1: Muka depan
  | 'story_intro'     // Scene 2: Cerita navigasi rosak
  | 'map_hub'         // Scene 3: Peta Cyberaya (Stage selection)
  | 'stage_1'         // Stage 1: Aktifkan Paksi
  | 'stage_2'         // Stage 2: Baca Koordinat
  | 'stage_3'         // Stage 3: Cari & Plot Lokasi
  | 'final_mission'   // Misi Akhir: Pulihkan Sistem Navigasi
  | 'victory';        // Penamat: Kemenangan & Lencana
