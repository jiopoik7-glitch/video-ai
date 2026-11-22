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

export const COMPOSITION_ID = "TenangBerkebunMaster";
export const VIDEO_SECONDS = 30;
export const DURATION_IN_FRAMES = VIDEO_SECONDS * FPS; // 1800 frames @ 60 FPS

// Jarak antar stasiun Act 3 = 2160px (> 1920px viewport!) -> MUSTAHIL teks tabrakan atau nyelip!
export const STATION_STRIDE = 2160;
export const STATION_WIDTH = 1480; // Center margin kiri-kanan 220px per stasiun, gap bersih antar stasiun 680px!

// Transisi 100% tumpang tindih mulus (ZERO BLANK FRAMES!)
export const SCENES = {
  ACT1_HOOK: { from: 0, duration: 360 },        // 00:00.00 - 00:06.00 (Pan-Wipe keluar f324..360)
  ACT2_WHY_TIRED: { from: 324, duration: 436 }, // 00:05.40 - 00:12.67 (Pan-Wipe masuk f0..36; tetap hidup di bawah portal Act 3!)
  ACT3_TRACKING: { from: 710, duration: 448 },  // 00:11.83 - 00:19.30 (Portal Daylight clip-path membuka langsung di atas Act 2!)
  ACT4_COMPLETE: { from: 1110, duration: 394 }, // 00:18.50 - 00:25.07 (Iris gelap membuka langsung ke Ring 76% -> 100% Utuh!)
  ACT5_CLOSING: { from: 1460, duration: 340 },  // 00:24.33 - 00:30.00 (Kamera Tilt-Up mulus dari Act 4 ke cahaya pagi, 0 frame kosong!)
} as const;

export const UNFINISHED_CARDS: readonly UnfinishedItem[] = [
  {
    id: "u1",
    title: "Chat belum sempat dibalas",
    note: "Masih ngegantung",
    pct: 74,
    color: "#E11D48",
    appearLocal: 48,
  },
  {
    id: "u2",
    title: "Kerjaan tinggal sedikit lagi",
    note: "Belum benar-benar beres",
    pct: 86,
    color: "#D97706",
    appearLocal: 82,
  },
  {
    id: "u3",
    title: "Scroll HP nggak ada ujungnya",
    note: "Mata lelah, kepala penuh",
    pct: 62,
    color: "#0D9488",
    appearLocal: 116,
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
    desc: "Lima menit tanpa layar, cuma air dan cahaya pagi.",
    accent: "#0284C7",
    icon: "water",
    camX: STATION_STRIDE,
  },
  {
    id: "st3",
    step: "03 · Tumbuh",
    title: "Lihat tunasnya pecah",
    desc: "Hasil sabarmu terlihat nyata berubah tiap hari.",
    accent: "#15803D",
    icon: "sprout",
    camX: STATION_STRIDE * 2,
  },
  {
    id: "st4",
    step: "04 · Panen",
    title: "Petik dari kebun sendiri",
    desc: "Ada satu cerita di hidupmu yang benar-benar sampai akhir.",
    accent: "#E11D48",
    icon: "fruit",
    camX: STATION_STRIDE * 3,
  },
];

export const HUMAN_FEELINGS: readonly FeelingPoint[] = [
  {
    title: "Nggak perlu buru-buru",
    desc: "Tanaman nggak bisa dipaksa cepat, kamu ikut belajar pelan.",
    appearLocal: 122,
  },
  {
    title: "Nyata bisa disentuh",
    desc: "Bukan cuma angka dan tulisan yang lewat di layar HP.",
    appearLocal: 164,
  },
  {
    title: "Akhirnya terasa selesai",
    desc: "Saat lingkaran utuh, kepalamu akhirnya boleh benar-benar lega.",
    appearLocal: 206,
  },
];

export const SFX_CUES: readonly SfxCue[] = [
  // Act 1
  { id: "c1-pop1", frame: 48, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.24, volumeWithVo: 0.09 },
  { id: "c1-pop2", frame: 82, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.25, volumeWithVo: 0.09 },
  { id: "c1-pop3", frame: 116, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  // Seamless Pan-Wipe Act 1 -> Act 2 (global f324)
  { id: "c1-glide", frame: 324, durationSec: 0.42, file: "audio/sfx-glide.wav", volumeNoVo: 0.28, volumeWithVo: 0.10 },
  // Act 2 stuck ticks
  { id: "c2-tick1", frame: 480, durationSec: 0.09, file: "audio/sfx-tick.wav", volumeNoVo: 0.24, volumeWithVo: 0.09 },
  { id: "c2-tick2", frame: 550, durationSec: 0.09, file: "audio/sfx-tick.wav", volumeNoVo: 0.24, volumeWithVo: 0.09 },
  // Seamless Morning Portal Act 2 -> Act 3 (global f710)
  { id: "c2-portal", frame: 710, durationSec: 0.56, file: "audio/sfx-portal.wav", volumeNoVo: 0.32, volumeWithVo: 0.11 },
  // Act 3: 3 silky tracking glides between the 4 stations (710 + 106, 204, 302)
  { id: "c3-pan1", frame: 816, durationSec: 0.42, file: "audio/sfx-glide.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c3-pan2", frame: 914, durationSec: 0.42, file: "audio/sfx-glide.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c3-pan3", frame: 1012, durationSec: 0.42, file: "audio/sfx-glide.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  // Seamless Iris into Act 4 (global f1110) + 100% completion harmonic chime (1110 + 76 = 1186)
  { id: "c4-portal", frame: 1110, durationSec: 0.56, file: "audio/sfx-portal.wav", volumeNoVo: 0.28, volumeWithVo: 0.10 },
  { id: "c4-lock", frame: 1186, durationSec: 0.88, file: "audio/sfx-complete.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "c4-f1", frame: 1232, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.24, volumeWithVo: 0.09 },
  { id: "c4-f2", frame: 1274, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.25, volumeWithVo: 0.09 },
  { id: "c4-f3", frame: 1316, durationSec: 0.14, file: "audio/sfx-pop.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  // Seamless Camera Tilt-Up into Act 5 (global f1460) + Warm Resolve Chord (1618)
  { id: "c5-glide", frame: 1460, durationSec: 0.42, file: "audio/sfx-glide.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "c5-resolve", frame: 1618, durationSec: 2.60, file: "audio/sfx-resolve.wav", volumeNoVo: 0.34, volumeWithVo: 0.10 },
];
