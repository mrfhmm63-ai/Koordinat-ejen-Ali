import { Landmark, DialogueLine, QuestionStage1, QuestionStage2, QuestionStage3, FinalMissionTarget } from '../types/game';

// Landmarks on Cyberaya 8x8 Grid
export const CYBERAYA_LANDMARKS: Landmark[] = [
  {
    id: 'mata_hq',
    name: 'Akademi M.A.T.A.',
    coordinate: [3, 2],
    description: 'Pusat latihan ejen rahsia tercanggih di Cyberaya.',
    iconName: 'Shield',
    color: '#06b6d4', // cyan
  },
  {
    id: 'menara_cyberaya',
    name: 'Menara Cyberaya',
    coordinate: [5, 4],
    description: 'Bangunan pencakar langit mercu tanda Cyberaya.',
    iconName: 'Building2',
    color: '#3b82f6', // blue
  },
  {
    id: 'makmal_tekno',
    name: 'Makmal Tekno',
    coordinate: [2, 6],
    description: 'Hab pembangunan gajet, dron dan robotik canggih.',
    iconName: 'Cpu',
    color: '#a855f7', // purple
  },
  {
    id: 'stesen_tren',
    name: 'Stesen Tren Levitasi',
    coordinate: [6, 1],
    description: 'Pengangkutan laju maglev merentasi seluruh bandar.',
    iconName: 'TrainTrack',
    color: '#eab308', // amber
  },
  {
    id: 'reaktor_azanium',
    name: 'Reaktor Tenaga Azanium',
    coordinate: [7, 6],
    description: 'Punca bekalan tenaga bersih dan berteknologi tinggi.',
    iconName: 'Zap',
    color: '#ef4444', // red
  },
  {
    id: 'taman_aeroponik',
    name: 'Taman Aeroponik',
    coordinate: [1, 4],
    description: 'Zon hijau dan pertanian menegak masa hadapan.',
    iconName: 'Trees',
    color: '#10b981', // green
  },
  {
    id: 'bengkel_ali',
    name: 'Bengkel Gajet Ali',
    coordinate: [4, 7],
    description: 'Tempat Ejen Ali menyelenggara Yoyo dan sut tempur.',
    iconName: 'Wrench',
    color: '#f97316', // orange
  },
];

// Story Dialogues for Scene 2
export const STORY_INTRO_DIALOGUES: DialogueLine[] = [
  {
    id: 'intro_sys',
    speaker: 'system',
    speakerName: 'SISTEM M.A.T.A.',
    text: 'AMARAN KOD MERAH! Sistem navigasi Cyberaya telah digodam! Semua data koordinat mercu tanda terputus!',
    speechText: 'Amaran kod merah! Sistem navigasi Cyberaya telah digodam! Semua data koordinat mercu tanda terputus!',
    emotion: 'alert',
  },
  {
    id: 'intro_ali_1',
    speaker: 'ali',
    speakerName: 'Ejen Ali',
    text: 'Alamak Cikgu Ammar! Peta navigasi kita dah rosak teruk! Macam mana kita nak cari lokasi dan pandu dron kalau tak tahu koordinat?',
    speechText: 'Alamak Cikgu Ammar! Peta navigasi kita dah rosak teruk! Macam mana kita nak cari lokasi dan pandu dron kalau tak tahu koordinat?',
    emotion: 'confused',
  },
  {
    id: 'intro_ammar_1',
    speaker: 'ammar',
    speakerName: 'Cikgu Ammar',
    text: 'Bertenang Ali! Jangan panik. Kita boleh memulihkannya menggunakan konsep Matematik Tahun 5: KOORDINAT.',
    speechText: 'Bertenang Ali! Jangan panik. Kita boleh memulihkannya menggunakan konsep Matematik Tahun 5 iaitu Koordinat.',
    emotion: 'mentor',
  },
  {
    id: 'intro_ammar_2',
    speaker: 'ammar',
    speakerName: 'Cikgu Ammar',
    text: 'Ingat Ali, kita ada Paksi-X yang mendatar, Paksi-Y yang menegak, dan titik Asalan (0,0). Jika kita faham pasangan tertib (x,y), Cyberaya pasti selamat!',
    speechText: 'Ingat Ali, kita ada Paksi X yang mendatar, Paksi Y yang menegak, dan titik Asalan sifar sifar. Jika kita faham pasangan tertib x koma y, Cyberaya pasti selamat!',
    emotion: 'mentor',
  },
  {
    id: 'intro_comot_1',
    speaker: 'comot',
    speakerName: 'Comot & Bot S.A.T.U.',
    text: 'Meow! Pengimbas sedia! Ejen Ali dan kawan-kawan di rumah, jom mulakan Misi 1 untuk aktifkan paksi!',
    speechText: 'Meow! Pengimbas sedia! Ejen Ali dan kawan-kawan, jom mulakan Misi 1 untuk aktifkan paksi!',
    emotion: 'happy',
  },
  {
    id: 'intro_ali_2',
    speaker: 'ali',
    speakerName: 'Ejen Ali',
    text: 'Baik Cikgu Ammar! Saya dan murid-murid hebat bersedia. Jom kita selesaikan misi koordinat ini!',
    speechText: 'Baik Cikgu Ammar! Saya dan murid-murid hebat bersedia. Jom kita selesaikan misi koordinat ini!',
    emotion: 'determined',
  },
];

// STAGE 1: AKTIFKAN PAKSI
export const STAGE_1_QUESTIONS: QuestionStage1[] = [
  {
    id: 's1_q1',
    taskPrompt: 'Sentuh dan aktifkan PAKSI-X (Paksi Mengufuk / Mendatar)!',
    speechPrompt: 'Sentuh dan aktifkan Paksi X, iaitu paksi mengufuk atau mendatar pada grid.',
    targetType: 'paksi-x',
    explanation: 'Hebat! Paksi-X ialah garis lurus mendatar (mengufuk) dari kiri ke kanan. Ia sentiasa dibaca dahulu!',
    speechExplanation: 'Hebat! Paksi X ialah garis lurus mendatar dari kiri ke kanan. Nilai paksi X sentiasa dibaca dahulu!',
  },
  {
    id: 's1_q2',
    taskPrompt: 'Sentuh dan aktifkan PAKSI-Y (Paksi Mencancang / Menegak)!',
    speechPrompt: 'Sekarang, sentuh dan aktifkan Paksi Y, iaitu paksi mencancang atau menegak.',
    targetType: 'paksi-y',
    explanation: 'Tepat sekali! Paksi-Y ialah garis lurus menegak (mencancang) dari bawah ke atas. Ia dibaca selepas paksi-x!',
    speechExplanation: 'Tepat sekali! Paksi Y ialah garis lurus menegak dari bawah ke atas. Ia dibaca selepas paksi X!',
  },
  {
    id: 's1_q3',
    taskPrompt: 'Kesan dan sentuh TITIK ASALAN (0, 0) iaitu titik pertemuan kedua-dua paksi!',
    speechPrompt: 'Kesan dan sentuh titik Asalan sifar sifar, iaitu titik pertemuan antara paksi X dan paksi Y.',
    targetType: 'asalan',
    explanation: 'Tahniah! Titik Asalan mempunyai koordinat (0, 0). Semua pergerakan membaca dan memplot koordinat bermula dari sini!',
    speechExplanation: 'Tahniah! Titik Asalan mempunyai koordinat sifar koma sifar. Semua pergerakan koordinat bermula dari sini!',
  },
];

// STAGE 2: BACA KOORDINAT
export const STAGE_2_QUESTIONS: QuestionStage2[] = [
  {
    id: 's2_q1',
    landmark: CYBERAYA_LANDMARKS[0], // Akademi M.A.T.A. (3, 2)
    questionText: 'Apakah koordinat bagi Akademi M.A.T.A.?',
    speechQuestion: 'Apakah koordinat bagi Akademi M.A.T.A.? Perhatikan langkah dari asalan.',
    options: [[3, 2], [2, 3], [3, 0], [0, 2]],
    correctCoordinate: [3, 2],
    explanation: 'Bagus! Dari asalan (0,0), bergerak 3 unit ke kanan (Paksi-X), kemudian 2 unit ke atas (Paksi-Y). Jadi koordinatnya ialah (3, 2).',
    speechExplanation: 'Bagus! Dari asalan, bergerak 3 unit ke kanan pada paksi X, kemudian 2 unit ke atas pada paksi Y. Maka koordinatnya ialah tiga koma dua.',
  },
  {
    id: 's2_q2',
    landmark: CYBERAYA_LANDMARKS[1], // Menara Cyberaya (5, 4)
    questionText: 'Tentukan koordinat Menara Cyberaya yang megah ini!',
    speechQuestion: 'Tentukan koordinat Menara Cyberaya yang megah ini!',
    options: [[4, 5], [5, 4], [5, 5], [4, 4]],
    correctCoordinate: [5, 4],
    explanation: 'Tepat! Baca nilai paksi-X dahulu iaitu 5, diikuti nilai paksi-Y iaitu 4. Jawapannya ialah (5, 4), bukan (4, 5)!',
    speechExplanation: 'Tepat! Baca nilai paksi X dahulu iaitu 5, diikuti nilai paksi Y iaitu 4. Pasangan tertibnya ialah lima koma empat.',
  },
  {
    id: 's2_q3',
    landmark: CYBERAYA_LANDMARKS[2], // Makmal Tekno (2, 6)
    questionText: 'Dron pengimbas mengesan Makmal Tekno. Apakah koordinatnya?',
    speechQuestion: 'Dron pengimbas mengesan Makmal Tekno. Apakah koordinatnya?',
    options: [[6, 2], [2, 6], [2, 5], [3, 6]],
    correctCoordinate: [2, 6],
    explanation: 'Cemerlang! Jarak mengufuk ialah 2 unit dan jarak mencancang ialah 6 unit. Koordinat ditulis sebagai (2, 6).',
    speechExplanation: 'Cemerlang! Jarak mengufuk ialah 2 unit dan jarak mencancang ialah 6 unit. Koordinat ditulis sebagai dua koma enam.',
  },
  {
    id: 's2_q4',
    landmark: CYBERAYA_LANDMARKS[3], // Stesen Tren Levitasi (6, 1)
    questionText: 'Kesan koordinat Stesen Tren Levitasi untuk laluan selamat Ali!',
    speechQuestion: 'Kesan koordinat Stesen Tren Levitasi untuk laluan selamat Ali!',
    options: [[1, 6], [6, 1], [6, 0], [0, 6]],
    correctCoordinate: [6, 1],
    explanation: 'Hebat Ejen! 6 unit ke kanan pada Paksi-X dan 1 unit ke atas pada Paksi-Y menghasilkan koordinat (6, 1).',
    speechExplanation: 'Hebat Ejen! 6 unit ke kanan pada Paksi X dan 1 unit ke atas pada paksi Y menghasilkan koordinat enam koma satu.',
  },
];

// STAGE 3: CARI & PLOT LOKASI
export const STAGE_3_QUESTIONS: QuestionStage3[] = [
  {
    id: 's3_q1',
    targetName: 'Taman Aeroponik',
    targetCoordinate: [1, 4],
    clue: 'Plotkan lokasi Taman Aeroponik pada koordinat (1, 4)! Tekan pada grid.',
    speechClue: 'Plotkan lokasi Taman Aeroponik pada koordinat satu koma empat. Klik atau sentuh pada persilangan grid.',
    landmarkIcon: 'Trees',
    explanation: 'Tahniah! Anda telah memplot titik pada 1 unit mengufuk dan 4 unit mencancang dari asalan!',
    speechExplanation: 'Tahniah! Anda telah berjaya memplot titik pada 1 unit mengufuk dan 4 unit mencancang dari asalan.',
  },
  {
    id: 's3_q2',
    targetName: 'Bengkel Gajet Ali',
    targetCoordinate: [4, 7],
    clue: 'Ali perlu mengambil bekalan Yoyo di Bengkel Gajet pada koordinat (4, 7)!',
    speechClue: 'Ali perlu mengambil bekalan Yoyo di Bengkel Gajet pada koordinat empat koma tujuh. Plotkan titiknya.',
    landmarkIcon: 'Wrench',
    explanation: 'Sasaran berjaya dikunci! Bergerak 4 unit di paksi-X dan naik 7 unit di paksi-Y. Sistem bengkel aktif!',
    speechExplanation: 'Sasaran berjaya dikunci! Bergerak 4 unit di paksi X dan naik 7 unit di paksi Y.',
  },
  {
    id: 's3_q3',
    targetName: 'Reaktor Tenaga Azanium',
    targetCoordinate: [7, 6],
    clue: 'Bahaya! Reaktor Azanium tidak stabil di koordinat (7, 6). Plotkan segera untuk pasang perisai!',
    speechClue: 'Bahaya! Reaktor Azanium tidak stabil di koordinat tujuh koma enam. Plotkan titik segera untuk memasang perisai.',
    landmarkIcon: 'Zap',
    explanation: 'Hebat sekali! Koordinat (7, 6) dipulihkan! 7 unit ke kanan dan 6 unit ke atas.',
    speechExplanation: 'Hebat sekali! Koordinat tujuh koma enam dipulihkan dengan jayanya.',
  },
  {
    id: 's3_q4',
    targetName: 'Menara Komunikasi Rahsia',
    targetCoordinate: [6, 3],
    clue: 'Hubungkan frekuensi Menara Komunikasi pada koordinat (6, 3)!',
    speechClue: 'Hubungkan frekuensi Menara Komunikasi pada koordinat enam koma tiga.',
    landmarkIcon: 'Radio',
    explanation: 'Sempurna! Koordinat (6, 3) berjaya disambungkan ke pangkalan data M.A.T.A.!',
    speechExplanation: 'Sempurna! Koordinat enam koma tiga berjaya disambungkan ke pangkalan data MATA.',
  },
];

// FINAL MISSION TARGETS
export const FINAL_MISSION_TARGETS: FinalMissionTarget[] = [
  {
    id: 'core_1',
    name: 'Nod Firewall M.A.T.A.',
    coordinate: [2, 3],
    codeName: 'CYBER-ALPHA',
    hint: '2 unit ke kanan, 3 unit ke atas dari asalan',
  },
  {
    id: 'core_2',
    name: 'Penguat Isyarat IRIS',
    coordinate: [5, 6],
    codeName: 'CYBER-BETA',
    hint: '5 unit ke kanan, 6 unit ke atas dari asalan',
  },
  {
    id: 'core_3',
    name: 'Teras Induk Navigasi',
    coordinate: [7, 2],
    codeName: 'CYBER-OMEGA',
    hint: '7 unit ke kanan, 2 unit ke atas dari asalan',
  },
];

export const VICTORY_DIALOGUES: DialogueLine[] = [
  {
    id: 'vic_ammar',
    speaker: 'ammar',
    speakerName: 'Cikgu Ammar',
    text: 'Syabas Ali dan murid-murid! Sistem navigasi Cyberaya telah pulih sepenuhnya! Kamu telah membuktikan penguasaan Koordinat Matematik Tahun 5 yang sangat cemerlang!',
    speechText: 'Syabas Ali dan murid-murid! Sistem navigasi Cyberaya telah pulih sepenuhnya! Kamu telah membuktikan penguasaan Koordinat yang sangat cemerlang!',
    emotion: 'mentor',
  },
  {
    id: 'vic_ali',
    speaker: 'ali',
    speakerName: 'Ejen Ali',
    text: 'Wah, terima kasih Cikgu Ammar! Sekarang saya tahu cara membaca paksi-X mendatar dahulu, baru paksi-Y menegak. Misi kita BERJAYA!',
    speechText: 'Wah, terima kasih Cikgu Ammar! Sekarang saya tahu cara membaca paksi X mendatar dahulu, baru paksi Y menegak. Misi kita BERJAYA!',
    emotion: 'happy',
  },
  {
    id: 'vic_comot',
    speaker: 'comot',
    speakerName: 'Comot & Bot S.A.T.U.',
    text: 'Purrr! M.A.T.A. menganugerahkan Lencana Ejen Koordinat Elit kepada kamu!',
    speechText: 'Purrr! MATA menganugerahkan Lencana Ejen Koordinat Elit kepada kamu!',
    emotion: 'happy',
  },
];
