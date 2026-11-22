import { FPS } from "../theme";

export interface UnfinishedItem {
  readonly id: string;
  readonly title: string;
  readonly note: string;
  readonly pct: number;
  readonly color: string;
  readonly appearLocal: number;
}

export interface JourneyStation {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly desc: string;
  readonly accent: string;
  readonly icon: "seed" | "water" | "sprout" | "fruit";
  readonly camX: number;
}

export interface FeelingPoint {
  readonly title: string;
  readonly desc: string;
  readonly appearLocal: number;
}

export interface SfxCue {
  readonly id: string;
  readonly frame: number;
  readonly durationSec: number;
  readonly file: string;
  readonly volumeNoVo: number;
  readonly volumeWithVo: number;
}

export const COMPOSITION_ID = "TenangBerkebunAE";
export const VIDEO_SECONDS = 30;
export const DURATION_IN_FRAMES = VIDEO_SECONDS * FPS; // 1800 frames @ 60 FPS

// Overlapping continuous scenes (ZERO blank/black transition frames!)
export const SCENES = {
  ACT1_HOOK: { from: 0, duration: 365 },        // 00:00.0 - 00:06.1 (Light Cream: Broken Ring + Relatable Unfinished Cards -> Whip Dive)
  ACT2_WHY_TIRED: { from: 345, duration: 405 }, // 00:05.75 - 00:12.5 (Night Forest: "Otak benci hal yang nanggung" + Stuck Progress Bars -> Iris Open)
  ACT3_TRACKING: { from: 726, duration: 424 },  // 00:12.1 - 00:19.16 (Morning Light: Continuous AE Camera Tracking across 4 Living Stages)
  ACT4_COMPLETE: { from: 1126, duration: 374 }, // 00:18.76 - 00:25.0 (The Broken Ring Finally Closes to 100% + 3 Relatable Feelings)
  ACT5_CLOSING: { from: 1476, duration: 324 },  // 00:24.6 - 00:30.0 (Warm Breathing Closing + Original Botanical Crest + Seflorner.)
} as const;

export const UNFINISHED_CARDS: readonly UnfinishedItem[] = [
  {
    id: "u1",
    title: "Chat belum sempat dibalas",
    note: "Masih ngegantung",
    pct: 74,
    color: "#E11D48",
    appearLocal: 54,
  },
  {
    id: "u2",
    title: "Kerjaan tinggal sedikit lagi",
    note: "Belum benar-benar beres",
    pct: 86,
    color: "#D97706",
    appearLocal: 88,
  },
  {
    id: "u3",
    title: "Scroll HP nggak ada ujungnya",
    note: "Mata lelah, kepala penuh",
    pct: 62,
    color: "#0D9488",
    appearLocal: 122,
  },
];

export const STUCK_BARS = [
  { label: "Tugas hari ini", stuckPct: 82, color: "#D97706" },
  { label: "Pikiran besok", stuckPct: 68, color: "#E11D48" },
  { label: "Rencana yang ditunda", stuckPct: 45, color: "#F59E0B" },
] as const;

export const JOURNEY_STATIONS: readonly JourneyStation[] = [
  {
    id: "st1",
    step: "01 · Mulai",
    title: "Tanam satu benih",
    desc: "Langkah kecil yang langsung kamu pegang sendiri.",
    accent: "#C25B3F",
    icon: "seed",
    camX: 0,
  },
  {
    id: "st2",
    step: "02 · Rawat",
    title: "Siram pelan tiap pagi",
    desc: "Lima menit tanpa layar, cuma air dan cahaya matahari.",
    accent: "#0284C7",
    icon: "water",
    camX: 1180,
  },
  {
    id: "st3",
    step: "03 · Tumbuh",
    title: "Lihat tunasnya pecah",
    desc: "Hasil sabarmu terlihat nyata berubah dari hari ke hari.",
    accent: "#15803D",
    icon: "sprout",
    camX: 2360,
  },
  {
    id: "st4",
    step: "04 · Panen",
    title: "Petik dari kebun sendiri",
    desc: "Ada satu cerita di hidupmu yang benar-benar sampai akhir.",
    accent: "#E11D48",
    icon: "fruit",
    camX: 3540,
  },
];

export const HUMAN_FEELINGS: readonly FeelingPoint[] = [
  {
    title: "Nggak perlu buru-buru",
    desc: "Tanaman nggak bisa dipaksa cepat, kamu ikut belajar pelan.",
    appearLocal: 118,
  },
  {
    title: "Nyata bisa disentuh",
    desc: "Bukan cuma angka dan tulisan yang lewat di layar HP.",
    appearLocal: 162,
  },
  {
    title: "Akhirnya terasa selesai",
    desc: "Saat lingkaran utuh, kepalamu akhirnya boleh benar-benar lega.",
    appearLocal: 206,
  },
];

export const SFX_CUES: readonly SfxCue[] = [
  // Act 1: Cards popping in + whip camera dive into Act 2
  { id: "c1-pop1", frame: 54, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.25, volumeWithVo: 0.09 },
  { id: "c1-pop2", frame: 88, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c1-pop3", frame: 122, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.27, volumeWithVo: 0.09 },
  { id: "c1-whip", frame: 334, durationSec: 0.30, file: "audio/sfx-whip.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  // Act 2: Stuck bar ticks + morning iris bloom into Act 3
  { id: "c2-tick1", frame: 492, durationSec: 0.09, file: "audio/sfx-tick.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c2-tick2", frame: 562, durationSec: 0.09, file: "audio/sfx-tick.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c2-iris", frame: 718, durationSec: 0.52, file: "audio/sfx-iris.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  // Act 3: 3 smooth AE camera whip-pans between the 4 botanical stations
  { id: "c3-pan1", frame: 828, durationSec: 0.30, file: "audio/sfx-whip.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c3-pan2", frame: 924, durationSec: 0.30, file: "audio/sfx-whip.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c3-pan3", frame: 1020, durationSec: 0.30, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  // Act 4: Circle locks to 100% + 3 human feeling pops
  { id: "c4-whip", frame: 1126, durationSec: 0.30, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "c4-lock", frame: 1196, durationSec: 0.85, file: "audio/sfx-complete.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "c4-feel1", frame: 1244, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.24, volumeWithVo: 0.09 },
  { id: "c4-feel2", frame: 1288, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.25, volumeWithVo: 0.09 },
  { id: "c4-feel3", frame: 1332, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  // Act 5: Gentle rise + warm resolve chord
  { id: "c5-rise", frame: 1476, durationSec: 0.52, file: "audio/sfx-iris.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c5-resolve", frame: 1624, durationSec: 2.60, file: "audio/sfx-resolve.wav", volumeNoVo: 0.34, volumeWithVo: 0.10 },
];
