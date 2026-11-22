import { continueRender, delayRender, Easing } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 60;

// Simetris iPhone asli (44px kiri-kanan) + Safe Zone vertikal TikTok (top >= 180, konten penting di atas y = 1480)
export const LAYOUT = {
  padX: 44,
  topSafe: 184,
  bottomSafe: 440, // 1920 - 440 = y 1480 batas aman di atas caption & keranjang kuning TikTok
} as const;

export const IOS_COLORS = {
  wallpaperBase: "#07120C",
  wallpaperMid: "#0E2318",
  labelPrimary: "#FFFFFF",
  labelSecondary: "rgba(255, 255, 255, 0.74)",
  labelTertiary: "rgba(255, 255, 255, 0.52)",
  separator: "rgba(255, 255, 255, 0.14)",
  iosGreen: "#30D158",
  iosGreenDeep: "#16A34A",
  iosRed: "#FF453A",
  iosBerry: "#F43F5E",
  iosAmber: "#FF9F0A",
  islandBlack: "#000000",
} as const;

// Tipografi iOS Asli (SF Pro / Inter — TANPA Monospace di judul/subjudul!)
export const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

export const EASE_IOS = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_OUT_CUBIC = Easing.bezier(0.16, 1, 0.3, 1);

export const SPRING_IOS = {
  damping: 22,
  stiffness: 170,
  mass: 0.95,
} as const;

export const SPRING_TACTILE = {
  damping: 16,
  stiffness: 260,
  mass: 0.75,
} as const;

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const INTER_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

let fontTriggered = false;

export function loadIosFonts(): void {
  if (typeof document === "undefined" || fontTriggered) {
    return;
  }
  fontTriggered = true;
  const handle = delayRender("Loading iOS Inter Font", {
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
  link.href = INTER_URL;
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
