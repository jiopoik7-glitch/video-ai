import { FPS } from "../theme";

export type ActKey = "act1" | "act2" | "act3" | "act4" | "act5";

export interface ActRange {
  readonly from: number;
  readonly duration: number;
}

export interface WordItem {
  readonly text: string;
  readonly serifAccent?: boolean;
  readonly warmColor?: boolean;
}

export interface ChecklistItem {
  readonly id: string;
  readonly text: string;
  readonly appearLocal: number;
  readonly checkLocal: number;
}

export interface SpecPill {
  readonly tag: string;
  readonly label: string;
}

export interface SfxCue {
  readonly id: string;
  readonly act: ActKey;
  readonly localFrame: number;
  readonly durationSec: number;
  readonly file: string;
  readonly volumeNoVo: number;
  readonly volumeWithVo: number;
}

export interface ProductPhotoSlot {
  readonly enabled: boolean;
  readonly file: string;
}

export interface MediaConfig {
  readonly produk1: ProductPhotoSlot;
  readonly produk2: ProductPhotoSlot;
}

export const COMPOSITION_ID = "BenihTomatDataranRendah";
export const PRODUCT_SLUG = "benih-tomat-dataran-rendah";

// Sinkronkan dengan VIDEO_SECONDS di scripts/generate-audio.mjs
export const VIDEO_SECONDS = 20;
export const DURATION_IN_FRAMES = VIDEO_SECONDS * FPS; // 1200 frame

export const ACT_RATIOS = [0, 0.16, 0.40, 0.62, 0.83, 1] as const;

const BOUNDARIES = ACT_RATIOS.map((r) => Math.round(r * DURATION_IN_FRAMES));

export const ACTS: Record<ActKey, ActRange> = {
  act1: { from: BOUNDARIES[0], duration: BOUNDARIES[1] - BOUNDARIES[0] }, // 0..191 (192f / 3.20s)
  act2: { from: BOUNDARIES[1], duration: BOUNDARIES[2] - BOUNDARIES[1] }, // 192..479 (288f / 4.80s)
  act3: { from: BOUNDARIES[2], duration: BOUNDARIES[3] - BOUNDARIES[2] }, // 480..743 (264f / 4.40s)
  act4: { from: BOUNDARIES[3], duration: BOUNDARIES[4] - BOUNDARIES[3] }, // 744..995 (252f / 4.20s)
  act5: { from: BOUNDARIES[4], duration: BOUNDARIES[5] - BOUNDARIES[4] }, // 996..1199 (204f / 3.40s)
};

export function toGlobalFrame(act: ActKey, localFrame: number): number {
  return ACTS[act].from + localFrame;
}

export const MEDIA_CONFIG: MediaConfig = {
  produk1: {
    enabled: false,
    file: "media/produk-1.jpg",
  },
  produk2: {
    enabled: false,
    file: "media/produk-2.jpg",
  },
};

export const COPY = {
  brandName: "Seflorner",
  productName: "Benih Tomat Dataran Rendah",
  statusTime: "09:41",
  act1: {
    notifHeader: "Pengingat · Baru saja",
    notifBody: "Tomat di rumah sering rontok sebelum jadi buah?",
    headline: [
      { text: "Dataran" },
      { text: "rendah" },
      { text: "tetap" },
      { text: "bisa" },
      { text: "berbuah", serifAccent: true },
    ] as readonly WordItem[],
  },
  act2: {
    tag: "CATATAN KEBUN · SIMPAN",
    title: "Rawat Tomat Panas",
    // Video 20 detik (< 22 detik): tepat 3 poin checklist, tanpa mini-bar
    items: [
      {
        id: "c1",
        text: "Pilih benih tahan suhu hangat",
        appearLocal: 24,
        checkLocal: 42,
      },
      {
        id: "c2",
        text: "Pakai media poros sekam kompos",
        appearLocal: 74,
        checkLocal: 92,
      },
      {
        id: "c3",
        text: "Siram pagi, pangkas tunas air",
        appearLocal: 124,
        checkLocal: 142,
      },
    ] as readonly ChecklistItem[],
  },
  act3: {
    tag: "SIMULASI RAWATAN · ILUSTRASI",
    metricLabel: "Skor Rawatan (Ilustrasi)",
    beforeLabel: "Siram Saja",
    afterLabel: "Rawatan Rutin",
    beforeStatus: "Rawan Layu",
    afterStatus: "Tumbuh Segar",
    beforeScore: 35,
    afterScore: 90,
  },
  act4: {
    tag: "REKOMENDASI",
    title: "Benih Tomat",
    subtitle: "Dataran Rendah",
    buttonIdle: "Simpan Catatan",
    buttonDone: "Tersimpan",
    // Video 20 detik (< 22 detik): maksimal 2 pil spesifikasi nyata (tanpa klaim mengarang)
    specs: [
      { tag: "ADAPTASI", label: "Cocok Suhu Hangat" },
      { tag: "PERAWATAN", label: "Mudah Untuk Pemula" },
    ] as readonly SpecPill[],
  },
  act5: {
    closingWords: [
      { text: "Rawat" },
      { text: "pelan" },
      { text: "dari" },
      { text: "rumah," },
      { text: "nikmati" },
      { text: "panen", serifAccent: true },
      { text: "sendiri." },
    ] as readonly WordItem[],
    ctaLabel: "Cek Keranjang Kuning",
    finaleSub: "Benih Tomat Dataran Rendah",
  },
} as const;

export const TIMELINE = {
  act1: {
    notifStart: 6,
    notifTextStart: 14,
    headlineStart: 56,
    exitStart: 170,
  },
  act2: {
    cardStart: 0,
    exitStart: 266,
  },
  act3: {
    cardStart: 0,
    cursorAppear: 16,
    tapStart: 44,
    dragEnd: 140,
    metricEnd: 156,
    cursorHide: 184,
    exitStart: 242,
  },
  act4: {
    sheetStart: 0,
    pill1Start: 38,
    pill2Start: 58,
    cursorAppear: 102,
    buttonTap: 148,
    cursorHide: 192,
    exitStart: 230,
  },
  act5: {
    closingStart: 0,
    ctaAppear: 22,
    ctaPress: 42,
    resolveStart: 44,
    phaseAExit: 64,
    finaleStart: 68,
  },
} as const;

export const SFX_CUES: readonly SfxCue[] = [
  {
    id: "sfx-act1-notif",
    act: "act1",
    localFrame: TIMELINE.act1.notifStart,
    durationSec: 0.45,
    file: "audio/sfx-ios-notif.wav",
    volumeNoVo: 0.32,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act2-glide",
    act: "act2",
    localFrame: TIMELINE.act2.cardStart,
    durationSec: 0.38,
    file: "audio/sfx-glass-glide.wav",
    volumeNoVo: 0.28,
    volumeWithVo: 0.09,
  },
  {
    id: "sfx-act2-check-1",
    act: "act2",
    localFrame: COPY.act2.items[0].checkLocal,
    durationSec: 0.18,
    file: "audio/sfx-droplet-check.wav",
    volumeNoVo: 0.28,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act2-check-2",
    act: "act2",
    localFrame: COPY.act2.items[1].checkLocal,
    durationSec: 0.18,
    file: "audio/sfx-droplet-check.wav",
    volumeNoVo: 0.29,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act2-check-3",
    act: "act2",
    localFrame: COPY.act2.items[2].checkLocal,
    durationSec: 0.18,
    file: "audio/sfx-droplet-check.wav",
    volumeNoVo: 0.30,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act3-glide",
    act: "act3",
    localFrame: TIMELINE.act3.cardStart,
    durationSec: 0.38,
    file: "audio/sfx-glass-glide.wav",
    volumeNoVo: 0.28,
    volumeWithVo: 0.09,
  },
  {
    id: "sfx-act3-tap",
    act: "act3",
    localFrame: TIMELINE.act3.tapStart,
    durationSec: 0.11,
    file: "audio/sfx-haptic-tap.wav",
    volumeNoVo: 0.32,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act4-glide",
    act: "act4",
    localFrame: TIMELINE.act4.sheetStart,
    durationSec: 0.38,
    file: "audio/sfx-glass-glide.wav",
    volumeNoVo: 0.30,
    volumeWithVo: 0.09,
  },
  {
    id: "sfx-act4-tap",
    act: "act4",
    localFrame: TIMELINE.act4.buttonTap,
    durationSec: 0.11,
    file: "audio/sfx-haptic-tap.wav",
    volumeNoVo: 0.32,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act5-tap",
    act: "act5",
    localFrame: TIMELINE.act5.ctaPress,
    durationSec: 0.11,
    file: "audio/sfx-haptic-tap.wav",
    volumeNoVo: 0.32,
    volumeWithVo: 0.10,
  },
  {
    id: "sfx-act5-resolve",
    act: "act5",
    localFrame: TIMELINE.act5.resolveStart,
    durationSec: 2.60,
    file: "audio/sfx-crystal-resolve.wav",
    volumeNoVo: 0.34,
    volumeWithVo: 0.10,
  },
];
