import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AE_LANDING, CLAMP, COLORS, FONTS } from "../theme";

/**
 * Artisanal Multi-Layer Camera Rig:
 * Continuous silky optical float + smooth transform + gentle sub-pixel motion blur (never harsh/blocky).
 */
export const CameraRig: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rotateZ?: number;
  rotateY?: number;
  blurX?: number;
  blurY?: number;
  filterId?: string;
  breathe?: number;
  children: React.ReactNode;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotateZ = 0,
  rotateY = 0,
  blurX = 0,
  blurY = 0,
  filterId = "cam-blur",
  breathe = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  // Continuous organic steadicam breath so every frame feels alive
  const dx = Math.sin(frame * 0.015) * 6 * breathe;
  const dy = Math.cos(frame * 0.012) * 4.5 * breathe;
  const drot = Math.sin(frame * 0.011) * 0.28 * breathe;
  const dscale = 1 + Math.sin(frame * 0.014) * 0.005 * breathe;

  const hasBlur = blurX > 0.35 || blurY > 0.35;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {hasBlur && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurX.toFixed(1)} ${blurY.toFixed(1)}`} />
            </filter>
          </defs>
        </svg>
      )}
      <AbsoluteFill
        style={{
          transform: `perspective(1600px) translate3d(${(x + dx).toFixed(2)}px, ${(y + dy).toFixed(2)}px, 0) scale(${(scale * dscale).toFixed(4)}) rotateZ(${(rotateZ + drot).toFixed(3)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
          filter: hasBlur ? `url(#${filterId})` : "none",
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Editorial Baseline Mask-Reveal Typography
 */
export const MaskRevealLine: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame, duration = 30, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    ...CLAMP,
    easing: AE_LANDING,
  });
  const y = interpolate(p, [0, 1], [110, 0], CLAMP);

  return (
    <div style={{ overflow: "hidden", paddingBottom: 8 }}>
      <div
        style={{
          transform: `translate3d(0, ${y}%, 0)`,
          opacity: interpolate(p, [0, 0.22, 1], [0, 0.92, 1], CLAMP),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Ambient Light Parallax Layer (Layer 0: moves at 0.25x camera speed for genuine spatial depth!)
 */
export const ParallaxAtmosphere: React.FC<{
  dark?: boolean;
  cameraOffsetX?: number;
  cameraOffsetY?: number;
}> = ({ dark = false, cameraOffsetX = 0, cameraOffsetY = 0 }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.013) * 65 - cameraOffsetX * 0.14;
  const driftY = Math.cos(frame * 0.011) * 50 - cameraOffsetY * 0.14;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Soft Organic Horizon Grid Hairlines (ultra-faint tactile craft) */}
      <div
        style={{
          position: "absolute",
          inset: -120,
          backgroundImage: dark
            ? "radial-gradient(rgba(74, 222, 128, 0.09) 1.5px, transparent 1.5px)"
            : "radial-gradient(rgba(21, 128, 61, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "48px 48px",
          transform: `translate3d(${(driftX * 0.45).toFixed(1)}px, ${(driftY * 0.45).toFixed(1)}px, 0)`,
        }}
      />
      {/* Warm Sun / Emerald Ambient Wash */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          borderRadius: "50%",
          top: -390,
          right: -280,
          background: dark
            ? "radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(7, 17, 11, 0) 68%)"
            : "radial-gradient(circle, rgba(134, 239, 172, 0.34) 0%, rgba(246, 245, 240, 0) 68%)",
          transform: `translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1020,
          height: 1020,
          borderRadius: "50%",
          bottom: -360,
          left: -260,
          background: dark
            ? "radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, rgba(7, 17, 11, 0) 68%)"
            : "radial-gradient(circle, rgba(253, 230, 138, 0.34) 0%, rgba(246, 245, 240, 0) 68%)",
          transform: `translate3d(${(-driftX * 0.65).toFixed(1)}px, ${(-driftY * 0.65).toFixed(1)}px, 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Original Minimalist Botanical Ring Crest (The Hero Focal Motif across the entire 30s film!)
 */
export const BotanicalRingCrest: React.FC<{
  size?: number;
  progress?: number;
  color?: string;
  accentColor?: string;
}> = ({
  size = 140,
  progress = 1,
  color = COLORS.EMERALD,
  accentColor = COLORS.LEAF,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const r = 48;
  const circ = 2 * Math.PI * r;
  const leafReveal = interpolate(p, [0.76, 1], [0, 1], CLAMP);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r={r} stroke={color} strokeWidth="3.5" opacity="0.18" />
      <circle
        cx="60"
        cy="60"
        r={r}
        stroke={color}
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - p)}
        transform="rotate(-90 60 60)"
      />
      <g transform={`translate(60, 64) scale(${leafReveal})`} opacity={leafReveal}>
        <path d="M0 18 V-10" stroke={color} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M0 4 C-18 4 -24 -10 -22 -22 C-10 -22 0 -12 0 4 Z" fill={accentColor} opacity="0.92" />
        <path d="M0 -2 C18 -2 24 -16 22 -28 C10 -28 0 -18 0 -2 Z" fill={color} />
      </g>
    </svg>
  );
};

/**
 * Unfinished Loading Ring Badge (Visualizes incomplete cognitive loops in Act 1)
 */
export const StuckRingBadge: React.FC<{ pct: number; color: string; size?: number }> = ({
  pct,
  color,
  size = 74,
}) => {
  const frame = useCurrentFrame();
  const r = 24;
  const circ = 2 * Math.PI * r;
  const jitter = Math.sin(frame * 0.16 + pct) * 2.2;
  const shown = Math.max(10, Math.min(94, pct + jitter));

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(12, 24, 17, 0.10)" strokeWidth="5.5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - shown / 100)}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.SANS,
          fontSize: 16,
          fontWeight: 800,
          color: COLORS.INK,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {pct}%
      </div>
    </div>
  );
};

/**
 * Artisanal Living Botanical Stage Art (Act 3) — ALWAYS visible, rich, & gently animated even after settling!
 */
export const LivingBotanicalArt: React.FC<{
  kind: "seed" | "water" | "sprout" | "fruit";
  enterProg: number;
  accent: string;
}> = ({ kind, enterProg, accent }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, enterProg));
  const sway = Math.sin(frame * 0.055) * 3.5;

  if (kind === "seed") {
    const seedY = interpolate(p, [0, 0.8], [-44, 0], CLAMP);
    const haloScale = 1 + Math.sin(frame * 0.06) * 0.06;
    return (
      <svg width="290" height="290" viewBox="0 0 280 280" fill="none">
        {/* Soft terracotta warmth circle */}
        <circle cx="140" cy="148" r="82" fill={`${accent}14`} transform={`translate(140,148) scale(${haloScale}) translate(-140,-148)`} />
        {/* Layered soil curves */}
        <path d="M36 194 Q140 164 244 194" stroke={COLORS.INK} strokeWidth="4" strokeLinecap="round" opacity="0.22" />
        <path d="M62 214 Q140 192 218 214" stroke={accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
        {/* Hero Seed */}
        <g transform={`translate(140, ${142 + seedY}) rotate(${sway * 0.6})`}>
          <path d="M0 -34 C20 -12 22 18 0 32 C-22 18 -20 -12 0 -34 Z" fill={accent} />
          <path d="M0 -22 V20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>
        {/* Subtle micro roots */}
        <path d="M140 174 Q134 192 124 202" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity={p * 0.65} />
        <path d="M140 174 Q146 190 156 198" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity={p * 0.65} />
      </svg>
    );
  }

  if (kind === "water") {
    // Looping serene water droplets — NEVER disappears into an empty frame!
    const cycle1 = (frame % 72) / 72;
    const cycle2 = ((frame + 36) % 72) / 72;
    const d1y = interpolate(cycle1, [0, 0.85], [88, 174], CLAMP);
    const d1op = interpolate(cycle1, [0, 0.15, 0.72, 0.9], [0, 1, 1, 0], CLAMP);
    const d2y = interpolate(cycle2, [0, 0.85], [84, 174], CLAMP);
    const d2op = interpolate(cycle2, [0, 0.15, 0.72, 0.9], [0, 1, 1, 0], CLAMP);
    const ripR = 24 + cycle1 * 56;
    return (
      <svg width="290" height="290" viewBox="0 0 280 280" fill="none">
        <circle cx="140" cy="144" r="84" fill={`${accent}12`} />
        {/* Morning sun rays arc */}
        <circle cx="140" cy="76" r="24" fill="#FDE68A" opacity="0.85" />
        <path d="M84 96 A64 64 0 0 1 196 96" stroke={COLORS.WARM_GOLD} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 10" />
        {/* Static hero droplet + 2 gentle falling drops */}
        <g transform="translate(140, 134)">
          <path d="M0 -24 C0 -24 20 2 20 14 A20 20 0 0 1 -20 14 C-20 2 0 -24 0 -24 Z" fill={accent} />
          <path d="M-7 8 C-8 14 -4 19 1 20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </g>
        <g transform={`translate(106, ${d1y})`} opacity={d1op * 0.75}>
          <path d="M0 -11 C0 -11 9 1 9 7 A9 9 0 0 1 -9 7 C-9 1 0 -11 0 -11 Z" fill={accent} />
        </g>
        <g transform={`translate(174, ${d2y})`} opacity={d2op * 0.75}>
          <path d="M0 -10 C0 -10 8 1 8 6 A8 8 0 0 1 -8 6 C-8 1 0 -10 0 -10 Z" fill={accent} />
        </g>
        {/* Water surface ripples */}
        <ellipse cx="140" cy="198" rx={ripR} ry={ripR * 0.22} stroke={accent} strokeWidth="2.8" opacity={(1 - cycle1) * 0.7} />
        <path d="M52 198 H228" stroke={accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.35" />
      </svg>
    );
  }

  if (kind === "sprout") {
    const stem = interpolate(p, [0, 0.75], [0, 1], CLAMP);
    const leafL = interpolate(p, [0.25, 0.85], [0, 1], CLAMP);
    const leafR = interpolate(p, [0.4, 0.96], [0, 1], CLAMP);
    return (
      <svg width="290" height="290" viewBox="0 0 280 280" fill="none">
        <circle cx="140" cy="144" r="84" fill={`${accent}14`} />
        <path d="M52 214 H228" stroke={COLORS.INK} strokeWidth="3.5" strokeLinecap="round" opacity="0.2" />
        <g transform={`translate(140, 212) rotate(${sway * 0.6}) translate(-140, -212)`}>
          <path
            d="M140 212 Q134 148 140 82"
            stroke={accent}
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeDasharray="140"
            strokeDashoffset={140 * (1 - stem)}
          />
          <g transform={`translate(138, 146) scale(${leafL})`} opacity={leafL}>
            <path d="M0 0 C-42 0 -70 -26 -64 -58 C-30 -58 -6 -30 0 0 Z" fill={COLORS.LEAF} />
            <path d="M-5 -5 C-26 -18 -42 -32 -52 -46" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.72" />
          </g>
          <g transform={`translate(142, 118) scale(${leafR})`} opacity={leafR}>
            <path d="M0 0 C42 0 70 -28 64 -60 C30 -60 6 -30 0 0 Z" fill={accent} />
            <path d="M5 -5 C26 -18 42 -32 52 -48" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.72" />
          </g>
        </g>
      </svg>
    );
  }

  // kind === "fruit" (Editorial Botanical Harvest Branch with leaves & glossy ripe berries/tomatoes)
  const bScale = interpolate(p, [0.15, 0.85], [0.4, 1], CLAMP);
  return (
    <svg width="290" height="290" viewBox="0 0 280 280" fill="none">
      <circle cx="140" cy="144" r="86" fill={`${accent}14`} />
      <g transform={`translate(140, 72) rotate(${sway * 0.45}) translate(-140, -72)`}>
        {/* Botanical arch branch + leaves */}
        <path d="M68 88 Q140 54 212 88" stroke={COLORS.EMERALD} strokeWidth="6" strokeLinecap="round" />
        <path d="M140 68 C120 42 96 42 88 58 C108 66 126 70 140 68 Z" fill={COLORS.LEAF} />
        <path d="M140 68 C160 42 184 42 192 58 C172 66 154 70 140 68 Z" fill={COLORS.EMERALD} />
        {/* Hanging stems */}
        <path d="M112 76 V132" stroke={COLORS.EMERALD} strokeWidth="4" strokeLinecap="round" />
        <path d="M168 76 V150" stroke={COLORS.EMERALD} strokeWidth="4" strokeLinecap="round" />
        {/* Ripe Berry / Garden Fruit 1 */}
        <g transform={`translate(112, 152) scale(${bScale})`}>
          <path d="M0 32 C-22 24 -28 4 -24 -12 C-20 -24 -8 -26 0 -22 C8 -26 20 -24 24 -12 C28 4 22 24 0 32 Z" fill={accent} />
          <path d="M-12 -20 L0 -12 L12 -20 L6 -26 L0 -20 L-6 -26 Z" fill={COLORS.EMERALD} />
          <circle cx="-8" cy="-4" r="4" fill="#FFE4E6" opacity="0.85" />
        </g>
        {/* Ripe Berry / Garden Fruit 2 */}
        <g transform={`translate(168, 174) scale(${bScale})`}>
          <path d="M0 34 C-24 26 -30 4 -26 -12 C-22 -24 -8 -28 0 -24 C8 -28 22 -24 26 -12 C30 4 24 26 0 34 Z" fill={accent} />
          <path d="M-13 -22 L0 -13 L13 -22 L6 -28 L0 -22 L-6 -28 Z" fill={COLORS.EMERALD} />
          <circle cx="-9" cy="-4" r="4.5" fill="#FFE4E6" opacity="0.85" />
        </g>
      </g>
    </svg>
  );
};
