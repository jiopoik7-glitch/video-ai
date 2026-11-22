import { continueRender, delayRender, Easing } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 60;

export const COLORS = {
  GLASS_DARK: "linear-gradient(155deg, rgba(14, 24, 18, 0.72) 0%, rgba(10, 18, 13, 0.56) 100%)",
  GLASS_BORDER: "rgba(255, 255, 255, 0.24)",
  EMERALD: "#22C55E",
  EMERALD_DEEP: "#15803D",
  LIME_SOFT: "#86EFAC",
  AMBER: "#F59E0B",
  CORAL: "#FB7185",
  WHITE: "#FFFFFF",
  WHITE_MUTED: "rgba(255, 255, 255, 0.76)",
} as const;

export const FONT_SANS =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Inter", sans-serif';

export const EASE_LAND = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_PAN = Easing.bezier(0.65, 0, 0.35, 1);

export const SPRING_CRISP = { damping: 16, stiffness: 210, mass: 0.85 };
export const SPRING_SILKY = { damping: 20, stiffness: 150, mass: 0.95 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let loaded = false;

export function loadEditFonts(): void {
  if (typeof document === "undefined" || loaded) {
    return;
  }
  loaded = true;
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
