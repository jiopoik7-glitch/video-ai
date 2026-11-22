export interface SceneWindow {
  readonly id: string;
  readonly name: string;
  readonly startFrame: number;
  readonly durationInFrames: number;
  readonly endFrame: number;
  readonly theme: "dark" | "light";
  readonly clockText: string;
}

export const SCENE_TIMELINE = {
  lockScreen: {
    id: "lock-screen",
    name: "The Lock Screen",
    startFrame: 0,
    durationInFrames: 480,
    endFrame: 479,
    theme: "dark" as const,
    clockText: "07:12",
  },
  homeScreen: {
    id: "home-screen",
    name: "The Home Screen",
    startFrame: 480,
    durationInFrames: 300,
    endFrame: 779,
    theme: "dark" as const,
    clockText: "07:12",
  },
  whyGarden: {
    id: "why-garden",
    name: "App 01 — WHY GARDEN?",
    startFrame: 780,
    durationInFrames: 1440,
    endFrame: 2219,
    theme: "dark" as const,
    clockText: "07:13",
  },
  theBenefits: {
    id: "the-benefits",
    name: "App 02 — THE BENEFITS",
    startFrame: 2220,
    durationInFrames: 1560,
    endFrame: 3779,
    theme: "light" as const,
    clockText: "07:14",
  },
  startSmall: {
    id: "start-small",
    name: "App 03 — START SMALL",
    startFrame: 3780,
    durationInFrames: 1320,
    endFrame: 5099,
    theme: "light" as const,
    clockText: "07:15",
  },
  finalMessage: {
    id: "final-message",
    name: "The Final Message",
    startFrame: 5100,
    durationInFrames: 780,
    endFrame: 5879,
    theme: "dark" as const,
    clockText: "07:16",
  },
} as const;
