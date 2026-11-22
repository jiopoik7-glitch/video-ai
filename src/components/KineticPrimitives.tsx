import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_SANS } from "../theme";

export type BotanicalIconName =
  | "soil"
  | "leaf"
  | "sprout"
  | "sun"
  | "drop"
  | "flower"
  | "root"
  | "harvest"
  | "wind"
  | "arrowUp"
  | "plus";

/**
 * Organic Morphing Acid-Lime Liquid Blob (Signature visual of Reference Video 1)
 */
export const OrganicLimeBlob: React.FC<{
  size: number;
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  blurPx?: number;
}> = ({ size, x, y, rotation = 0, scale = 1, opacity = 1, blurPx = 18 }) => {
  const frame = useCurrentFrame();
  const wobble = Math.sin(frame * 0.045) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rotation + wobble}deg) scale(${scale})`,
        opacity,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
        <path
          d="M214 32C282 28 344 74 364 140C384 206 356 292 296 336C236 380 144 378 88 332C32 286 16 200 42 134C68 68 146 36 214 32Z"
          fill={COLORS.LIME}
        />
      </svg>
    </div>
  );
};

/**
 * Seflorner Organic Ribbon Emblem (Signature circular lime mark inspired by 00:05–00:06)
 */
export const SeflornerCircleEmblem: React.FC<{ size?: number }> = ({ size = 128 }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
    <circle cx="70" cy="70" r="68" fill={COLORS.LIME} />
    {/* Organic flowing sprout-ribbon stroke */}
    <path
      d="M38 86 C38 56, 56 44, 68 66 C80 88, 102 78, 102 48"
      stroke={COLORS.DARK_BG}
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="102" cy="48" r="9" fill={COLORS.DARK_BG} />
  </svg>
);

/**
 * Glowing Green Dot-Matrix Background (Signature dark scenes 00:06–00:10 & 00:14–00:17)
 */
export const DarkMatrixBackdrop: React.FC<{ glowX?: number; glowY?: number }> = ({
  glowX = 240,
  glowY = 780,
}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.025) * 45;
  const driftY = Math.cos(frame * 0.02) * 35;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.DARK_BG, overflow: "hidden", pointerEvents: "none" }}>
      {/* Radiant Lime Under-Glow */}
      <div
        style={{
          position: "absolute",
          left: glowX - 540 + driftX,
          top: glowY - 540 + driftY,
          width: 1080,
          height: 1080,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(163, 230, 0, 0.34) 0%, rgba(21, 128, 61, 0.16) 44%, rgba(6, 10, 5, 0) 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -280 - driftX * 0.6,
          top: -220 + driftY * 0.6,
          width: 880,
          height: 880,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(132, 204, 22, 0.22) 0%, rgba(6, 10, 5, 0) 70%)",
        }}
      />
      {/* Crisp Technical Dot Matrix Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(163, 230, 0, 0.16) 2px, transparent 2px)",
          backgroundSize: "34px 34px",
          opacity: 0.65,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Lime Arrow Cursor with "pikiran" / "seflorner" Floating Tag (Homage to "editor" cursor tag in Video 1)
 */
export const KineticCursor: React.FC<{
  x: number;
  y: number;
  label?: string;
  opacity?: number;
  clicking?: boolean;
  mode?: "arrow" | "hand";
}> = ({ x, y, label = "pikiran", opacity = 1, clicking = false, mode = "arrow" }) => {
  if (opacity <= 0.01) return null;
  const sc = clicking ? 0.86 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${sc})`,
        opacity,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      {mode === "arrow" ? (
        <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
          <path
            d="M5 4L30 16L18 19.5L14 31L5 4Z"
            fill={COLORS.LIME}
            stroke={COLORS.DARK_BG}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
          <path
            d="M15 7a2.5 2.5 0 0 1 5 0v7h2a2.5 2.5 0 0 1 2.5 2.5V17h1.5a2.5 2.5 0 0 1 2.5 2.5V23c0 5-3.5 9-9 9h-2c-4.5 0-7.5-2.5-9.5-6.5l-2.5-4.8a2.3 2.3 0 0 1 3.8-2.5L12 20V9.5A2.5 2.5 0 0 1 15 7Z"
            fill="#FFFFFF"
            stroke={COLORS.DARK_BG}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {label && (
        <div
          style={{
            marginLeft: 32,
            marginTop: -6,
            backgroundColor: "rgba(18, 27, 17, 0.92)",
            border: "1.5px solid rgba(163, 230, 0, 0.55)",
            color: COLORS.WHITE,
            fontFamily: FONT_SANS,
            fontSize: 21,
            fontWeight: 600,
            padding: "6px 18px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

/**
 * Crisp Native SVG Icons (zero emojis!)
 */
export const BotanicalIcon: React.FC<{
  name: BotanicalIconName;
  size?: number;
  color?: string;
}> = ({ name, size = 34, color = COLORS.LIME }) => {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "soil":
      return (
        <svg {...c}>
          <path d="M3 18h18" />
          <path d="M5 14c2-2 5-2 7 0s5 2 7 0" />
          <circle cx="8" cy="10" r="1" fill={color} stroke="none" />
          <circle cx="15" cy="9" r="1.2" fill={color} stroke="none" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...c}>
          <path d="M5 19C5 11 10 5 19 5C19 14 13 19 5 19Z" />
          <path d="M5 19L13 11" />
        </svg>
      );
    case "sprout":
      return (
        <svg {...c}>
          <path d="M12 20V11" />
          <path d="M12 13C8 13 5 10 5 6c4 0 7 3 7 7Z" />
          <path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7Z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
        </svg>
      );
    case "drop":
      return (
        <svg {...c}>
          <path d="M12 3.5S6 10.2 6 14.2a6 6 0 0 0 12 0C18 10.2 12 3.5 12 3.5Z" />
        </svg>
      );
    case "flower":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 4.5a2.5 2.5 0 0 1 0 5M12 14.5a2.5 2.5 0 0 1 0 5M4.5 12a2.5 2.5 0 0 1 5 0M14.5 12a2.5 2.5 0 0 1 5 0" />
        </svg>
      );
    case "root":
      return (
        <svg {...c}>
          <path d="M12 4v6" />
          <path d="M12 10c-2 3-5 5-6 9" />
          <path d="M12 10c2 3 5 5 6 9" />
          <path d="M12 10v9" />
        </svg>
      );
    case "harvest":
      return (
        <svg {...c}>
          <circle cx="12" cy="13.5" r="6" />
          <path d="M12 7.5V4" />
          <path d="M12 7.5C10 6 8.5 6 7 7" />
          <path d="M12 7.5C14 6 15.5 6 17 7" />
        </svg>
      );
    case "wind":
      return (
        <svg {...c}>
          <path d="M4 9h11a2.5 2.5 0 1 0-2.5-2.5" />
          <path d="M4 14h14a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M4 19h7" />
        </svg>
      );
    case "arrowUp":
      return (
        <svg {...c}>
          <path d="M12 19V5" />
          <path d="M6 11l6-6 6 6" />
        </svg>
      );
    case "plus":
      return (
        <svg {...c}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
  }
};
