export interface AudioCue {
  readonly id: string;
  readonly frame: number;
  readonly durationInFrames: number;
  readonly file: string;
  readonly volume: number;
}

export interface MediaSwitch {
  readonly ENABLE_PROCEDURAL_AUDIO: boolean;
  readonly ENABLE_VOICEOVER_FILE: boolean;
  readonly VOICEOVER_FILE: string;
}

export const VIDEO_SPEC = {
  ID: "SeflornerStory",
  WIDTH: 1920,
  HEIGHT: 1080,
  FPS: 60,
  DURATION_IN_FRAMES: 1800,
} as const;

export const MEDIA_SWITCH: MediaSwitch = {
  ENABLE_PROCEDURAL_AUDIO: true,
  ENABLE_VOICEOVER_FILE: false,
  VOICEOVER_FILE: "media/voiceover-seflorner.mp3",
};

export const SCENE_MAP = {
  ORIGIN: { from: 0, duration: 330 },       // 00:00.0 - 00:05.5
  SAVINGS: { from: 330, duration: 420 },    // 00:05.5 - 00:12.5
  GROWTH: { from: 750, duration: 360 },     // 00:12.5 - 00:18.5
  HARVEST: { from: 1110, duration: 360 },   // 00:18.5 - 00:24.5
  OUTRO: { from: 1470, duration: 330 },     // 00:24.5 - 00:30.0
} as const;

export const SEED_COLLECTION = [
  { name: "Tomat Ceri", tag: "Buah Manis", color: "#E11D48", start: 218 },
  { name: "Daun Mint", tag: "Herbal Segar", color: "#0D9488", start: 236 },
  { name: "Cabai Rawit", tag: "Panen Rutin", color: "#EA580C", start: 254 },
  { name: "Basil & Selada", tag: "Sayur Organik", color: "#15803D", start: 272 },
] as const;

export const HARVEST_CARDS = [
  {
    code: "01 · 2024",
    title: "Kebun Kecil",
    desc: "Dimulai dari beberapa pot di sudut rumah.",
    rot: -4.2,
    start: 188,
  },
  {
    code: "02 · KOLEKSI",
    title: "24+ Bibit",
    desc: "Ditabung perlahan sampai penuh warna hijau.",
    rot: 3.4,
    start: 204,
  },
  {
    code: "03 · KARYA",
    title: "Video Aesthetic",
    desc: "Cahaya pagi & cerita berkebun yang menenangkan.",
    rot: -2.8,
    start: 220,
  },
  {
    code: "04 · KEBAHAGIAAN",
    title: "Panen Sendiri",
    desc: "Memetik hasil segar dari kebun sendiri.",
    rot: 4.0,
    start: 236,
  },
] as const;

export const AUDIO_CUES: readonly AudioCue[] = [
  { id: "origin-bloom", frame: 162, durationInFrames: 42, file: "audio/seflorner-bloom.wav", volume: 0.34 },
  { id: "savings-in", frame: 336, durationInFrames: 24, file: "audio/seflorner-whoosh.wav", volume: 0.28 },
  { id: "seed-1", frame: 548, durationInFrames: 12, file: "audio/seflorner-pop.wav", volume: 0.26 },
  { id: "seed-2", frame: 566, durationInFrames: 12, file: "audio/seflorner-pop.wav", volume: 0.27 },
  { id: "seed-3", frame: 584, durationInFrames: 12, file: "audio/seflorner-pop.wav", volume: 0.28 },
  { id: "seed-4", frame: 602, durationInFrames: 12, file: "audio/seflorner-pop.wav", volume: 0.30 },
  { id: "growth-in", frame: 756, durationInFrames: 24, file: "audio/seflorner-whoosh.wav", volume: 0.26 },
  { id: "growth-ripe", frame: 995, durationInFrames: 48, file: "audio/seflorner-sparkle.wav", volume: 0.34 },
  { id: "harvest-in", frame: 1116, durationInFrames: 24, file: "audio/seflorner-whoosh.wav", volume: 0.26 },
  { id: "shutter-click", frame: 1222, durationInFrames: 10, file: "audio/seflorner-click.wav", volume: 0.35 },
  { id: "collage-in", frame: 1296, durationInFrames: 24, file: "audio/seflorner-whoosh.wav", volume: 0.26 },
  { id: "outro-cta-click", frame: 1642, durationInFrames: 10, file: "audio/seflorner-click.wav", volume: 0.34 },
  { id: "outro-resolve", frame: 1688, durationInFrames: 112, file: "audio/seflorner-resolve.wav", volume: 0.36 },
];
