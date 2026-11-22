import { continueRender, delayRender, Easing } from "remotion";

export const COLORS = {
  CANVAS: "#F6F5F2",
  INK: "#111A14",
  MUTED: "#4F5E55",
  SUBTLE: "#7C8C82",
  BERRY: "#E11D48",
  BERRY_SOFT: "rgba(225, 29, 72, 0.12)",
  EMERALD: "#15803D",
  LEAF: "#22C55E",
  EMERALD_SOFT: "rgba(21, 128, 61, 0.12)",
  AMBER: "#D97706",
  WHITE: "#FFFFFF",
} as const;

export const FONTS = {
  SANS: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  SERIF: '"Instrument Serif", Georgia, serif',
  MONO: '"JetBrains Mono", Menlo, Consolas, monospace',
} as const;

export const SAFE_ZONE = {
  paddingTop: 158,
  paddingBottom: 288,
  paddingLeft: 60,
  paddingRight: 60,
} as const;

export const EASE_APPLE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

export const SPRING_SILKY = { damping: 20, stiffness: 145, mass: 0.95 };
export const SPRING_TACTILE = { damping: 14, stiffness: 240, mass: 0.75 };

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const LIQUID_GLASS_STYLE = {
  background:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.42) 100%)",
  backdropFilter: "blur(28px) saturate(185%)",
  WebkitBackdropFilter: "blur(28px) saturate(185%)",
  border: "1.5px solid rgba(255, 255, 255, 0.85)",
  boxShadow:
    "0 24px 60px rgba(15, 23, 20, 0.10), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(15, 23, 20, 0.05)",
} as const;

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let loaded = false;

export function loadLiquidFonts(): void {
  if (typeof document === "undefined" || loaded) return;
  loaded = true;
  const handle = delayRender("Loading iOS Liquid Glass Fonts");
  let settled = false;
  const finish = () => {
    if (!settled) {
      settled = true;
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
