import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_OUT_CUBIC, FPS, IOS_COLORS, IOS_FONT } from "../theme";

export type GlassVariant = "clear" | "regular" | "glassProminent";

export type SfIconName =
  | "signal"
  | "wifi"
  | "battery"
  | "leaf"
  | "check"
  | "xmark"
  | "bag"
  | "sun"
  | "drop"
  | "scissors";

/**
 * Deep Botanical iPhone Pro Wallpaper (kaya warna & kontras gelap elegan
 * sehingga material iOS 26 Liquid Glass benar-benar membiaskan warna dan berkilau!)
 */
export const DeepBotanicalWallpaper: React.FC = () => {
  const frame = useCurrentFrame();
  const period = FPS * 14;
  const ang = (frame / period) * Math.PI * 2;

  const x1 = Math.sin(ang) * 115;
  const y1 = Math.cos(ang * 0.85) * 95;
  const x2 = Math.cos(ang * 0.9 + 1.3) * 130;
  const y2 = Math.sin(ang * 0.8 + 0.6) * 110;
  const x3 = Math.sin(ang * 0.75 + 2.5) * 105;
  const y3 = Math.cos(ang * 0.95 + 2.0) * 120;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${IOS_COLORS.wallpaperBase} 0%, ${IOS_COLORS.wallpaperMid} 52%, #091610 100%)`,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Orb 1: Lush Emerald Canopy (Atas Kiri) */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(22, 163, 74, 0.58) 0%, rgba(16, 185, 129, 0.24) 44%, rgba(7, 18, 12, 0) 72%)",
          top: -220,
          left: -260,
          transform: `translate3d(${x1}px, ${y1}px, 0)`,
        }}
      />
      {/* Orb 2: Strawberry Ruby Glow (Tengah Kanan — memberi bias merah hangat pada kaca!) */}
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1080,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.48) 0%, rgba(244, 63, 94, 0.18) 44%, rgba(7, 18, 12, 0) 72%)",
          top: 460,
          right: -320,
          transform: `translate3d(${x2}px, ${y2}px, 0)`,
        }}
      />
      {/* Orb 3: Golden Morning Sunbeam (Bawah Kiri) */}
      <div
        style={{
          position: "absolute",
          width: 1140,
          height: 1140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 119, 6, 0.44) 0%, rgba(251, 191, 36, 0.16) 44%, rgba(7, 18, 12, 0) 72%)",
          bottom: -180,
          left: -280,
          transform: `translate3d(${x3}px, ${y3}px, 0)`,
        }}
      />
      {/* Orb 4: Soft Sage Highlight (Tengah Atas — memantul di belakang jam Lock Screen) */}
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.36) 0%, rgba(52, 211, 153, 0) 70%)",
          top: 160,
          left: 220,
          transform: `translate3d(${-x1 * 0.55}px, ${y2 * 0.45}px, 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Material Resmi Apple iOS 26 Liquid Glass (.clear, .regular, .glassProminent)
 * Aturan Chromium: animasikan opacity/transform langsung pada GlassSurface ini,
 * dan JANGAN pernah menaruh GlassSurface di dalam GlassSurface.
 */
export const GlassSurface: React.FC<{
  variant: GlassVariant;
  borderRadius?: number | string;
  sheenStartFrame?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ variant, borderRadius = 38, sheenStartFrame = 8, children, style }) => {
  const frame = useCurrentFrame();

  const variantStyle: React.CSSProperties =
    variant === "clear"
      ? {
          background:
            "linear-gradient(155deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0.16) 100%)",
          backdropFilter: "blur(32px) saturate(210%) brightness(1.08)",
          WebkitBackdropFilter: "blur(32px) saturate(210%) brightness(1.08)",
          border: "1.5px solid rgba(255, 255, 255, 0.42)",
          boxShadow:
            "0 28px 70px rgba(0, 0, 0, 0.34), inset 0 1.5px 1px rgba(255, 255, 255, 0.72), inset 0 -1.5px 2px rgba(255, 255, 255, 0.18), inset 1px 0 1px rgba(255, 255, 255, 0.30)",
        }
      : variant === "glassProminent"
      ? {
          background:
            "linear-gradient(180deg, rgba(48, 209, 88, 0.96) 0%, rgba(22, 163, 74, 0.96) 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.44)",
          boxShadow:
            "0 18px 42px rgba(22, 163, 74, 0.42), inset 0 1.5px 1px rgba(255, 255, 255, 0.65)",
        }
      : {
          background:
            "linear-gradient(160deg, rgba(26, 36, 31, 0.72) 0%, rgba(15, 22, 19, 0.62) 100%)",
          backdropFilter: "blur(40px) saturate(190%)",
          WebkitBackdropFilter: "blur(40px) saturate(190%)",
          border: "1.5px solid rgba(255, 255, 255, 0.24)",
          boxShadow:
            "0 30px 76px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.42), inset 0 -1px 0 rgba(255, 255, 255, 0.10)",
        };

  const sheenX = interpolate(
    frame,
    [sheenStartFrame, sheenStartFrame + 56],
    [-125, 125],
    { ...CLAMP, easing: EASE_OUT_CUBIC }
  );
  const sheenOp = interpolate(
    frame,
    [sheenStartFrame, sheenStartFrame + 16, sheenStartFrame + 42, sheenStartFrame + 56],
    [0, 0.55, 0.45, 0],
    CLAMP
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        ...variantStyle,
        ...style,
      }}
    >
      {sheenOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 8,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(108deg, transparent 36%, rgba(255,255,255,0.42) 50%, transparent 64%)",
              transform: `translateX(${sheenX}%)`,
              opacity: sheenOp,
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * SF Symbols Style Native SVG Icons (strokeWidth 2.2, zero emoji / Unicode icons).
 */
export const SfIcon: React.FC<{
  name: SfIconName;
  size?: number;
  color?: string;
  drawProgress?: number;
}> = ({ name, size = 28, color = "#FFFFFF", drawProgress = 1 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "signal":
      return (
        <svg width={size} height={size} viewBox="0 0 24 18" fill="none">
          <rect x="1" y="11" width="3.5" height="6" rx="1.2" fill={color} />
          <rect x="6.5" y="8" width="3.5" height="9" rx="1.2" fill={color} />
          <rect x="12" y="4.5" width="3.5" height="12.5" rx="1.2" fill={color} />
          <rect x="17.5" y="1" width="3.5" height="16" rx="1.2" fill={color} />
        </svg>
      );
    case "wifi":
      return (
        <svg {...common}>
          <path d="M4 10.5a11.5 11.5 0 0 1 16 0" />
          <path d="M7.5 14.5a6.5 6.5 0 0 1 9 0" />
          <circle cx="12" cy="18.5" r="1.4" fill={color} stroke="none" />
        </svg>
      );
    case "battery":
      return (
        <svg width={size} height={Math.round(size * 0.56)} viewBox="0 0 36 20" fill="none">
          <rect x="1.5" y="2" width="29" height="16" rx="4.5" stroke={color} strokeWidth="2.1" opacity="0.88" />
          <rect x="4.5" y="5" width="21" height="10" rx="2.2" fill={color} />
          <path d="M33 7.5V12.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19C5 11 10 5 19 5C19 14 13 19 5 19Z" />
          <path d="M5 19L13 11" />
        </svg>
      );
    case "check": {
      const len = 24;
      const p = Math.max(0, Math.min(1, drawProgress));
      return (
        <svg {...common}>
          <path
            d="M5 12.5L10 17.5L19 7"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
        </svg>
      );
    }
    case "xmark":
      return (
        <svg {...common}>
          <path d="M7 7L17 17" />
          <path d="M17 7L7 17" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </svg>
      );
    case "drop":
      return (
        <svg {...common}>
          <path d="M12 3.5C12 3.5 6 10.2 6 14.2a6 6 0 0 0 12 0C18 10.2 12 3.5 12 3.5Z" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...common}>
          <circle cx="6.5" cy="7.5" r="2.5" />
          <circle cx="6.5" cy="16.5" r="2.5" />
          <path d="M8.8 9L19 16.5" />
          <path d="M8.8 15L19 7.5" />
        </svg>
      );
  }
};

/**
 * Persistent Authentic iPhone Chrome:
 * - iOS Status Bar (09:41 + Signal/Wi-Fi/Battery)
 * - REAL Black Dynamic Island with subtle Live Activity morph
 * - Bottom Home Indicator
 */
export const IosSystemChrome: React.FC<{
  timeLabel: string;
  progressRatio: number;
  liveActive: boolean;
}> = ({ timeLabel, progressRatio, liveActive }) => {
  const pct = Math.max(0, Math.min(1, progressRatio)) * 100;
  const islandWidth = liveActive ? 344 : 286;

  return (
    <>
      {/* Status Bar + Real Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 56,
          right: 56,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
          zIndex: 80,
        }}
      >
        {/* Left: iOS Clock */}
        <div
          style={{
            width: 170,
            fontFamily: IOS_FONT,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: IOS_COLORS.labelPrimary,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {timeLabel}
        </div>

        {/* Center: Authentic Black Dynamic Island with Live Activity */}
        <div
          style={{
            width: islandWidth,
            height: 78,
            borderRadius: 999,
            backgroundColor: IOS_COLORS.islandBlack,
            boxShadow: "0 10px 28px rgba(0, 0, 0, 0.42)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "rgba(48, 209, 88, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SfIcon name="leaf" size={20} color={IOS_COLORS.iosGreen} />
          </div>

          {/* Live Activity Thin Progress Track */}
          <div
            style={{
              flex: 1,
              height: 7,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.20)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: IOS_COLORS.iosGreen,
              }}
            />
          </div>

          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#14181E",
              border: "2px solid rgba(59, 130, 246, 0.28)",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Right: Signal, Wi-Fi, Battery */}
        <div
          style={{
            width: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 14,
          }}
        >
          <SfIcon name="signal" size={28} color={IOS_COLORS.labelPrimary} />
          <SfIcon name="wifi" size={28} color={IOS_COLORS.labelPrimary} />
          <SfIcon name="battery" size={44} color={IOS_COLORS.labelPrimary} />
        </div>
      </div>

      {/* Bottom iOS Home Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          width: 356,
          height: 11,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 90,
        }}
      />
    </>
  );
};
