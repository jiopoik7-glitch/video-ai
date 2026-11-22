import { FPS } from "../theme";

export interface SfxCue {
  readonly id: string;
  readonly frame: number;
  readonly durationSec: number;
  readonly file: string;
  readonly volumeNoVo: number;
  readonly volumeWithVo: number;
}

export interface GridTile {
  readonly id: string;
  readonly title: string;
  readonly sub: string;
  readonly accent: string;
  readonly icon: "soil" | "leaf" | "sprout" | "sun" | "drop" | "flower" | "root" | "harvest" | "wind";
  readonly selected?: boolean;
}

export interface StyleListItem {
  readonly title: string;
  readonly tag: string;
  readonly appearLocal: number;
}

export const COMPOSITION_ID = "PsikologiBerkebunKinetic";
export const VIDEO_SECONDS = 30;
export const DURATION_IN_FRAMES = VIDEO_SECONDS * FPS; // 1800 frames

// 5 Act kontinu (Zero Blank Frames — transisi blob wipe, 3D dive, light burst, whip pan!)
export const ACTS = {
  ACT1_HOOK_BLOB: { from: 0, duration: 360 },       // 00:00.0 - 00:06.0 (White -> Whip Type -> Lime Blob Wipe -> Dark Zeigarnik Emblem)
  ACT2_MIND_PROMPT: { from: 360, duration: 390 },   // 00:06.0 - 00:12.5 (Dark Dot Matrix -> Drag Open Loop -> 3D Dive Click -> Calm Wave)
  ACT3_SENSORY_GRID: { from: 750, duration: 390 },  // 00:12.5 - 00:19.0 (White Punch -> 3D 3x3 Sensory Grid -> Select Tunas -> Lime Burst)
  ACT4_CLOSURE_LIST: { from: 1140, duration: 348 }, // 00:19.0 - 00:24.8 (Exploding Collage "Tuntas." -> White Blob + Vertical Bar List)
  ACT5_OUTRO_FOLDER: { from: 1488, duration: 312 }, // 00:24.8 - 00:30.0 (Whip Badges -> Clean Finale + Rising Glass Botanical Folder)
} as const;

export const OPEN_LOOP_CARDS = [
  { label: "99+ Notifikasi", status: "Belum dibaca", color: "#F43F5E" },
  { label: "Kerjaan Nanggung", status: "Masih terbuka", color: "#F59E0B" },
  { label: "Scroll Tanpa Ujung", status: "Otak lelah", color: "#15803D" },
] as const;

export const SENSORY_GRID_TILES: readonly GridTile[] = [
  { id: "t1", title: "Sentuh Tanah", sub: "Grounding fisik", accent: "#A3E600", icon: "soil" },
  { id: "t2", title: "Aroma Daun", sub: "Sinyal aman", accent: "#22C55E", icon: "leaf" },
  { id: "t3", title: "Sinar Pagi", sub: "Serotonin naik", accent: "#F59E0B", icon: "sun" },
  { id: "t4", title: "Siram Pelan", sub: "Ritme teratur", accent: "#38BDF8", icon: "drop" },
  { id: "t5", title: "Tunas Baru", sub: "Progres nyata", accent: "#A3E600", icon: "sprout", selected: true },
  { id: "t6", title: "Bunga Mekar", sub: "Harapan tumbuh", accent: "#F43F5E", icon: "flower" },
  { id: "t7", title: "Akar Kuat", sub: "Sabar berproses", accent: "#84CC16", icon: "root" },
  { id: "t8", title: "Panen Sendiri", sub: "Siklus tuntas", accent: "#F97316", icon: "harvest" },
  { id: "t9", title: "Napas Lega", sub: "Saraf tenang", accent: "#34D399", icon: "wind" },
];

export const COLLAGE_MOMENTS = [
  { label: "Semai Benih", x: -420, y: -230, rot: -8, bg: "#0C1A10", accent: "#A3E600" },
  { label: "Siram Pagi", x: 390, y: -220, rot: 7, bg: "#0F2417", accent: "#38BDF8" },
  { label: "Tunas Pecah", x: -470, y: 180, rot: 6, bg: "#132914", accent: "#B6F716" },
  { label: "Daun Rimbun", x: 430, y: 195, rot: -7, bg: "#0A1E13", accent: "#22C55E" },
  { label: "Bunga Muncul", x: -30, y: -290, rot: 3, bg: "#1E1612", accent: "#F59E0B" },
  { label: "Panen Utuh", x: 20, y: 275, rot: -4, bg: "#1E1014", accent: "#F43F5E" },
] as const;

export const BRAIN_EFFECTS_LIST: readonly StyleListItem[] = [
  { title: "Tutup Open Loop", tag: "Zeigarnik reda", appearLocal: 144 },
  { title: "Kortisol Menurun", tag: "Stres mereda", appearLocal: 176 },
  { title: "Hadir Penuh", tag: "Mindful nyata", appearLocal: 208 },
  { title: "Dopamin Sehat", tag: "Puas & utuh", appearLocal: 240 },
];

export const SFX_CUES: readonly SfxCue[] = [
  // Act 1: Whip intro, giant type whip, organic lime blob wipe, logo reveal pop
  { id: "a1-whip1", frame: 10, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.10 },
  { id: "a1-whip2", frame: 112, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "a1-blob", frame: 218, durationSec: 0.50, file: "audio/sfx-blob-wipe.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "a1-logo", frame: 294, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.32, volumeWithVo: 0.10 },
  // Act 2: Drag drop pop, typing ticks, 3D dive click, wave transform whoosh
  { id: "a2-drop", frame: 416, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.28, volumeWithVo: 0.10 },
  { id: "a2-type1", frame: 446, durationSec: 0.06, file: "audio/sfx-type.wav", volumeNoVo: 0.24, volumeWithVo: 0.08 },
  { id: "a2-type2", frame: 462, durationSec: 0.06, file: "audio/sfx-type.wav", volumeNoVo: 0.24, volumeWithVo: 0.08 },
  { id: "a2-type3", frame: 478, durationSec: 0.06, file: "audio/sfx-type.wav", volumeNoVo: 0.24, volumeWithVo: 0.08 },
  { id: "a2-dive", frame: 534, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a2-click", frame: 586, durationSec: 0.09, file: "audio/sfx-click.wav", volumeNoVo: 0.35, volumeWithVo: 0.11 },
  { id: "a2-wave", frame: 632, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  // Act 3: White punch pop, 3D grid sweep, select tile click, seed drop, lime burst
  { id: "a3-white", frame: 752, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a3-grid", frame: 842, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a3-pick", frame: 942, durationSec: 0.09, file: "audio/sfx-click.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "a3-drop", frame: 1036, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "a3-burst", frame: 1094, durationSec: 0.50, file: "audio/sfx-blob-wipe.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  // Act 4: Collage explode pop, whip to card, 4 list item pops
  { id: "a4-explode", frame: 1152, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.32, volumeWithVo: 0.10 },
  { id: "a4-card", frame: 1252, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a4-li1", frame: 1284, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "a4-li2", frame: 1316, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.27, volumeWithVo: 0.09 },
  { id: "a4-li3", frame: 1348, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a4-li4", frame: 1380, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  // Act 5: Badges whip, pops, folder rise + finale resolve chord
  { id: "a5-whip", frame: 1492, durationSec: 0.28, file: "audio/sfx-whip.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  { id: "a5-badge", frame: 1554, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "a5-folder", frame: 1642, durationSec: 0.50, file: "audio/sfx-blob-wipe.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "a5-resolve", frame: 1644, durationSec: 2.60, file: "audio/sfx-resolve.wav", volumeNoVo: 0.34, volumeWithVo: 0.10 },
];
