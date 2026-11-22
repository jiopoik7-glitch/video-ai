export interface AudioCue {
  readonly id: string;
  readonly frame: number;
  readonly durationInFrames: number;
  readonly file: string;
  readonly volume: number;
}

export interface MediaConfig {
  readonly ENABLE_PROCEDURAL_AUDIO: boolean;
  readonly ENABLE_VOICEOVER_FILE: boolean;
  readonly VOICEOVER_FILE: string;
  readonly PHOTO_KEBUN: string;
  readonly PHOTO_PAKET: string;
  readonly PHOTO_DETAIL: string;
}

export const VIDEO_SPEC = {
  ID: "SeflornerPocAffiliate",
  WIDTH: 1080,
  HEIGHT: 1920,
  FPS: 60,
  DURATION_IN_FRAMES: 1800,
} as const;

export const MEDIA_CONFIG: MediaConfig = {
  ENABLE_PROCEDURAL_AUDIO: true,
  ENABLE_VOICEOVER_FILE: false,
  VOICEOVER_FILE: "media/voiceover-poc.mp3",
  PHOTO_KEBUN: "media/produk-kebun.jpg",
  PHOTO_PAKET: "media/produk-paket.jpg",
  PHOTO_DETAIL: "media/produk-detail.jpg",
};

export const SCENE_MAP = {
  HOOK: { from: 0, duration: 330 },         // 00:00.0 - 00:05.5
  WHY_POC: { from: 330, duration: 420 },    // 00:05.5 - 00:12.5
  SIMULATION: { from: 750, duration: 360 }, // 00:12.5 - 00:18.5
  SHOWCASE: { from: 1110, duration: 360 },  // 00:18.5 - 00:24.5
  OUTRO: { from: 1470, duration: 330 },     // 00:24.5 - 00:30.0
} as const;

export const POC_PILLS = [
  { title: "Cegah Bunga Rontok", tag: "Ekstra Kalsium", color: "#15803D", start: 215 },
  { title: "Cepat Serap Daun & Akar", tag: "100% Organik Cair", color: "#D97706", start: 235 },
  { title: "Buah Lebat & Maksimal", tag: "Makro & Mikro", color: "#0D9488", start: 255 },
] as const;

export const COLLAGE_SPECS = [
  {
    code: "ISI 01",
    title: "POC Buah 500 ml",
    desc: "Cukup 2 pump / liter air, semprot daun atau kocor.",
    rot: -3.2,
    start: 194,
  },
  {
    code: "ISI 02",
    title: "Fruit Expert 250 gr",
    desc: "Ekstra kalsium, 4 gram / liter air kocor ke media.",
    rot: 3.0,
    start: 208,
  },
  {
    code: "JADWAL",
    title: "1x Seminggu",
    desc: "Disarankan aplikasi pada sore hari biar optimal.",
    rot: 2.6,
    start: 222,
  },
  {
    code: "COCOK UNTUK",
    title: "Semua Buah",
    desc: "Tabulampot pekarangan hingga pohon buah tahunan.",
    rot: -2.8,
    start: 236,
  },
] as const;

export const AUDIO_CUES: readonly AudioCue[] = [
  { id: "hook-bloom", frame: 162, durationInFrames: 42, file: "audio/sfx-bloom.wav", volume: 0.34 },
  { id: "whypoc-in", frame: 336, durationInFrames: 24, file: "audio/sfx-whoosh.wav", volume: 0.28 },
  { id: "pill-1", frame: 545, durationInFrames: 12, file: "audio/sfx-pop.wav", volume: 0.26 },
  { id: "pill-2", frame: 565, durationInFrames: 12, file: "audio/sfx-pop.wav", volume: 0.28 },
  { id: "pill-3", frame: 585, durationInFrames: 12, file: "audio/sfx-pop.wav", volume: 0.30 },
  { id: "sim-in", frame: 756, durationInFrames: 24, file: "audio/sfx-whoosh.wav", volume: 0.26 },
  { id: "sim-bloom", frame: 995, durationInFrames: 48, file: "audio/sfx-sparkle.wav", volume: 0.34 },
  { id: "showcase-in", frame: 1116, durationInFrames: 24, file: "audio/sfx-whoosh.wav", volume: 0.26 },
  { id: "showcase-click", frame: 1222, durationInFrames: 10, file: "audio/sfx-click.wav", volume: 0.35 },
  { id: "collage-in", frame: 1296, durationInFrames: 24, file: "audio/sfx-whoosh.wav", volume: 0.26 },
  { id: "outro-click", frame: 1642, durationInFrames: 10, file: "audio/sfx-click.wav", volume: 0.34 },
  { id: "outro-resolve", frame: 1688, durationInFrames: 112, file: "audio/sfx-resolve.wav", volume: 0.36 },
];
