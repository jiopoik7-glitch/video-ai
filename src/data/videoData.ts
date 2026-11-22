export interface AudioEvent {
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
  readonly ENABLE_PRODUCT_PHOTO: boolean;
  readonly PHOTO_PRIMARY: string;
  readonly PHOTO_SECONDARY: string;
}

export const VIDEO_SPEC = {
  ID: "SeflornerStroberiGlass",
  WIDTH: 1080,
  HEIGHT: 1920,
  FPS: 60,
  DURATION_IN_FRAMES: 1200, // Tepat 20.00 detik
} as const;

/**
 * Konfigurasi Media Aman:
 * ENABLE_PRODUCT_PHOTO default false agar render langsung jalan dengan ilustrasi pot stroberi SVG.
 * Setelah menyimpan 2 foto stroberi ke public/media/produk-1.jpg & produk-2.jpg, ubah ke true!
 */
export const MEDIA_CONFIG: MediaConfig = {
  ENABLE_PROCEDURAL_AUDIO: true,
  ENABLE_VOICEOVER_FILE: false,
  VOICEOVER_FILE: "media/voiceover.mp3",
  ENABLE_PRODUCT_PHOTO: true,
  PHOTO_PRIMARY: "media/produk-1.jpg",
  PHOTO_SECONDARY: "media/produk-2.jpg",
};

export const ACT_TIMELINE = {
  ACT1_HOOK: { from: 0, duration: 195 },        // 00:00.00 - 00:03.25 (16.25%)
  ACT2_NOTES: { from: 195, duration: 285 },     // 00:03.25 - 00:08.00 (23.75%)
  ACT3_WIDGET: { from: 480, duration: 265 },    // 00:08.00 - 00:12.42 (22.08%)
  ACT4_SHEET: { from: 745, duration: 250 },     // 00:12.42 - 00:16.58 (20.83%)
  ACT5_OUTRO: { from: 995, duration: 205 },     // 00:16.58 - 00:20.00 (17.08%)
} as const;

export const CHECKLIST_ITEMS = [
  {
    title: "Pilih bibit adaptif dataran rendah",
    sub: "Varian California / Mencir lebih tahan suhu hangat",
    checkAt: 50,
  },
  {
    title: "Media tanam super poros & ringan",
    sub: "Campur sekam bakar, cocopeat, dan kompos (1:1:1)",
    checkAt: 97,
  },
  {
    title: "Sinar matahari pagi 4–6 jam",
    sub: "Teduhkan di teras saat terik siang menyengat",
    checkAt: 143,
  },
  {
    title: "Siram rutin tanpa air menggenang",
    sub: "Cukup jaga media lembap agar akar tetap segar",
    checkAt: 189,
  },
] as const;

export const PRODUCT_SPECS = [
  { label: "KONDISI", value: "Bibit Sehat Siap Tanam" },
  { label: "ADAPTASI", value: "Cocok Dataran Rendah" },
  { label: "PANEN", value: "Berbuah ±45–60 Hari" },
] as const;

export const AUDIO_EVENTS: readonly AudioEvent[] = [
  // Act 1: iOS notification chime
  { id: "act1-notif", frame: 10, durationInFrames: 30, file: "audio/sfx-ios-notif.wav", volume: 0.34 },
  // Act 2: Glass glide + 4 checklist droplet pops
  { id: "act2-glide", frame: 195, durationInFrames: 24, file: "audio/sfx-glass-glide.wav", volume: 0.28 },
  { id: "act2-check-1", frame: 245, durationInFrames: 12, file: "audio/sfx-droplet-check.wav", volume: 0.28 },
  { id: "act2-check-2", frame: 292, durationInFrames: 12, file: "audio/sfx-droplet-check.wav", volume: 0.29 },
  { id: "act2-check-3", frame: 338, durationInFrames: 12, file: "audio/sfx-droplet-check.wav", volume: 0.30 },
  { id: "act2-check-4", frame: 384, durationInFrames: 12, file: "audio/sfx-droplet-check.wav", volume: 0.31 },
  // Act 3: Widget glide + haptic slider grab + ripe chime
  { id: "act3-glide", frame: 480, durationInFrames: 24, file: "audio/sfx-glass-glide.wav", volume: 0.28 },
  { id: "act3-tap", frame: 525, durationInFrames: 8, file: "audio/sfx-haptic-tap.wav", volume: 0.32 },
  { id: "act3-ripe", frame: 668, durationInFrames: 30, file: "audio/sfx-ios-notif.wav", volume: 0.26 },
  // Act 4: Bottom sheet glide up + haptic save tap
  { id: "act4-glide", frame: 745, durationInFrames: 24, file: "audio/sfx-glass-glide.wav", volume: 0.30 },
  { id: "act4-save", frame: 890, durationInFrames: 8, file: "audio/sfx-haptic-tap.wav", volume: 0.34 },
  // Act 5: CTA haptic press + finale crystal resolve
  { id: "act5-press", frame: 1072, durationInFrames: 8, file: "audio/sfx-haptic-tap.wav", volume: 0.34 },
  { id: "act5-resolve", frame: 1086, durationInFrames: 114, file: "audio/sfx-crystal-resolve.wav", volume: 0.35 },
];
