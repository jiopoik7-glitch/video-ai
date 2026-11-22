import { continueRender, delayRender, Easing } from "remotion";

export const COLORS = {
  CANVAS: "#FBFBF7",
  WHITE: "#FFFFFF",
  INK: "#111A14",
  MUTED: "#546359",
  SUBTLE: "#829187",
  EMERALD: "#15803D",
  LEAF: "#22C55E",
  MINT: "#86EFAC",
  SAGE_SOFT: "#ECF5EE",
  AMBER: "#D97706",
  AMBER_SOFT: "#FEF3C7",
  TERRACOTTA: "#C25B3F",
  DANGER: "#DC2626",
  DANGER_SOFT: "#FEE2E2",
  BORDER: "rgba(17, 26, 20, 0.09)",
  BORDER_STRONG: "rgba(21, 128, 61, 0.25)",
} as const;

export const FONTS = {
  SANS: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  SERIF: '"Instrument Serif", Georgia, serif',
  MONO: '"JetBrains Mono", Menlo, Consolas, monospace',
} as const;

export const EASE_APPLE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

export const SPRING_SILKY = { damping: 20, stiffness: 135, mass: 0.95 };
export const SPRING_SNAPPY = { damping: 16, stiffness: 195, mass: 0.8 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let loaded = false;

export function loadFonts(): void {
  if (typeof document === "undefined" || loaded) return;
  loaded = true;
  const handle = delayRender("Loading Editorial Fonts");
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
