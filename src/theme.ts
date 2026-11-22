import { continueRender, delayRender, Easing } from "remotion";

export const W = 1920;
export const H = 1080;
export const FPS = 60;

export const COLORS = {
  LIGHT_BG: "#F7F8F5",
  DARK_BG: "#060A05",
  DARK_SURFACE: "#121B11",
  LIME: "#A3E600",
  LIME_BRIGHT: "#B6F716",
  EMERALD: "#15803D",
  DEEP_GREEN: "#0B3D1E",
  INK: "#0C120B",
  INK_MUTED: "#5A6957",
  WHITE: "#FFFFFF",
  WHITE_MUTED: "rgba(255, 255, 255, 0.68)",
  CORAL: "#F43F5E",
  AMBER: "#F59E0B",
} as const;

export const FONT_SANS =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Inter", sans-serif';

// Kurva Whip-Snap After Effects (akselerasi tajam, mengunci mantap — anti kaku!)
export const EASE_WHIP = Easing.bezier(0.83, 0, 0.17, 1);
export const EASE_EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_SNAP_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const SPRING_PUNCH = { damping: 14, stiffness: 220, mass: 0.8 };
export const SPRING_SILKY = { damping: 20, stiffness: 150, mass: 0.92 };
export const SPRING_BOUNCE = { damping: 11, stiffness: 250, mass: 0.72 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let fontLoaded = false;

export function loadKineticFonts(): void {
  if (typeof document === "undefined" || fontLoaded) {
    return;
  }
  fontLoaded = true;
  const handle = delayRender("Loading Plus Jakarta Sans", {
    timeoutInMilliseconds: 8000,
  });
  let settled = false;
  const done = () => {
    if (!settled) {
      settled = true;
      continueRender(handle);
    }
  };
  const timer = globalThis.setTimeout(done, 3200);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  link.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => { globalThis.clearTimeout(timer); done(); })
        .catch(() => { globalThis.clearTimeout(timer); done(); });
    } else {
      globalThis.clearTimeout(timer);
      done();
    }
  };
  link.onerror = () => {
    globalThis.clearTimeout(timer);
    done();
  };
  document.head.appendChild(link);
}
