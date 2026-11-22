import { FPS } from "../theme";

export type BabakKey = "babak1" | "babak2" | "babak3" | "babak4";

export interface GuideStep {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly desc: string;
  readonly appearLocal: number;
  readonly checkLocal: number;
}

export interface ComparePoint {
  readonly title: string;
  readonly desc: string;
}

export interface SfxCue {
  readonly id: string;
  readonly frame: number;
  readonly durationSec: number;
  readonly file: string;
  readonly volumeNoVo: number;
  readonly volumeWithVo: number;
}

export interface MediaConfig {
  readonly produk1: {
    readonly enabled: boolean;
    readonly file: string;
  };
}

export const COMPOSITION_ID = "RawatStroberiIos26";
export const PRODUCT_SLUG = "rawat-stroberi-dataran-rendah";

export const VIDEO_SECONDS = 20;
export const DURATION_IN_FRAMES = VIDEO_SECONDS * FPS; // 1200 frame @ 60 FPS

// Transisi kontinu dengan overlap halus (ZERO BLANK FRAMES!)
export const TIMING = {
  // Babak 1: iOS 26 Lock Screen Hook (0.0s - 4.4s -> f0..264)
  lockScreen: {
    from: 0,
    duration: 270,
    notifDrop: 12,
    unlockStart: 236,
    unlockEnd: 266,
  },
  // Babak 2: iOS Inset Grouped Guide (3.9s - 10.9s -> f236..654)
  guide: {
    from: 236,
    duration: 424,
    enterEnd: 28,
    exitStart: 392,
    exitEnd: 420,
  },
  // Babak 3: iOS 26 Segmented Glass Control (10.5s - 20.0s -> tetap aktif di belakang Sheet Babak 4!)
  compare: {
    from: 632,
    duration: 568, // f632..1199 -> mundur ke belakang (scale 0.91) saat Sheet naik di f912!
    switchAt: 112, // f744 global (12.40s): kapsul kaca geser mulus dari "Cara Biasa" -> "Cara Tepat"
    sheetRecedeStart: 280, // f912 global (15.20s): mulai mundur jadi modal depth!
  },
  // Babak 4: iOS 26 Native Modal Sheet Reveal (15.2s - 20.0s -> f912..1199)
  modalSheet: {
    from: 912,
    duration: 288,
    ctaPulseAt: 116, // f1028 global (17.13s): haptic pulse tombol Prominent CTA
  },
} as const;

export const MEDIA_CONFIG: MediaConfig = {
  produk1: {
    enabled: true,
    file: "media/produk-1.jpg",
  },
};

export const CONTENT = {
  brand: "Seflorner",
  statusTime: "09:41",
  lockDate: "Minggu, 22 November",
  lockNotif: {
    appName: "Seflorner",
    timeLabel: "sekarang",
    headline: "Stroberi di kota sering layu?",
    body: "Bukan kurang air, tapi akarnya kepanasan. Ini 3 kunci rawatnya.",
  },
  guide: {
    badge: "3 Aturan Utama",
    largeTitle: "Rawat Stroberi Kota",
    subtitle: "Rahasia agar tetap sejuk dan rajin berbuah di dataran rendah.",
    steps: [
      {
        id: "s1",
        number: "1",
        title: "Cukup Matahari Pagi",
        desc: "4–6 jam pagi, teduhkan saat siang terik.",
        appearLocal: 30,
        checkLocal: 68,
      },
      {
        id: "s2",
        number: "2",
        title: "Media Dingin & Poros",
        desc: "Sekam bakar dan cocopeat jaga akar bernapas.",
        appearLocal: 132,
        checkLocal: 170,
      },
      {
        id: "s3",
        number: "3",
        title: "Pangkas Sulur Pertama",
        desc: "Fokuskan nutrisi ke bunga dan buah manis.",
        appearLocal: 234,
        checkLocal: 272,
      },
    ] as readonly GuideStep[],
  },
  compare: {
    badge: "Perbandingan Nyata",
    largeTitle: "Suhu 31–34°C",
    tabLeft: "Cara Biasa",
    tabRight: "Cara Tepat",
    leftPoints: [
      {
        title: "Jemur penuh siang hari",
        desc: "Daun mudah terbakar dan bunga cepat gugur.",
      },
      {
        title: "Tanah padat dan becek",
        desc: "Akar kepanasan, kurang oksigen, lalu layu.",
      },
    ] as readonly ComparePoint[],
    rightPoints: [
      {
        title: "Teduh siang + media poros",
        desc: "Akar tetap sejuk sehingga daun tumbuh rimbun.",
      },
      {
        title: "Siram pagi + pangkas sulur",
        desc: "Energi tanaman fokus membentuk buah manis.",
      },
    ] as readonly ComparePoint[],
    footerNote: "Kunci harian: siram secukupnya tiap pagi, jangan sampai menggenang.",
  },
  sheet: {
    eyebrow: "Panduan & Rekomendasi",
    title: "Bibit Stroberi Dataran Rendah",
    pills: ["Adaptif Suhu Hangat", "Mudah untuk Pemula"] as readonly string[],
    ctaText: "Cek Keranjang Kuning",
    brandFooter: "Edukasi Kebun · Seflorner",
  },
} as const;

export const SFX_CUES: readonly SfxCue[] = [
  // Babak 1: Notifikasi kaca masuk + swipe unlock
  { id: "b1-notif", frame: 12, durationSec: 0.45, file: "audio/sfx-ios-notif.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "b1-unlock", frame: 236, durationSec: 0.35, file: "audio/sfx-glass-whoosh.wav", volumeNoVo: 0.28, volumeWithVo: 0.09 },
  // Babak 2: 3 droplet checkmarks (236 + 68, 170, 272)
  { id: "b2-check1", frame: 304, durationSec: 0.16, file: "audio/sfx-droplet-check.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "b2-check2", frame: 406, durationSec: 0.16, file: "audio/sfx-droplet-check.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "b2-check3", frame: 508, durationSec: 0.16, file: "audio/sfx-droplet-check.wav", volumeNoVo: 0.31, volumeWithVo: 0.10 },
  // Babak 3: Masuk perbandingan + Segmented Control haptic snap
  { id: "b3-in", frame: 632, durationSec: 0.35, file: "audio/sfx-glass-whoosh.wav", volumeNoVo: 0.26, volumeWithVo: 0.09 },
  { id: "b3-switch", frame: 744, durationSec: 0.10, file: "audio/sfx-haptic-tap.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  // Babak 4: Native Modal Sheet naik + CTA haptic pulse + Resolve chord
  { id: "b4-sheet", frame: 912, durationSec: 0.35, file: "audio/sfx-glass-whoosh.wav", volumeNoVo: 0.30, volumeWithVo: 0.10 },
  { id: "b4-cta", frame: 1028, durationSec: 0.10, file: "audio/sfx-haptic-tap.wav", volumeNoVo: 0.34, volumeWithVo: 0.11 },
  { id: "b4-resolve", frame: 1034, durationSec: 2.40, file: "audio/sfx-resolve-chord.wav", volumeNoVo: 0.34, volumeWithVo: 0.10 },
];
