import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AE_SMOOTH_LAND, CLAMP, COLORS, FONTS } from "../theme";

/**
 * After Effects Virtual Camera Rig:
 * Continuous organic handheld/dolly breathing + 3D tilt/pan/zoom + optional velocity directional blur.
 */
export const CameraRig: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rotateZ?: number;
  rotateX?: number;
  rotateY?: number;
  blurX?: number;
  blurY?: number;
  filterId?: string;
  breatheAmount?: number;
  children: React.ReactNode;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotateZ = 0,
  rotateX = 0,
  rotateY = 0,
  blurX = 0,
  blurY = 0,
  filterId = "ae-motion-blur",
  breatheAmount = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  // Subtle continuous AE camera drift so the viewport NEVER looks stiff or frozen
  const driftX = Math.sin(frame * 0.017) * 7 * breatheAmount;
  const driftY = Math.cos(frame * 0.014) * 5 * breatheAmount;
  const driftRot = Math.sin(frame * 0.012) * 0.35 * breatheAmount;
  const driftScale = 1 + Math.sin(frame * 0.015) * 0.006 * breatheAmount;

  const useDirBlur = blurX > 0.4 || blurY > 0.4;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {useDirBlur && (
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
          transform: `perspective(1400px) translate3d(${(x + driftX).toFixed(2)}px, ${(y + driftY).toFixed(2)}px, 0) scale(${(scale * driftScale).toFixed(4)}) rotateZ(${(rotateZ + driftRot).toFixed(3)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
          filter: useDirBlur ? `url(#${filterId})` : "none",
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Mask-Reveal Editorial Text (text rises cleanly out of an invisible baseline mask — crisp AE typography!)
 */
export const MaskRevealLine: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame, duration = 28, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    ...CLAMP,
    easing: AE_SMOOTH_LAND,
  });
  const y = interpolate(p, [0, 1], [115, 0], CLAMP);

  return (
    <div style={{ overflow: "hidden", paddingBottom: 6 }}>
      <div
        style={{
          transform: `translate3d(0, ${y}%, 0)`,
          opacity: interpolate(p, [0, 0.25, 1], [0, 0.9, 1], CLAMP),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Original Minimalist Botanical Ring Crest (Replaces the copied worm logo 100%!)
 * Represents a complete, living botanical cycle: clean hairline ring + delicate paired leaf arc.
 */
export const BotanicalRingCrest: React.FC<{
  size?: number;
  progress?: number;
  color?: string;
  accentColor?: string;
}> = ({
  size = 120,
  progress = 1,
  color = COLORS.EMERALD,
  accentColor = COLORS.LEAF,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const r = 48;
  const circ = 2 * Math.PI * r;
  const leafReveal = interpolate(p, [0.75, 1], [0, 1], CLAMP);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Subtle ghost track */}
      <circle
        cx="60"
        cy="60"
        r={r}
        stroke={color}
        strokeWidth="3.5"
        opacity="0.16"
      />
      {/* Living completion arc */}
      <circle
        cx="60"
        cy="60"
        r={r}
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - p)}
        transform="rotate(-90 60 60)"
      />
      {/* Delicate twin sprout leaves blooming inside once complete */}
      <g
        transform={`translate(60, 64) scale(${leafReveal})`}
        opacity={leafReveal}
      >
        <path
          d="M0 18 V-10"
          stroke={color}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M0 4 C-18 4 -24 -10 -22 -22 C-10 -22 0 -12 0 4 Z"
          fill={accentColor}
          opacity="0.88"
        />
        <path
          d="M0 -2 C18 -2 24 -16 22 -28 C10 -28 0 -18 0 -2 Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

/**
 * Animated Minimalist Botanical Stage Artwork for the 4-Station Tracking Shot (Act 3)
 */
export const StageBotanicalArt: React.FC<{
  kind: "seed" | "water" | "sprout" | "fruit";
  progress: number;
  accent: string;
}> = ({ kind, progress, accent }) => {
  const p = Math.max(0, Math.min(1, progress));

  if (kind === "seed") {
    const seedY = interpolate(p, [0, 0.75], [-60, 12], CLAMP);
    const soilReveal = interpolate(p, [0, 0.4], [0, 1], CLAMP);
    const ripple = interpolate(p, [0.65, 1], [0, 1], CLAMP);
    return (
      <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
        <path
          d="M32 184 Q130 156 228 184"
          stroke={COLORS.INK}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="210"
          strokeDashoffset={210 * (1 - soilReveal)}
          opacity="0.28"
        />
        <path
          d="M54 206 Q130 186 206 206"
          stroke={accent}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={soilReveal * 0.65}
        />
        <g transform={`translate(130, ${138 + seedY})`}>
          <path
            d="M0 -28 C16 -10 18 14 0 26 C-18 14 -16 -10 0 -28 Z"
            fill={accent}
          />
          <path d="M0 -18 V16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </g>
        {ripple > 0.02 && (
          <ellipse
            cx="130"
            cy="170"
            rx={22 + ripple * 54}
            ry={6 + ripple * 12}
            stroke={accent}
            strokeWidth="2.5"
            opacity={(1 - ripple) * 0.7}
          />
        )}
      </svg>
    );
  }

  if (kind === "water") {
    const drop1Y = interpolate(p, [0, 0.65], [-36, 48], CLAMP);
    const drop2Y = interpolate(p, [0.22, 0.88], [-32, 52], CLAMP);
    const waveR = interpolate(p, [0.55, 1], [8, 72], CLAMP);
    return (
      <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
        {/* Sun arc */}
        <path
          d="M58 92 A74 74 0 0 1 202 92"
          stroke={COLORS.WARM_GOLD}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 10"
          opacity={0.45 + p * 0.45}
        />
        {/* Droplet 1 */}
        <g transform={`translate(110, ${102 + drop1Y})`} opacity={interpolate(p, [0, 0.15, 0.65, 0.78], [0, 1, 1, 0], CLAMP)}>
          <path d="M0 -16 C0 -16 14 2 14 10 A14 14 0 0 1 -14 10 C-14 2 0 -16 0 -16 Z" fill={accent} />
        </g>
        {/* Droplet 2 */}
        <g transform={`translate(152, ${94 + drop2Y})`} opacity={interpolate(p, [0.2, 0.35, 0.85, 0.98], [0, 1, 1, 0], CLAMP)}>
          <path d="M0 -13 C0 -13 11 2 11 8 A11 11 0 0 1 -11 8 C-11 2 0 -13 0 -13 Z" fill={accent} opacity="0.82" />
        </g>
        <ellipse
          cx="130"
          cy="192"
          rx={waveR}
          ry={waveR * 0.22}
          stroke={accent}
          strokeWidth="3"
          opacity={interpolate(p, [0.55, 1], [0.8, 0.15], CLAMP)}
        />
        <path d="M44 192 H216" stroke={COLORS.INK} strokeWidth="3" strokeLinecap="round" opacity="0.18" />
      </svg>
    );
  }

  if (kind === "sprout") {
    const stemProg = interpolate(p, [0, 0.65], [0, 1], CLAMP);
    const leafL = interpolate(p, [0.32, 0.85], [0, 1], CLAMP);
    const leafR = interpolate(p, [0.45, 0.96], [0, 1], CLAMP);
    return (
      <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
        <path d="M46 206 H214" stroke={COLORS.INK} strokeWidth="3.5" strokeLinecap="round" opacity="0.2" />
        <path
          d="M130 204 Q124 146 130 82"
          stroke={accent}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="130"
          strokeDashoffset={130 * (1 - stemProg)}
        />
        <g transform={`translate(128, 138) scale(${leafL})`} opacity={leafL}>
          <path d="M0 0 C-38 0 -64 -24 -60 -52 C-28 -52 -6 -28 0 0 Z" fill={COLORS.LEAF} />
          <path d="M-4 -4 C-24 -16 -38 -28 -48 -42" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
        </g>
        <g transform={`translate(131, 114) scale(${leafR})`} opacity={leafR}>
          <path d="M0 0 C38 0 64 -26 60 -54 C28 -54 6 -28 0 0 Z" fill={accent} />
          <path d="M4 -4 C24 -16 38 -28 48 -44" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
    );
  }

  // kind === "fruit"
  const stemDraw = interpolate(p, [0, 0.5], [0, 1], CLAMP);
  const b1 = interpolate(p, [0.3, 0.82], [0, 1], CLAMP);
  const b2 = interpolate(p, [0.46, 0.94], [0, 1], CLAMP);
  const halo = interpolate(p, [0.65, 1], [0, 1], CLAMP);
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
      <circle cx="130" cy="144" r={54 + halo * 34} fill={accent} opacity={(1 - halo) * 0.14} />
      <path
        d="M84 74 Q130 56 178 78"
        stroke={COLORS.EMERALD}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="110"
        strokeDashoffset={110 * (1 - stemDraw)}
      />
      <path d="M110 68 V116" stroke={COLORS.EMERALD} strokeWidth="4" strokeLinecap="round" opacity={stemDraw} />
      <path d="M156 72 V132" stroke={COLORS.EMERALD} strokeWidth="4" strokeLinecap="round" opacity={stemDraw} />
      <g transform={`translate(110, 138) scale(${b1})`} opacity={b1}>
        <circle cx="0" cy="0" r="28" fill={accent} />
        <circle cx="-9" cy="-9" r="6.5" fill="#FECDD3" opacity="0.85" />
      </g>
      <g transform={`translate(156, 158) scale(${b2})`} opacity={b2}>
        <circle cx="0" cy="0" r="32" fill={accent} />
        <circle cx="-10" cy="-10" r="7.5" fill="#FECDD3" opacity="0.85" />
      </g>
    </svg>
  );
};

/**
 * Clean Editorial Ambient Light Layer — STRICTLY zIndex 0 and low opacity so text is ALWAYS 100% sharp!
 */
export const SubtleAmbientLight: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame * 0.015) * 80;
  const dy = Math.cos(frame * 0.013) * 60;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          top: -380,
          right: -280,
          background: dark
            ? "radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(8, 18, 12, 0) 68%)"
            : "radial-gradient(circle, rgba(134, 239, 172, 0.34) 0%, rgba(246, 247, 242, 0) 68%)",
          transform: `translate3d(${dx}px, ${dy}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          borderRadius: "50%",
          bottom: -360,
          left: -260,
          background: dark
            ? "radial-gradient(circle, rgba(217, 119, 6, 0.16) 0%, rgba(8, 18, 12, 0) 68%)"
            : "radial-gradient(circle, rgba(253, 230, 138, 0.32) 0%, rgba(246, 247, 242, 0) 68%)",
          transform: `translate3d(${-dx * 0.7}px, ${-dy * 0.7}px, 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Unfinished Loading Ring Badge (Visualizes why incomplete things make our brain restless!)
 */
export const StuckRingBadge: React.FC<{ pct: number; color: string; size?: number }> = ({
  pct,
  color,
  size = 64,
}) => {
  const frame = useCurrentFrame();
  const r = 24;
  const circ = 2 * Math.PI * r;
  // Subtle restless jitter around the stuck percentage
  const jitter = Math.sin(frame * 0.18 + pct) * 2.5;
  const shown = Math.max(10, Math.min(94, pct + jitter));

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(13, 25, 18, 0.10)" strokeWidth="5.5" />
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
