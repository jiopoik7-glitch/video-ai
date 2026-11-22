export interface AudioSfxEvent {
  readonly id: string;
  readonly file: string;
  readonly startFrame: number;
  readonly volume: number;
}

export const BGM_FILE = "audio/bgm-ios-ambient.wav";

export const AUDIO_SFX_EVENTS: readonly AudioSfxEvent[] = [
  { id: "lock-notif", file: "audio/sfx-ios-notif.wav", startFrame: 60, volume: 0.75 },
  { id: "faceid-unlock", file: "audio/sfx-droplet-check.wav", startFrame: 310, volume: 0.65 },
  { id: "swipe-home", file: "audio/sfx-glass-whoosh.wav", startFrame: 455, volume: 0.6 },
  { id: "tap-app-1", file: "audio/sfx-haptic-tap.wav", startFrame: 720, volume: 0.7 },
  { id: "open-app-1", file: "audio/sfx-glass-whoosh.wav", startFrame: 780, volume: 0.55 },
  { id: "metric-pop", file: "audio/sfx-droplet-check.wav", startFrame: 1220, volume: 0.55 },
  { id: "open-app-2", file: "audio/sfx-glass-whoosh.wav", startFrame: 2220, volume: 0.55 },
  { id: "benefit-1", file: "audio/sfx-haptic-tap.wav", startFrame: 2440, volume: 0.45 },
  { id: "benefit-2", file: "audio/sfx-haptic-tap.wav", startFrame: 2660, volume: 0.45 },
  { id: "benefit-3", file: "audio/sfx-haptic-tap.wav", startFrame: 2880, volume: 0.45 },
  { id: "benefit-4", file: "audio/sfx-haptic-tap.wav", startFrame: 3100, volume: 0.45 },
  { id: "benefit-5", file: "audio/sfx-droplet-check.wav", startFrame: 3320, volume: 0.55 },
  { id: "open-app-3", file: "audio/sfx-glass-whoosh.wav", startFrame: 3780, volume: 0.55 },
  { id: "segment-switch", file: "audio/sfx-haptic-tap.wav", startFrame: 4220, volume: 0.65 },
  { id: "teaser-reveal", file: "audio/sfx-droplet-check.wav", startFrame: 4720, volume: 0.6 },
  { id: "final-resolve", file: "audio/sfx-resolve-chord.wav", startFrame: 5140, volume: 0.8 },
];
