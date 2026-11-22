export type IslandMode = "idle" | "faceid" | "compact" | "expanded" | "completed";

export interface IslandEvent {
  readonly startFrame: number;
  readonly mode: IslandMode;
  readonly title: string;
  readonly subtitle: string;
  readonly stepLabel: string;
  readonly progress: number;
}

export const ISLAND_TIMELINE: readonly IslandEvent[] = [
  {
    startFrame: 0,
    mode: "idle",
    title: "Unlock The Garden",
    subtitle: "Siap dimulai",
    stepLabel: "0/3",
    progress: 0,
  },
  {
    startFrame: 280,
    mode: "faceid",
    title: "Face ID",
    subtitle: "Terverifikasi",
    stepLabel: "OK",
    progress: 0.1,
  },
  {
    startFrame: 480,
    mode: "compact",
    title: "Unlock Garden",
    subtitle: "Pilih aplikasi",
    stepLabel: "1/3",
    progress: 0.15,
  },
  {
    startFrame: 840,
    mode: "expanded",
    title: "WHY GARDEN?",
    subtitle: "Langkah 1 dari 3 · Ketahanan Pangan",
    stepLabel: "1/3",
    progress: 0.33,
  },
  {
    startFrame: 1120,
    mode: "compact",
    title: "Why Garden?",
    subtitle: "Inflasi 5,81%",
    stepLabel: "1/3",
    progress: 0.33,
  },
  {
    startFrame: 2280,
    mode: "expanded",
    title: "THE BENEFITS",
    subtitle: "Langkah 2 dari 3 · 5 Manfaat Utama",
    stepLabel: "2/3",
    progress: 0.66,
  },
  {
    startFrame: 2560,
    mode: "compact",
    title: "The Benefits",
    subtitle: "5 Manfaat",
    stepLabel: "2/3",
    progress: 0.66,
  },
  {
    startFrame: 3840,
    mode: "expanded",
    title: "START SMALL",
    subtitle: "Langkah 3 dari 3 · Mulai dari 1 Pot",
    stepLabel: "3/3",
    progress: 1.0,
  },
  {
    startFrame: 4120,
    mode: "compact",
    title: "Start Small",
    subtitle: "1 Pot Cukup",
    stepLabel: "3/3",
    progress: 1.0,
  },
  {
    startFrame: 5160,
    mode: "completed",
    title: "Garden Unlocked",
    subtitle: "Small Space. Big Impact.",
    stepLabel: "3/3",
    progress: 1.0,
  },
];

export const getActiveIslandEvent = (frame: number): IslandEvent => {
  const firstEvent = ISLAND_TIMELINE[0];
  if (firstEvent === undefined) {
    throw new Error("ISLAND_TIMELINE must contain at least one event.");
  }
  let active: IslandEvent = firstEvent;
  for (const ev of ISLAND_TIMELINE) {
    if (frame >= ev.startFrame) {
      active = ev;
    }
  }
  return active;
};
