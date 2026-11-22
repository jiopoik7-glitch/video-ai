import { continueRender, delayRender, Easing } from "remotion";

export const W = 1920;
export const H = 1080;
export const FPS = 60;

// Seni Titik Fokus (Art Direction Grid: Rule of Thirds & Optical Center)
export const ART_GRID = {
  marginX: 136,
  thirdLeft: 640,      // 33.3% Rule of Thirds X
  thirdRight: 1280,    // 66.6% Rule of Thirds X
  opticalCenterY: 492, // 45.5% Optical Center (lebih seimbang secara visual daripada 540px!)
} as const;

export const COLORS = {
  CREAM: "#F6F5F0",
  CREAM_CARD: "#FFFFFF",
  NIGHT: "#07110B",
  NIGHT_CARD: "#0F1D14",
  EMERALD: "#15803D",
  LEAF: "#22C55E",
  MINT_BRIGHT: "#4ADE80",
  WARM_GOLD: "#D97706",
  AMBER_BRIGHT: "#FBBF24",
  TERRACOTTA: "#C25B3F",
  TOMATO: "#E11D48",
  WATER: "#0284C7",
  INK: "#0C1811",
  INK_MUTED: "#4A5C51",
  WHITE: "#F9FBF9",
  WHITE_MUTED: "rgba(249, 251, 249, 0.74)",
  LINE_LIGHT: "rgba(12, 24, 17, 0.09)",
  LINE_DARK: "rgba(249, 251, 249, 0.14)",
} as const;

export const FONTS = {
  SANS: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
  SERIF: '"Instrument Serif", Georgia, serif',
} as const;

// Kurva Gerak Kamera AE Super Mulus (Silky Quintic & Expo — tanpa hentakan kasar!)
export const AE_SILKY_PAN = Easing.bezier(0.65, 0, 0.35, 1);     // Smooth camera pan-across
export const AE_LANDING = Easing.bezier(0.22, 1, 0.36, 1);       // Weightless long deceleration
export const AE_PORTAL = Easing.bezier(0.77, 0, 0.175, 1);       // Elegant aperture reveal

export const SPRING_VELVET = { damping: 22, stiffness: 135, mass: 1.0 };
export const SPRING_TACTILE = { damping: 16, stiffness: 195, mass: 0.85 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let loaded = false;

export function loadArtFonts(): void {
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
