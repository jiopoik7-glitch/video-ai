import { continueRender, delayRender, Easing } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 60;

export const SAFE = {
  top: 200,
  bottom: 480,
  left: 60,
  right: 140,
} as const;

export const PALETTE = {
  canvas: "#F5F6F2",
  accent: "#15803D",
  accentSoft: "rgba(21, 128, 61, 0.13)",
  warm: "#C2410C",
  warmSoft: "rgba(194, 65, 12, 0.12)",
  ink: "#0F1714",
  inkMuted: "#3D4D45",
  white: "#FFFFFF",
} as const;

export const FONTS = {
  sans: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  mono: '"JetBrains Mono", Menlo, Consolas, monospace',
} as const;

export const FONT_SIZE = {
  xs: 34,
  sm: 44,
  md: 56,
  lg: 72,
  xl: 96,
  xxl: 120,
  hero: 160,
} as const;

export const RADIUS = {
  notif: 24,
  card: 36,
  sheet: 40,
  pill: 999,
} as const;

export const EASE_APPLE = Easing.bezier(0.16, 1, 0.3, 1);

export const SPRING_SILKY = {
  damping: 20,
  stiffness: 145,
} as const;

export const SPRING_TACTILE = {
  damping: 14,
  stiffness: 240,
} as const;

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * Deterministic seeded PRNG (mulberry32) for Remotion multi-tab parallel rendering.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let fontLoaderTriggered = false;

export function loadAppleEditorialFonts(): void {
  if (typeof document === "undefined" || fontLoaderTriggered) {
    return;
  }
  fontLoaderTriggered = true;

  const handle = delayRender("Loading Apple-Editorial Google Fonts", {
    timeoutInMilliseconds: 8000,
  });

  let finished = false;
  const finishOnce = () => {
    if (!finished) {
      finished = true;
      continueRender(handle);
    }
  };

  // Satu-satunya penggunaan setTimeout yang diizinkan: fallback batas tunggu 3200ms bila offline
  const fallbackTimer = globalThis.setTimeout(finishOnce, 3200);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = GOOGLE_FONTS_URL;
  link.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          globalThis.clearTimeout(fallbackTimer);
          finishOnce();
        })
        .catch(() => {
          globalThis.clearTimeout(fallbackTimer);
          finishOnce();
        });
    } else {
      globalThis.clearTimeout(fallbackTimer);
      finishOnce();
    }
  };
  link.onerror = () => {
    globalThis.clearTimeout(fallbackTimer);
    finishOnce();
  };
  document.head.appendChild(link);
}
