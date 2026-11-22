import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS } from "../theme";

/**
 * Emblem Botani Orisinal Seflorner (menggantikan total logo segitiga Remotion).
 * Tiga lapisan daun melengkung yang harmonis dalam palet hijau zamrud -> mint.
 */
export const SeflornerLeafEmblem: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    {/* Lapisan cahaya daun belakang */}
    <path
      d="M22 96 C22 46, 56 18, 102 18 C102 64, 74 96, 22 96 Z"
      fill={COLORS.MINT}
      opacity="0.45"
      transform="translate(-5, 5) scale(1.04)"
    />
    {/* Lapisan daun tengah */}
    <path
      d="M28 92 C28 50, 58 24, 96 24 C96 64, 70 92, 28 92 Z"
      fill={COLORS.LEAF}
      opacity="0.72"
    />
    {/* Lapisan inti daun zamrud */}
    <path
      d="M34 86 C34 54, 58 32, 88 32 C88 64, 66 86, 34 86 Z"
      fill={COLORS.EMERALD}
    />
    {/* Tulang daun presisi */}
    <path
      d="M36 84 C52 68, 66 54, 82 38"
      stroke="#FFFFFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.92"
    />
    <path
      d="M52 68 C52 59, 55 53, 60 48"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.78"
    />
    <path
      d="M64 56 C71 56, 76 54, 81 50"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.78"
    />
  </svg>
);

/**
 * Teks Blur-In per kata yang super halus (mempertahankan DNA referensi, di-upgrade dengan dukungan serif italic).
 */
export interface WordSpec {
  readonly text: string;
  readonly accent?: boolean;
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
        columnGap: Math.round(fontSize * 0.27),
        rowGap: 10,
        fontFamily: FONTS.SANS,
        fontSize,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.18,
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

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px) scale(${scale})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : "none",
              color: w.accent ? COLORS.EMERALD : COLORS.INK,
              fontFamily: w.italic ? FONTS.SERIF : FONTS.SANS,
              fontStyle: w.italic ? "italic" : "normal",
              fontWeight: w.italic ? 400 : 700,
              fontSize: w.italic ? Math.round(fontSize * 1.14) : fontSize,
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

/**
 * Kursor panah bersih gaya macOS untuk interaksi slider pertumbuhan & klik tombol.
 */
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
        filter: "drop-shadow(0 8px 14px rgba(17, 26, 20, 0.22))",
      }}
    >
      <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
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
 * Ilustrasi Tanaman Tumbuh Prosedural (0.0 -> 1.0):
 * Pot terakota -> tunas muncul -> batang naik -> 6 daun mekar -> 3 buah tomat ceri merah matang!
 */
export const GrowingGardenPlant: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 320,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const stemHeight = interpolate(p, [0.05, 0.72], [0, 152], CLAMP);
  const leaf1 = interpolate(p, [0.18, 0.42], [0, 1], CLAMP);
  const leaf2 = interpolate(p, [0.28, 0.52], [0, 1], CLAMP);
  const leaf3 = interpolate(p, [0.42, 0.68], [0, 1], CLAMP);
  const leaf4 = interpolate(p, [0.52, 0.76], [0, 1], CLAMP);
  const crown = interpolate(p, [0.60, 0.84], [0, 1], CLAMP);
  const fruit = interpolate(p, [0.74, 0.96], [0, 1], CLAMP);

  const stemTopY = 236 - stemHeight;

  return (
    <svg width={size} height={size} viewBox="0 0 320 320" fill="none">
      {/* Bayangan lembut di bawah pot */}
      <ellipse cx="160" cy="296" rx="74" ry="11" fill="rgba(17, 26, 20, 0.1)" />

      {/* Batang utama tumbuh dari tanah */}
      {stemHeight > 1 && (
        <path
          d={`M160 236 Q155 ${236 - stemHeight * 0.5} 160 ${stemTopY}`}
          stroke="#15803D"
          strokeWidth="7"
          strokeLinecap="round"
        />
      )}

      {/* Daun 1 (kiri bawah) */}
      <g
        transform={`translate(158, 198) scale(${leaf1})`}
        opacity={leaf1}
      >
        <path
          d="M0 0 C-26 -2, -52 -16, -54 -34 C-32 -36, -12 -22, 0 0 Z"
          fill="#22C55E"
        />
        <path d="M-4 -3 C-20 -12, -34 -20, -45 -29" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Daun 2 (kanan bawah) */}
      <g
        transform={`translate(161, 184) scale(${leaf2})`}
        opacity={leaf2}
      >
        <path
          d="M0 0 C26 -4, 54 -18, 56 -36 C34 -38, 12 -22, 0 0 Z"
          fill="#16A34A"
        />
        <path d="M4 -3 C20 -12, 34 -20, 46 -30" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Daun 3 (kiri atas) */}
      <g
        transform={`translate(158, 144) scale(${leaf3})`}
        opacity={leaf3}
      >
        <path
          d="M0 0 C-28 -4, -56 -20, -58 -40 C-34 -42, -12 -24, 0 0 Z"
          fill="#15803D"
        />
        <path d="M-4 -4 C-22 -14, -36 -24, -48 -34" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Daun 4 (kanan atas) */}
      <g
        transform={`translate(161, 130) scale(${leaf4})`}
        opacity={leaf4}
      >
        <path
          d="M0 0 C26 -4, 52 -20, 54 -38 C32 -40, 12 -22, 0 0 Z"
          fill="#22C55E"
        />
        <path d="M4 -4 C20 -14, 34 -24, 45 -32" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Pucuk daun mahkota */}
      <g
        transform={`translate(160, 92) scale(${crown})`}
        opacity={crown}
      >
        <path
          d="M0 0 C-18 -14, -18 -40, 0 -54 C18 -40, 18 -14, 0 0 Z"
          fill="#4ADE80"
        />
        <path d="M0 -4 L0 -44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* 3 Buah Tomat Ceri Merah Segar (siap panen!) */}
      {fruit > 0.01 && (
        <>
          <g transform={`translate(122, 162) scale(${fruit})`}>
            <circle cx="0" cy="0" r="14" fill="#E11D48" />
            <circle cx="-4" cy="-4" r="3.8" fill="#FDA4AF" opacity="0.85" />
          </g>
          <g transform={`translate(198, 148) scale(${fruit})`}>
            <circle cx="0" cy="0" r="15" fill="#E11D48" />
            <circle cx="-4.5" cy="-4.5" r="4" fill="#FDA4AF" opacity="0.85" />
          </g>
          <g transform={`translate(142, 114) scale(${fruit})`}>
            <circle cx="0" cy="0" r="11.5" fill="#F43F5E" />
            <circle cx="-3.5" cy="-3.5" r="3" fill="#FECDD3" opacity="0.85" />
          </g>
        </>
      )}

      {/* Pot Terakota Modern */}
      <ellipse cx="160" cy="236" rx="58" ry="12" fill="#4B3629" />
      <path
        d="M104 238 L116 292 C117 296 121 298 126 298 H194 C199 298 203 296 204 292 L216 238 Z"
        fill="#C25B3F"
      />
      <rect x="98" y="226" width="124" height="20" rx="8" fill="#D97356" />
      <path d="M114 246 L124 292" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Latar Belakang Kanvas Bersih dengan Aura Cahaya Pagi & Serbuk Cahaya Organik Halus
 */
export const BotanicalAmbientCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const aura1X = interpolate(frame, [0, 1800], [-140, 190], CLAMP);
  const aura1Y = interpolate(frame, [0, 1800], [-90, 130], CLAMP);
  const aura2X = interpolate(frame, [0, 1800], [180, -170], CLAMP);
  const aura2Y = interpolate(frame, [0, 1800], [120, -110], CLAMP);

  // 7 partikel cahaya pagi lembut deterministik (Research Gap atmospheric depth)
  const motes = [
    { x: 240, y: 220, r: 6, speed: 0.35, phase: 0.2 },
    { x: 1620, y: 190, r: 8, speed: 0.28, phase: 1.4 },
    { x: 420, y: 860, r: 5, speed: 0.42, phase: 2.3 },
    { x: 1480, y: 820, r: 7, speed: 0.31, phase: 3.1 },
    { x: 960, y: 140, r: 5, speed: 0.38, phase: 4.0 },
    { x: 1740, y: 540, r: 6, speed: 0.26, phase: 5.2 },
    { x: 170, y: 580, r: 7, speed: 0.33, phase: 0.9 },
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
      {/* Aura Hijau Sage Lembut */}
      <div
        style={{
          position: "absolute",
          width: 1120,
          height: 1120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(134, 239, 172, 0.34) 0%, rgba(134, 239, 172, 0.08) 42%, rgba(251, 251, 247, 0) 72%)",
          bottom: -360,
          right: -240,
          transform: `translate(${aura2X}px, ${aura2Y}px)`,
        }}
      />
      {/* Aura Cahaya Matahari Pagi */}
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(253, 230, 138, 0.26) 0%, rgba(187, 247, 208, 0.14) 44%, rgba(251, 251, 247, 0) 70%)",
          top: -320,
          left: -240,
          transform: `translate(${aura1X}px, ${aura1Y}px)`,
        }}
      />
      {/* Serbuk cahaya pagi melayang pelan */}
      {motes.map((m, idx) => {
        const dx = Math.sin(frame * 0.015 * m.speed + m.phase) * 28;
        const dy = Math.cos(frame * 0.013 * m.speed + m.phase) * 22;
        const op = 0.22 + 0.14 * Math.sin(frame * 0.02 + m.phase);
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
              backgroundColor: idx % 2 === 0 ? COLORS.LEAF : COLORS.WARM_GOLD,
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
