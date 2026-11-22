import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS, LIQUID_GLASS_STYLE } from "../theme";

/**
 * Latar belakang Organic Mesh Canvas berdimensi agar efek Liquid Glass terlihat cair & biasnya nyata.
 */
export const OrganicMeshCanvas: React.FC = () => {
  const frame = useCurrentFrame();

  const b1x = interpolate(frame, [0, 1200], [-90, 130], CLAMP);
  const b1y = interpolate(frame, [0, 1200], [-80, 140], CLAMP);
  const b2x = interpolate(frame, [0, 1200], [110, -120], CLAMP);
  const b2y = interpolate(frame, [0, 1200], [90, -110], CLAMP);
  const b3x = interpolate(frame, [0, 1200], [-70, 95], CLAMP);
  const b3y = interpolate(frame, [0, 1200], [120, -90], CLAMP);

  const motes = [
    { x: 150, y: 310, r: 6, ph: 0.2 },
    { x: 920, y: 420, r: 7, ph: 1.4 },
    { x: 240, y: 1220, r: 5, ph: 2.5 },
    { x: 860, y: 1380, r: 8, ph: 3.7 },
    { x: 540, y: 240, r: 5, ph: 4.8 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.CANVAS, overflow: "hidden", pointerEvents: "none" }}>
      {/* Mesh 1: Soft Strawberry Rose (Kiri Atas) */}
      <div
        style={{
          position: "absolute",
          width: 880,
          height: 880,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251, 113, 133, 0.36) 0%, rgba(253, 164, 175, 0.14) 44%, rgba(246, 245, 242, 0) 72%)",
          top: -160,
          left: -180,
          transform: `translate(${b1x}px, ${b1y}px)`,
        }}
      />
      {/* Mesh 2: Fresh Botanical Sage (Kanan Tengah) */}
      <div
        style={{
          position: "absolute",
          width: 920,
          height: 920,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74, 222, 128, 0.36) 0%, rgba(134, 239, 172, 0.14) 45%, rgba(246, 245, 242, 0) 72%)",
          top: 480,
          right: -240,
          transform: `translate(${b2x}px, ${b2y}px)`,
        }}
      />
      {/* Mesh 3: Warm Morning Sunlight Gold (Kiri Bawah) */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(252, 211, 77, 0.34) 0%, rgba(253, 230, 138, 0.12) 45%, rgba(246, 245, 242, 0) 72%)",
          bottom: -220,
          left: -160,
          transform: `translate(${b3x}px, ${b3y}px)`,
        }}
      />
      {/* Mesh 4: Crisp Mint Highlight (Kanan Bawah) */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167, 243, 208, 0.32) 0%, rgba(167, 243, 208, 0) 70%)",
          bottom: 180,
          right: -120,
          transform: `translate(${-b1x * 0.6}px, ${b2y * 0.5}px)`,
        }}
      />

      {/* Partikel Cahaya Mikro Deterministik */}
      {motes.map((m, idx) => {
        const dx = Math.sin(frame * 0.018 + m.ph) * 22;
        const dy = Math.cos(frame * 0.015 + m.ph) * 20;
        const op = 0.24 + 0.12 * Math.sin(frame * 0.025 + m.ph);
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
              backgroundColor: idx % 2 === 0 ? COLORS.BERRY : COLORS.LEAF,
              opacity: op,
              filter: "blur(2.5px)",
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Permukaan Kartu Liquid Glass dengan rim specular dan kilau cahaya diagonal bergerak.
 */
export const LiquidGlassCard: React.FC<{
  children: React.ReactNode;
  borderRadius?: number;
  sheenStart?: number;
  style?: React.CSSProperties;
}> = ({ children, borderRadius = 36, sheenStart = 6, style }) => {
  const frame = useCurrentFrame();
  const sheenPos = interpolate(frame, [sheenStart, sheenStart + 58], [-120, 220], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const sheenOp = interpolate(
    frame,
    [sheenStart, sheenStart + 18, sheenStart + 44, sheenStart + 58],
    [0, 0.55, 0.45, 0],
    CLAMP
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        ...LIQUID_GLASS_STYLE,
        ...style,
      }}
    >
      {/* Moving Diagonal Specular Glass Sheen */}
      {sheenOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0) 68%)",
            transform: `translateX(${sheenPos}%)`,
            opacity: sheenOp,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}
      {children}
    </div>
  );
};

/**
 * iOS Status Bar Minimalis + Dynamic Island Progress Pill di Bagian Atas.
 */
export const IosStatusBar: React.FC<{ progressPct: number }> = ({ progressPct }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 64,
        right: 64,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {/* Jam iOS */}
      <span
        style={{
          fontFamily: FONTS.MONO,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.INK,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        09:41
      </span>

      {/* Dynamic Island Progress Pill */}
      <div
        style={{
          width: 248,
          height: 44,
          borderRadius: 999,
          backgroundColor: "rgba(17, 26, 20, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          boxShadow: "0 10px 26px rgba(17, 26, 20, 0.16)",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: COLORS.BERRY,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 7,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.BERRY} 0%, ${COLORS.LEAF} 100%)`,
            }}
          />
        </div>
      </div>

      {/* Sinyal & Baterai SVG Native (Zero Emoji) */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
          <rect x="2" y="15" width="5" height="7" rx="1.5" fill={COLORS.INK} />
          <rect x="10" y="11" width="5" height="11" rx="1.5" fill={COLORS.INK} />
          <rect x="18" y="6" width="5" height="16" rx="1.5" fill={COLORS.INK} />
          <rect x="26" y="2" width="5" height="20" rx="1.5" fill={COLORS.INK} />
        </svg>
        <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
          <rect x="1.5" y="2.5" width="38" height="19" rx="5.5" stroke={COLORS.INK} strokeWidth="2.4" />
          <rect x="5" y="6" width="28" height="12" rx="2.5" fill={COLORS.EMERALD} />
          <path d="M42.5 8.5V15.5" stroke={COLORS.INK} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

/**
 * Ikon SVG Stroberi Minimalis (strokeWidth 2, tanpa emoji).
 */
export const StrawberryEmblem: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path
      d="M32 56C22 52 14 40 15 28C16 20 23 16 32 18C41 16 48 20 49 28C50 40 42 52 32 56Z"
      fill="#F43F5E"
      stroke="#BE123C"
      strokeWidth="2"
    />
    <path
      d="M22 18C24 12 28 10 32 13C36 10 40 12 42 18C38 19 35 18 32 17C29 18 26 19 22 18Z"
      fill="#22C55E"
      stroke="#15803D"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M32 13V7" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="25" cy="29" r="1.5" fill="#FFE4E6" />
    <circle cx="33" cy="27" r="1.5" fill="#FFE4E6" />
    <circle cx="39" cy="31" r="1.5" fill="#FFE4E6" />
    <circle cx="28" cy="38" r="1.5" fill="#FFE4E6" />
    <circle cx="36" cy="40" r="1.5" fill="#FFE4E6" />
    <circle cx="32" cy="47" r="1.5" fill="#FFE4E6" />
  </svg>
);

export interface WordSpec {
  readonly text: string;
  readonly berry?: boolean;
  readonly emerald?: boolean;
  readonly italic?: boolean;
}

export const BlurWords: React.FC<{
  words: readonly WordSpec[];
  start?: number;
  stagger?: number;
  fontSize?: number;
}> = ({ words, start = 0, stagger = 6, fontSize = 68 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: Math.round(fontSize * 0.24),
        rowGap: 10,
        fontFamily: FONTS.SANS,
        fontSize,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.15,
      }}
    >
      {words.map((w, idx) => {
        const st = start + idx * stagger;
        const p = interpolate(frame, [st, st + 24], [0, 1], {
          ...CLAMP,
          easing: EASE_APPLE,
        });
        const blur = interpolate(p, [0, 1], [14, 0], CLAMP);
        const y = interpolate(p, [0, 1], [22, 0], CLAMP);
        const color = w.berry
          ? COLORS.BERRY
          : w.emerald
          ? COLORS.EMERALD
          : COLORS.INK;

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px)`,
              filter: blur > 0.2 ? `blur(${blur}px)` : "none",
              color,
              fontFamily: w.italic ? FONTS.SERIF : FONTS.SANS,
              fontStyle: w.italic ? "italic" : "normal",
              fontWeight: w.italic ? 400 : 800,
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
 * Kursor Sentuhan Kaca iOS (tactile translucent pointer).
 */
export const IosTouchPointer: React.FC<{
  x: number;
  y: number;
  opacity: number;
  pressing?: boolean;
}> = ({ x, y, opacity, pressing = false }) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 58,
        height: 58,
        borderRadius: "50%",
        backgroundColor: pressing
          ? "rgba(225, 29, 72, 0.28)"
          : "rgba(255, 255, 255, 0.55)",
        border: "2.5px solid rgba(255, 255, 255, 0.95)",
        boxShadow: "0 10px 28px rgba(17, 26, 20, 0.22)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transform: `translate(${x - 29}px, ${y - 29}px) scale(${pressing ? 0.84 : 1})`,
        opacity,
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Ilustrasi Tanaman Stroberi Pot Prosedural (0.0 -> 1.0):
 * Daun rimbun + bunga putih + 4 buah stroberi merah ranum menggantung di bibir pot terakota.
 */
export const StrawberryPotArtwork: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 340,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const leafScale = interpolate(p, [0, 1], [0.78, 1.04], CLAMP);
  const blossomScale = interpolate(p, [0.22, 0.65], [0, 1], CLAMP);
  const berryScale = interpolate(p, [0.38, 0.94], [0, 1], CLAMP);

  const berries = [
    { x: 112, y: 204, rot: 16, sc: 1.05 },
    { x: 248, y: 200, rot: -18, sc: 1.08 },
    { x: 164, y: 220, rot: 6, sc: 0.96 },
    { x: 206, y: 174, rot: -10, sc: 0.92 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 360 360" fill="none">
      <ellipse cx="180" cy="332" rx="88" ry="12" fill="rgba(17, 26, 20, 0.1)" />

      {/* Rimbun Daun Stroberi */}
      <g transform={`translate(180, 224) scale(${leafScale}) translate(-180, -224)`}>
        <path d="M180 228 Q138 164 98 136" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
        <path d="M180 228 Q224 162 264 138" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
        <path d="M180 228 Q180 156 180 108" stroke="#16A34A" strokeWidth="6.5" strokeLinecap="round" />
        <ellipse cx="102" cy="138" rx="44" ry="26" transform="rotate(-24 102 138)" fill="#16A34A" />
        <ellipse cx="258" cy="140" rx="44" ry="26" transform="rotate(24 258 140)" fill="#15803D" />
        <ellipse cx="180" cy="108" rx="46" ry="30" fill="#22C55E" />
        <ellipse cx="144" cy="166" rx="42" ry="24" transform="rotate(-12 144 166)" fill="#22C55E" />
        <ellipse cx="216" cy="166" rx="42" ry="24" transform="rotate(12 216 166)" fill="#16A34A" />

        {/* Bunga Putih Stroberi */}
        {blossomScale > 0.02 && (
          <>
            <g transform={`translate(132, 122) scale(${blossomScale})`}>
              <circle cx="0" cy="-9" r="7" fill="#FFFFFF" />
              <circle cx="9" cy="-2" r="7" fill="#FFFFFF" />
              <circle cx="5" cy="8" r="7" fill="#FFFFFF" />
              <circle cx="-5" cy="8" r="7" fill="#FFFFFF" />
              <circle cx="-9" cy="-2" r="7" fill="#FFFFFF" />
              <circle cx="0" cy="0" r="5" fill="#FACC15" />
            </g>
            <g transform={`translate(232, 118) scale(${blossomScale})`}>
              <circle cx="0" cy="-8" r="6" fill="#FFFFFF" />
              <circle cx="8" cy="-2" r="6" fill="#FFFFFF" />
              <circle cx="5" cy="7" r="6" fill="#FFFFFF" />
              <circle cx="-5" cy="7" r="6" fill="#FFFFFF" />
              <circle cx="-8" cy="-2" r="6" fill="#FFFFFF" />
              <circle cx="0" cy="0" r="4.5" fill="#FACC15" />
            </g>
          </>
        )}
      </g>

      {/* Pot Terakota */}
      <ellipse cx="180" cy="236" rx="76" ry="15" fill="#4B3629" />
      <path
        d="M106 238 L122 326 C123 330 128 333 133 333 H227 C232 333 237 330 238 326 L254 238 Z"
        fill="#C25B3F"
      />
      <rect x="98" y="222" width="164" height="24" rx="10" fill="#D97356" />
      <path d="M120 250 L132 324" stroke="rgba(255,255,255,0.22)" strokeWidth="6" strokeLinecap="round" />

      {/* Buah Stroberi Ranum Menggantung di Atas Pot */}
      {berryScale > 0.02 &&
        berries.map((b, idx) => (
          <g
            key={idx}
            transform={`translate(${b.x}, ${b.y}) rotate(${b.rot}) scale(${berryScale * b.sc})`}
          >
            <path d="M0 30 C-14 24 -20 8 -18 -4 C-16 -14 -7 -18 0 -15 C7 -18 16 -14 18 -4 C20 8 14 24 0 30 Z" fill="#E11D48" />
            <path d="M-11 -14 L0 -8 L11 -14 L6 -20 L0 -16 L-6 -20 Z" fill="#16A34A" />
            <circle cx="-6" cy="-2" r="1.7" fill="#FFE4E6" />
            <circle cx="5" cy="0" r="1.7" fill="#FFE4E6" />
            <circle cx="-2" cy="10" r="1.7" fill="#FFE4E6" />
            <circle cx="6" cy="12" r="1.7" fill="#FFE4E6" />
            <circle cx="0" cy="20" r="1.5" fill="#FFE4E6" />
          </g>
        ))}
    </svg>
  );
};
