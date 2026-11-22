import { continueRender, delayRender, Easing } from "remotion";

export const W = 1920;
export const H = 1080;
export const FPS = 60;

export const COLORS = {
  CREAM: "#F6F7F2",
  NIGHT: "#08120C",
  NIGHT_CARD: "#101E15",
  EMERALD: "#15803D",
  LEAF: "#22C55E",
  SAGE_MIST: "#DCFCE7",
  WARM_GOLD: "#D97706",
  TERRACOTTA: "#C25B3F",
  TOMATO: "#E11D48",
  INK: "#0D1912",
  INK_MUTED: "#4A5C51",
  WHITE: "#F9FBF9",
  WHITE_MUTED: "rgba(249, 251, 249, 0.72)",
  LINE_LIGHT: "rgba(13, 25, 18, 0.10)",
  LINE_DARK: "rgba(249, 251, 249, 0.14)",
} as const;

export const FONTS = {
  SANS: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
  SERIF: '"Instrument Serif", Georgia, serif',
} as const;

// True After Effects Speed-Graph Curves (75%-90% Influence!)
export const AE_WHIP = Easing.bezier(0.76, 0, 0.24, 1);        // Fast mid-swing whip pan
export const AE_SMOOTH_LAND = Easing.bezier(0.16, 1, 0.3, 1);  // Long silky ease-out landing
export const AE_DRAMA_IN = Easing.bezier(0.85, 0, 0.15, 1);    // Dramatic S-curve camera glide
export const AE_EASE_IN = Easing.bezier(0.64, 0, 0.78, 0);     // Clean acceleration exit

export const SPRING_FLUID = { damping: 18, stiffness: 155, mass: 0.9 };
export const SPRING_CRISP = { damping: 14, stiffness: 210, mass: 0.78 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let loaded = false;

export function loadStoryFonts(): void {
  if (typeof document === "undefined" || loaded) {
    return;
  }
  loaded = true;
  const handle = delayRender("Loading Editorial Fonts", {
    timeoutInMilliseconds: 8000,
  });
  let done = false;
  const finish = () => {
    if (!done) {
      done = true;
      continueRender(handle);
    }
  };
  const timer = globalThis.setTimeout(finish, 3200);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  link.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => { globalThis.clearTimeout(timer); finish(); })
        .catch(() => { globalThis.clearTimeout(timer); finish(); });
    } else {
      globalThis.clearTimeout(timer);
      finish();
    }
  };
  link.onerror = () => {
    globalThis.clearTimeout(timer);
    finish();
  };
  document.head.appendChild(link);
}
