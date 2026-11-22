import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { WordItem } from "../data/videoData";
import {
  CLAMP,
  EASE_APPLE,
  FONT_SIZE,
  FONTS,
  FPS,
  H,
  mulberry32,
  PALETTE,
  RADIUS,
  SAFE,
  W,
} from "../theme";

export type GlassVariant = "card" | "notif" | "sheet" | "pill";

export type IconName =
  | "signal"
  | "wifi"
  | "battery"
  | "check"
  | "tomato"
  | "arrowRight"
  | "bookmark";

interface ParticleSpec {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly baseOpacity: number;
  readonly speedX: number;
  readonly speedY: number;
  readonly phase: number;
  readonly isWarm: boolean;
}

const PARTICLES: readonly ParticleSpec[] = (() => {
  const rng = mulberry32(20261122);
  const items: ParticleSpec[] = [];
  for (let i = 0; i < 24; i++) {
    items.push({
      x: 40 + rng() * (W - 80),
      y: 80 + rng() * (H - 160),
      size: 2.5 + rng() * 2.5,
      baseOpacity: 0.22 + rng() * 0.24,
      speedX: (rng() - 0.5) * 0.28,
      speedY: (rng() - 0.5) * 0.24,
      phase: rng() * Math.PI * 2,
      isWarm: i % 2 === 0,
    });
  }
  return items;
})();

/**
 * Pembungkus area aman konservatif TikTok (SAFE didefinisikan tunggal di theme.ts).
 */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        bottom: SAFE.bottom,
        left: SAFE.left,
        right: SAFE.right,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Latar belakang Organic Mesh Canvas berdimensi penuh sejak frame 0.
 * Menggunakan radial-gradient besar tanpa filter: blur() layar penuh.
 */
export const OrganicMeshCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const periodFrames = FPS * 12; // 12 detik >= 10 detik
  const angle = (frame / periodFrames) * Math.PI * 2;

  const b1x = Math.sin(angle) * 110;
  const b1y = Math.cos(angle * 0.85) * 95;
  const b2x = Math.cos(angle * 0.9 + 1.1) * 125;
  const b2y = Math.sin(angle * 0.8 + 0.7) * 105;
  const b3x = Math.sin(angle * 0.75 + 2.4) * 95;
  const b3y = Math.cos(angle * 0.95 + 1.8) * 115;
  const b4x = Math.cos(angle * 0.8 + 3.6) * 85;
  const b4y = Math.sin(angle * 0.7 + 2.9) * 80;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.canvas,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Blob 1: Tomato Terracotta hangat (kiri atas) */}
      <div
        style={{
          position: "absolute",
          width: 1120,
          height: 1120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234, 88, 12, 0.34) 0%, rgba(251, 146, 60, 0.14) 44%, rgba(245, 246, 242, 0) 72%)",
          top: -260,
          left: -280,
          transform: `translate3d(${b1x}px, ${b1y}px, 0)`,
        }}
      />
      {/* Blob 2: Emerald Leaf segar (kanan tengah) */}
      <div
        style={{
          position: "absolute",
          width: 1220,
          height: 1220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.36) 0%, rgba(134, 239, 172, 0.14) 46%, rgba(245, 246, 242, 0) 72%)",
          top: 380,
          right: -340,
          transform: `translate3d(${b2x}px, ${b2y}px, 0)`,
        }}
      />
      {/* Blob 3: Morning Sun Amber (kiri bawah) */}
      <div
        style={{
          position: "absolute",
          width: 1160,
          height: 1160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.30) 0%, rgba(253, 230, 138, 0.12) 45%, rgba(245, 246, 242, 0) 72%)",
          bottom: -240,
          left: -260,
          transform: `translate3d(${b3x}px, ${b3y}px, 0)`,
        }}
      />
      {/* Blob 4: Soft Botanical Mint (kanan bawah) */}
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(167, 243, 208, 0.10) 46%, rgba(245, 246, 242, 0) 72%)",
          bottom: 120,
          right: -240,
          transform: `translate3d(${b4x}px, ${b4y}px, 0)`,
        }}
      />

      {/* 24 Partikel Cahaya Mikro Deterministik */}
      {PARTICLES.map((pt, idx) => {
        const dx = Math.sin(frame * 0.012 + pt.phase) * 24 + frame * pt.speedX;
        const dy = Math.cos(frame * 0.011 + pt.phase) * 20 + frame * pt.speedY;
        const op = pt.baseOpacity * (0.75 + 0.25 * Math.sin(frame * 0.02 + pt.phase));
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: pt.x,
              top: pt.y,
              width: pt.size * 2,
              height: pt.size * 2,
              borderRadius: "50%",
              backgroundColor: pt.isWarm ? PALETTE.warm : PALETTE.accent,
              opacity: op,
              transform: `translate3d(${dx}px, ${dy}px, 0)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Permukaan Liquid Glass tunggal.
 * Aturan teknis: animasikan opacity/transform langsung pada style GlassSurface ini,
 * dan JANGAN pernah menaruh GlassSurface di dalam GlassSurface (no nested backdropFilter).
 */
export const GlassSurface: React.FC<{
  variant: GlassVariant;
  children: React.ReactNode;
  sheenStartFrame?: number;
  style?: React.CSSProperties;
}> = ({ variant, children, sheenStartFrame = 8, style }) => {
  const frame = useCurrentFrame();

  const borderRadius =
    variant === "notif"
      ? RADIUS.notif
      : variant === "sheet"
      ? `${RADIUS.sheet}px ${RADIUS.sheet}px 0px 0px`
      : variant === "pill"
      ? RADIUS.pill
      : RADIUS.card;

  const sheenX = interpolate(
    frame,
    [sheenStartFrame, sheenStartFrame + 60],
    [-120, 120],
    { ...CLAMP, easing: EASE_APPLE }
  );
  const sheenOpacity = interpolate(
    frame,
    [sheenStartFrame, sheenStartFrame + 16, sheenStartFrame + 44, sheenStartFrame + 60],
    [0, 1, 0.85, 0],
    CLAMP
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        background:
          "linear-gradient(145deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.42) 100%)",
        backdropFilter: "blur(28px) saturate(185%)",
        WebkitBackdropFilter: "blur(28px) saturate(185%)",
        border: "1.5px solid rgba(255, 255, 255, 0.85)",
        boxShadow:
          "0 24px 60px rgba(15, 23, 20, 0.10), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(15, 23, 20, 0.05)",
        ...style,
      }}
    >
      {sheenOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 50%, transparent 62%)",
              transform: `translateX(${sheenX}%)`,
              opacity: sheenOpacity,
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Komponen Ikon SVG Native Tunggal (viewBox 24x24, strokeWidth 2, zero emoji / zero Unicode symbol icons).
 */
export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  drawProgress?: number;
}> = ({ name, size = 28, color = PALETTE.ink, drawProgress = 1 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "signal":
      return (
        <svg {...common}>
          <path d="M4 18v-3" />
          <path d="M9 18v-6" />
          <path d="M14 18v-9" />
          <path d="M19 18V6" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...common}>
          <path d="M5 12.5a10 10 0 0 1 14 0" />
          <path d="M8.5 16a5 5 0 0 1 7 0" />
          <path d="M12 19.5h.01" />
        </svg>
      );
    case "battery":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="17" height="10" rx="2.5" />
          <rect x="4.5" y="9.5" width="11" height="5" rx="1" fill={color} stroke="none" />
          <path d="M21 10v4" />
        </svg>
      );
    case "check": {
      const len = 24;
      const clamped = Math.max(0, Math.min(1, drawProgress));
      return (
        <svg {...common}>
          <path
            d="M5 12.5L10 17.5L19 7"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - clamped)}
          />
        </svg>
      );
    }
    case "tomato":
      return (
        <svg {...common}>
          <path
            d="M12 7C7.8 7 4.5 9.8 4.5 13.8C4.5 17.8 7.8 20.5 12 20.5C16.2 20.5 19.5 17.8 19.5 13.8C19.5 9.8 16.2 7 12 7Z"
            fill={PALETTE.warmSoft}
          />
          <path d="M12 7V4" stroke={PALETTE.accent} />
          <path d="M12 7C10.4 5.6 8.8 5.6 7.5 6.4" stroke={PALETTE.accent} />
          <path d="M12 7C13.6 5.6 15.2 5.6 16.5 6.4" stroke={PALETTE.accent} />
          <path d="M8.5 11.5C8 12.5 8 14 8.6 15" />
        </svg>
      );
    case "arrowRight":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" />
        </svg>
      );
  }
};

/**
 * Persistent Micro Chrome: iOS Status Bar + Dynamic Island Progress Bar.
 * Tanpa backdropFilter tambahan agar budget backdropFilter aktif tetap <= 3 per frame.
 */
export const IosMicroChrome: React.FC<{
  timeLabel: string;
  progressRatio: number;
}> = ({ timeLabel, progressRatio }) => {
  const clampedPct = Math.max(0, Math.min(1, progressRatio)) * 100;

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 60,
        right: 60,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: FONT_SIZE.xs,
          fontWeight: 700,
          color: PALETTE.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {timeLabel}
      </span>

      {/* Dynamic Island Progress Pill */}
      <div
        style={{
          width: 240,
          height: 44,
          borderRadius: RADIUS.pill,
          backgroundColor: "rgba(15, 23, 20, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: PALETTE.warm,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 7,
            borderRadius: RADIUS.pill,
            backgroundColor: "rgba(255, 255, 255, 0.22)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${clampedPct}%`,
              height: "100%",
              borderRadius: RADIUS.pill,
              backgroundColor: PALETTE.white,
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="signal" size={30} color={PALETTE.ink} />
        <Icon name="wifi" size={30} color={PALETTE.ink} />
        <Icon name="battery" size={34} color={PALETTE.ink} />
      </div>
    </div>
  );
};

/**
 * Animasi kata-per-kata (blur 14px->0, translateY 18px->0, opacity 0->1, jeda 5-7 frame).
 */
export const BlurWords: React.FC<{
  words: readonly WordItem[];
  startFrame: number;
  stagger?: number;
  fontSize: number;
  align?: "left" | "center";
}> = ({ words, startFrame, stagger = 6, fontSize, align = "left" }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "baseline",
        columnGap: Math.round(fontSize * 0.24),
        rowGap: 10,
        fontFamily: FONTS.sans,
        fontSize,
        fontWeight: 800,
        letterSpacing: "-0.025em",
        lineHeight: 1.08,
      }}
    >
      {words.map((w, idx) => {
        const s = startFrame + idx * stagger;
        const p = interpolate(frame, [s, s + 22], [0, 1], {
          ...CLAMP,
          easing: EASE_APPLE,
        });
        const blur = interpolate(p, [0, 1], [14, 0], CLAMP);
        const y = interpolate(p, [0, 1], [18, 0], CLAMP);

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px)`,
              filter: blur > 0.2 ? `blur(${blur}px)` : "none",
              color: w.serifAccent
                ? PALETTE.accent
                : w.warmColor
                ? PALETTE.warm
                : PALETTE.ink,
              fontFamily: w.serifAccent ? FONTS.serif : FONTS.sans,
              fontStyle: w.serifAccent ? "italic" : "normal",
              fontWeight: w.serifAccent ? 400 : 800,
              fontSize: w.serifAccent ? Math.round(fontSize * 1.12) : fontSize,
              letterSpacing: w.serifAccent ? "-0.01em" : "-0.025em",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Kursor Sentuhan Halus (lingkaran translusen 64px + cincin, menciut saat menekan).
 * Tanpa backdropFilter untuk menjaga performa dan batas backdropFilter aktif.
 */
export const TouchCursor: React.FC<{
  x: number;
  y: number;
  opacity: number;
  pressing: boolean;
}> = ({ x, y, opacity, pressing }) => {
  if (opacity <= 0.01) {
    return null;
  }
  const scale = pressing ? 0.82 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 64,
        height: 64,
        borderRadius: "50%",
        backgroundColor: pressing
          ? "rgba(21, 128, 61, 0.28)"
          : "rgba(255, 255, 255, 0.52)",
        border: "3px solid rgba(15, 23, 20, 0.65)",
        boxShadow: "0 12px 28px rgba(15, 23, 20, 0.18)",
        transform: `translate3d(${x - 32}px, ${y - 32}px, 0) scale(${scale})`,
        opacity,
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Ilustrasi Tanaman Tomat Pot Prosedural (0.0 -> 1.0) & Placeholder Produk Kaca.
 */
export const TomatoPotSvg: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 280,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const foliageScale = interpolate(p, [0, 1], [0.82, 1.04], CLAMP);
  const fruitScale = interpolate(p, [0.3, 0.92], [0, 1], CLAMP);

  const fruits = [
    { x: 118, y: 122, r: 22 },
    { x: 204, y: 114, r: 24 },
    { x: 162, y: 80, r: 19 },
    { x: 152, y: 164, r: 21 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 320 320" fill="none">
      <ellipse cx="160" cy="296" rx="76" ry="11" fill="rgba(15, 23, 20, 0.10)" />
      {/* Batang & Penopang */}
      <path d="M160 232V112" stroke="#15803D" strokeWidth="9" strokeLinecap="round" />
      <path d="M160 176L116 142" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
      <path d="M160 166L208 134" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />

      {/* Daun Tomat Rimbun */}
      <g transform={`translate(160, 138) scale(${foliageScale}) translate(-160, -138)`}>
        <ellipse cx="114" cy="136" rx="44" ry="26" transform="rotate(-18 114 136)" fill="#22C55E" />
        <ellipse cx="206" cy="132" rx="46" ry="26" transform="rotate(18 206 132)" fill="#16A34A" />
        <ellipse cx="160" cy="94" rx="48" ry="30" fill="#15803D" />
        <ellipse cx="136" cy="170" rx="38" ry="22" transform="rotate(-10 136 170)" fill="#16A34A" />
        <ellipse cx="188" cy="170" rx="38" ry="22" transform="rotate(10 188 170)" fill="#22C55E" />

        {fruitScale > 0.02 &&
          fruits.map((f, idx) => (
            <g key={idx} transform={`translate(${f.x}, ${f.y}) scale(${fruitScale})`}>
              <circle cx="0" cy="0" r={f.r} fill="#DC2626" />
              <circle cx={-f.r * 0.3} cy={-f.r * 0.28} r={f.r * 0.24} fill="#FECACA" opacity="0.85" />
              <path
                d={`M-7 ${-f.r + 2}L0 ${-f.r - 4}L7 ${-f.r + 2}`}
                stroke="#14532D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
      </g>

      {/* Pot Terakota */}
      <ellipse cx="160" cy="232" rx="64" ry="13" fill="#4B3629" />
      <path
        d="M98 234L112 292C113 296 117 298 122 298H198C203 298 207 296 208 292L222 234Z"
        fill="#C2410C"
      />
      <rect x="92" y="220" width="136" height="22" rx="8" fill="#EA580C" />
    </svg>
  );
};
