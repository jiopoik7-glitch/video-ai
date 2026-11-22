import { continueRender, delayRender } from "remotion";

export const COLORS = {
  // Light Notebook Canvas
  PAPER: "#F6F4EC",
  INK: "#141715",
  SLATE: "#555C57",
  SAGE: "#E8EFE8",
  WHITE: "#FFFFFF",
  CRIMSON: "#B83B2A",
  LIME: "#DDFC35",
  BORDER_LIGHT: "rgba(20, 23, 21, 0.14)",
  BORDER_STRONG: "rgba(20, 23, 21, 0.28)",

  // Dark Impact Canvas
  CHARCOAL: "#111312",
  DARK_SURFACE: "#1A1E1C",
  DARK_TEXT: "#F6F4EC",
  DARK_MUTED: "#9BA39E",
  BORDER_DARK: "rgba(246, 244, 236, 0.16)",
  CROP_LIGHT: "rgba(20, 24, 22, 0.28)",
  CROP_DARK: "rgba(246, 244, 236, 0.28)",
} as const;

export const FONTS = {
  SANS: '"Plus Jakarta Sans", Arial, sans-serif',
  SERIF: '"Instrument Serif", Georgia, serif',
  MONO: '"JetBrains Mono", Consolas, monospace',
} as const;

export const TYPE_SCALE = {
  DISPLAY: 84,
  SECTION_HEADER: 48,
  CARD_TITLE: 28,
  BODY: 23,
  DATA_LABEL: 19,
  META: 18,
} as const;

export const SPRING_SNAPPY = {
  damping: 18,
  stiffness: 200,
  mass: 0.85,
};

export const SPRING_EDITORIAL = {
  damping: 22,
  stiffness: 140,
  mass: 1.0,
};

export const SPRING_BOUNCY_MICRO = {
  damping: 14,
  stiffness: 260,
  mass: 0.7,
};

export const SAFE_ZONE = {
  paddingTop: 112,
  paddingBottom: 210,
  paddingLeft: 84,
  paddingRight: 84,
  pipAvoidBottom: 210,
  pipAvoidRight: 340,
} as const;

export const SHADOWS = {
  CARD_LIGHT: "0 12px 32px rgba(20, 23, 21, 0.06), 0 2px 6px rgba(20, 23, 21, 0.04)",
  CARD_DARK: "0 18px 44px rgba(0, 0, 0, 0.42)",
  PIP: "0 14px 36px rgba(17, 19, 18, 0.28), 0 2px 8px rgba(17, 19, 18, 0.16)",
  TOAST: "0 8px 24px rgba(17, 19, 18, 0.22)",
} as const;

export const BORDERS = {
  LIGHT: `1px solid ${COLORS.BORDER_LIGHT}`,
  LIGHT_STRONG: `1.5px solid ${COLORS.BORDER_STRONG}`,
  DARK: `1px solid ${COLORS.BORDER_DARK}`,
  CRIMSON: `1.5px solid ${COLORS.CRIMSON}`,
} as const;

export const SPACING = {
  XS: 8,
  SM: 16,
  MD: 24,
  LG: 32,
  XL: 48,
} as const;

export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  SUBTITLE: 30,
  CHROME: 40,
  PIP: 50,
} as const;

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

let fontLoadStarted = false;

/**
 * Safely loads Plus Jakarta Sans, Instrument Serif (Italic), and JetBrains Mono.
 * Never crashes rendering if offline thanks to explicit fallback stacks and timeout guard.
 */
export function ensureEditorialFontsLoaded(): void {
  if (typeof document === "undefined" || fontLoadStarted) {
    return;
  }
  fontLoadStarted = true;

  const handle = delayRender("Loading Swiss Editorial Google Fonts");
  let settled = false;
  const finish = () => {
    if (!settled) {
      settled = true;
      continueRender(handle);
    }
  };

  // Timeout guard so offline/restricted renders still succeed smoothly with fallback fonts
  const timer = globalThis.setTimeout(finish, 3500);

  const existing = document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`);
  if (!existing) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    link.onload = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          globalThis.clearTimeout(timer);
          finish();
        }).catch(() => {
          globalThis.clearTimeout(timer);
          finish();
        });
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
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      globalThis.clearTimeout(timer);
      finish();
    }).catch(() => {
      globalThis.clearTimeout(timer);
      finish();
    });
  } else {
    globalThis.clearTimeout(timer);
    finish();
  }
}
