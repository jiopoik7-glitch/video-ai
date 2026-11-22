import { spring } from "remotion";
import { VIDEO_CONFIG } from "../config/videoConfig";

export const SPRING_PRESETS = {
  iosSpring: { damping: 24, stiffness: 180, mass: 1 },
  iosQuickSpring: { damping: 26, stiffness: 280, mass: 0.85 },
  iosSoftSpring: { damping: 28, stiffness: 120, mass: 1.1 },
  iosIslandSpring: { damping: 22, stiffness: 210, mass: 0.95 },
  iosSheetSpring: { damping: 26, stiffness: 165, mass: 1.05 },
  iosPressSpring: { damping: 18, stiffness: 360, mass: 0.6 },
  iosNotificationSpring: { damping: 20, stiffness: 190, mass: 0.9 },
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;

export const runSpring = (
  frame: number,
  delayFrames: number,
  preset: SpringPresetName = "iosSpring"
): number => {
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps: VIDEO_CONFIG.fps,
    config: SPRING_PRESETS[preset],
  });
};
