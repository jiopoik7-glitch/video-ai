import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS } from "../theme";

/**
 * Emblem Orisinal Seflorner POC: Tetesan Nutrisi Organik + Daun Zamrud.
 */
export const PocDropEmblem: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    {/* Tetesan nutrisi cair kuning-amber lembut */}
    <path
      d="M60 12 C60 12, 22 52, 22 76 C22 97, 39 110, 60 110 C81 110, 98 97, 98 76 C98 52, 60 12, 60 12 Z"
      fill={COLORS.AMBER_SOFT}
      stroke={COLORS.AMBER}
      strokeWidth="3.5"
    />
    {/* Daun organik zamrud di dalam tetesan */}
    <path
      d="M42 86 C42 62, 58 46, 82 46 C82 70, 66 86, 42 86 Z"
      fill={COLORS.EMERALD}
    />
    <path
      d="M44 84 C55 73, 66 62, 77 51"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Kilau cair */}
    <path
      d="M36 74 C36 62, 43 50, 50 41"
      stroke={COLORS.AMBER}
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export interface WordSpec {
  readonly text: string;
  readonly accent?: boolean;
  readonly amber?: boolean;
  readonly italic?: boolean;
}

export const BlurWords: React.FC<{
  words: readonly WordSpec[];
  start?: number;
  stagger?: number;
  fontSize?: number;
  align?: "center" | "left";
}> = ({ words, start = 0, stagger = 7, fontSize = 68, align = "center" }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "baseline",
        columnGap: Math.round(fontSize * 0.25),
        rowGap: 10,
        fontFamily: FONTS.SANS,
        fontSize,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.16,
      }}
    >
      {words.map((w, idx) => {
        const wStart = start + idx * stagger;
        const p = interpolate(frame, [wStart, wStart + 28], [0, 1], {
          ...CLAMP,
          easing: EASE_APPLE,
        });
        const blur = interpolate(p, [0, 1], [16, 0], CLAMP);
        const y = interpolate(p, [0, 1], [24, 0], CLAMP);
        const scale = interpolate(p, [0, 1], [0.94, 1], CLAMP);

        const color = w.amber
          ? COLORS.AMBER
          : w.accent
          ? COLORS.EMERALD
          : COLORS.INK;

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px) scale(${scale})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : "none",
              color,
              fontFamily: w.italic ? FONTS.SERIF : FONTS.SANS,
              fontStyle: w.italic ? "italic" : "normal",
              fontWeight: w.italic ? 400 : 800,
              fontSize: w.italic ? Math.round(fontSize * 1.13) : fontSize,
              letterSpacing: w.italic ? "-0.01em" : "-0.03em",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const SmoothCursor: React.FC<{
  x: number;
  y: number;
  opacity: number;
  clicking?: boolean;
}> = ({ x, y, opacity, clicking = false }) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px) scale(${clicking ? 0.85 : 1})`,
        opacity,
        zIndex: 60,
        pointerEvents: "none",
        filter: "drop-shadow(0 8px 14px rgba(17, 26, 20, 0.24))",
      }}
    >
      <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 4L25 16.5L16 18.2L12.2 27L6 4Z"
          fill={COLORS.INK}
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/**
 * Ilustrasi Pohon Buah Tabulampot Prosedural (0.0 -> 1.0):
 * Awalnya daun tipis + bunga gugur; saat slider digeser (nutrisi POC + Kalsium),
 * tajuk rimbun & 5 buah jeruk emas matang menempel kokoh di ranting!
 */
export const FruitTreeSimulation: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 420,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const canopyScale = interpolate(p, [0, 1], [0.82, 1.04], CLAMP);
  const droppedOpacity = interpolate(p, [0, 0.38], [1, 0], CLAMP);
  const droppedY = interpolate(p, [0, 0.38], [0, 18], CLAMP);
  const fruitScale = interpolate(p, [0.35, 0.92], [0, 1], CLAMP);
  const shineOpacity = interpolate(p, [0.7, 1], [0, 0.85], CLAMP);

  const fruits = [
    { x: 132, y: 128, r: 17 },
    { x: 224, y: 118, r: 19 },
    { x: 180, y: 86, r: 16 },
    { x: 148, y: 178, r: 18 },
    { x: 214, y: 174, r: 16 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 360 360" fill="none">
      {/* Bayangan pot */}
      <ellipse cx="180" cy="332" rx="84" ry="12" fill="rgba(17, 26, 20, 0.1)" />

      {/* Bunga rontok di tanah (hanya terlihat saat p rendah = air biasa saja) */}
      {droppedOpacity > 0.02 && (
        <g opacity={droppedOpacity} transform={`translate(0, ${droppedY})`}>
          <circle cx="102" cy="316" r="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="256" cy="312" r="5.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="272" cy="322" r="4.5" fill="#FCA5A5" />
        </g>
      )}

      {/* Batang kayu pohon buah */}
      <path d="M180 264 L180 170" stroke="#784B32" strokeWidth="14" strokeLinecap="round" />
      <path d="M180 205 L146 168" stroke="#784B32" strokeWidth="8" strokeLinecap="round" />
      <path d="M180 198 L216 164" stroke="#784B32" strokeWidth="8" strokeLinecap="round" />

      {/* Tajuk daun rimbun yang mengembang */}
      <g transform={`translate(180, 146) scale(${canopyScale}) translate(-180, -146)`}>
        <circle cx="136" cy="148" r="56" fill="#16A34A" />
        <circle cx="224" cy="146" r="58" fill="#15803D" />
        <circle cx="180" cy="108" r="66" fill="#22C55E" />
        <circle cx="180" cy="158" r="52" fill="#16A34A" />

        {/* Buah jeruk / buah matang menempel kuat berkat Ekstra Kalsium & POC */}
        {fruitScale > 0.01 &&
          fruits.map((f, idx) => (
            <g key={idx} transform={`translate(${f.x}, ${f.y}) scale(${fruitScale})`}>
              <circle cx="0" cy="0" r={f.r} fill="#F59E0B" />
              <circle cx={-f.r * 0.28} cy={-f.r * 0.28} r={f.r * 0.28} fill="#FEF3C7" opacity={shineOpacity} />
              <path d={`M0 ${-f.r} L3 ${-f.r - 5}`} stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
      </g>

      {/* Pot Tabulampot Terakota */}
      <ellipse cx="180" cy="264" rx="66" ry="13" fill="#4B3629" />
      <path
        d="M116 266 L130 328 C131 332 135 334 140 334 H220 C225 334 229 332 230 328 L244 266 Z"
        fill={COLORS.TERRACOTTA}
      />
      <rect x="110" y="252" width="140" height="22" rx="9" fill="#D97356" />
      <path d="M128 276 L138 326" stroke="rgba(255,255,255,0.22)" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
};

export const AmbientCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const a1x = interpolate(frame, [0, 1800], [-100, 130], CLAMP);
  const a1y = interpolate(frame, [0, 1800], [-120, 150], CLAMP);
  const a2x = interpolate(frame, [0, 1800], [120, -110], CLAMP);
  const a2y = interpolate(frame, [0, 1800], [140, -130], CLAMP);

  const motes = [
    { x: 160, y: 260, r: 6, s: 0.35, ph: 0.3 },
    { x: 920, y: 340, r: 7, s: 0.29, ph: 1.5 },
    { x: 210, y: 1560, r: 6, s: 0.4, ph: 2.6 },
    { x: 870, y: 1480, r: 8, s: 0.31, ph: 3.7 },
    { x: 540, y: 190, r: 5, s: 0.37, ph: 4.5 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.CANVAS,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 960,
          height: 960,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(253, 230, 138, 0.32) 0%, rgba(253, 230, 138, 0.06) 45%, rgba(251, 251, 247, 0) 72%)",
          top: -260,
          left: -220,
          transform: `translate(${a1x}px, ${a1y}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1020,
          height: 1020,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(134, 239, 172, 0.34) 0%, rgba(134, 239, 172, 0.08) 44%, rgba(251, 251, 247, 0) 72%)",
          bottom: -280,
          right: -240,
          transform: `translate(${a2x}px, ${a2y}px)`,
        }}
      />
      {motes.map((m, idx) => {
        const dx = Math.sin(frame * 0.016 * m.s + m.ph) * 24;
        const dy = Math.cos(frame * 0.014 * m.s + m.ph) * 22;
        const op = 0.22 + 0.14 * Math.sin(frame * 0.02 + m.ph);
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: m.x,
              top: m.y,
              width: m.r * 2,
              height: m.r * 2,
              borderRadius: "50%",
              backgroundColor: idx % 2 === 0 ? COLORS.LEAF : COLORS.AMBER,
              opacity: op,
              filter: "blur(2px)",
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
