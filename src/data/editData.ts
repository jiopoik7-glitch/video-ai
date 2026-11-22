import { FPS } from "../theme";

export interface SfxEvent {
  readonly id: string;
  readonly frame: number;
  readonly durationSec: number;
  readonly file: string;
  readonly volume: number;
}

export const COMPOSITION_ID = "BiviInfarmEdit";
// Video asli 20.933s -> 1250 frames (20.83s @ 60fps) agar ujung akhir bersih tanpa freeze frame
export const DURATION_IN_FRAMES = 1250;
export const RAW_VIDEO_PATH = "media/raw.mp4";

// Titik potongan klip tepat sesuai footage video_1.mp4
export const CUTS = {
  CLIP1_MEALYBUG: { from: 0, duration: 332 },      // 00:00.00 - 00:05.53 (Kutu putih di pucuk daun)
  CLIP2_SOOTY_MOLD: { from: 332, duration: 364 },  // 00:05.53 - 00:11.60 (Daun menghitam kena jelaga)
  CLIP3_SPRAYING: { from: 696, duration: 312 },    // 00:11.60 - 00:16.80 (Aksi semprot pestisida BIVI)
  CLIP4_BOTTLE: { from: 1008, duration: 242 },     // 00:16.80 - 00:20.83 (Botol BIVI Ready To Use 500 ml + CTA)
} as const;

export const CHAIN_STEPS = [
  { id: "s1", label: "Kutu Putih", activateAtLocal: 24 },
  { id: "s2", label: "Embun Madu", activateAtLocal: 136 },
  { id: "s3", label: "Jelaga Hitam", activateAtLocal: 222 },
] as const;

export const BOTTLE_SPECS = [
  { label: "Langsung Semprot", appearLocal: 18 },
  { label: "Netto 500 ml", appearLocal: 34 },
  { label: "Jaga Daun Muda", appearLocal: 50 },
] as const;

// SFX halus (volume 0.16 - 0.24) agar mempertegas cut tanpa menabrak suara vokal & BGM asli raw.mp4
export const SFX_EVENTS: readonly SfxEvent[] = [
  { id: "c1-focus", frame: 48, durationSec: 0.28, file: "audio/sfx-focus-ping.wav", volume: 0.22 },
  { id: "c2-whoosh", frame: 330, durationSec: 0.30, file: "audio/sfx-whoosh.wav", volume: 0.20 },
  { id: "c2-pop1", frame: 356, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.17 },
  { id: "c2-pop2", frame: 468, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.18 },
  { id: "c2-pop3", frame: 554, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.20 },
  { id: "c3-whoosh", frame: 694, durationSec: 0.30, file: "audio/sfx-whoosh.wav", volume: 0.20 },
  { id: "c3-pop", frame: 750, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.18 },
  { id: "c4-whoosh", frame: 1006, durationSec: 0.30, file: "audio/sfx-whoosh.wav", volume: 0.22 },
  { id: "c4-spec1", frame: 1026, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.16 },
  { id: "c4-spec2", frame: 1042, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.16 },
  { id: "c4-spec3", frame: 1058, durationSec: 0.14, file: "audio/sfx-step-pop.wav", volume: 0.18 },
  { id: "c4-cta", frame: 1126, durationSec: 0.12, file: "audio/sfx-haptic-cta.wav", volume: 0.24 },
];

export const FPS_VAL = FPS;
