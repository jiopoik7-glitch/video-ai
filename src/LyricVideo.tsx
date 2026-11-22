import React, { useEffect } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Ubah ke false jika ingin teks putih murni tanpa pinggiran RGB analog
const ENABLE_RGB_ABERRATION = true;

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&family=Special+Elite&display=swap";

let fontsLoaded = false;

function loadLyricFonts(): void {
  if (typeof document === "undefined" || fontsLoaded) return;
  fontsLoaded = true;
  const handle = delayRender("Loading lyric fonts");
  let settled = false;
  const finish = () => {
    if (!settled) {
      settled = true;
      continueRender(handle);
    }
  };
  const timer = globalThis.setTimeout(finish, 3000);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = GOOGLE_FONTS_URL;
  link.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          globalThis.clearTimeout(timer);
          finish();
        })
        .catch(() => {
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
}

type FontVariant = "serif" | "typewriter" | "melted" | "underlined" | "mono";

interface LyricBlock {
  readonly id: string;
  readonly lines: readonly string[];
  readonly startSec: number;
  readonly typeDurationSec: number;
  readonly fadeStartSec: number;
  readonly fadeDurationSec: number;
  readonly variant: FontVariant;
  readonly fontSize?: number;
}

// Lirik & timecode tersinkron dari video 35 detik (bagian lagu 00:00 - 00:31)
const LYRIC_BLOCKS: readonly LyricBlock[] = [
  {
    id: "l1",
    lines: ["it's", "only"],
    startSec: 1.9,
    typeDurationSec: 0.95,
    fadeStartSec: 3.35,
    fadeDurationSec: 0.55,
    variant: "serif",
    fontSize: 108,
  },
  {
    id: "l2",
    lines: ["me", "and", "you."],
    startSec: 3.45,
    typeDurationSec: 1.35,
    fadeStartSec: 5.85,
    fadeDurationSec: 0.65,
    variant: "typewriter",
    fontSize: 96,
  },
  {
    id: "l3",
    lines: ["la, la,", "la, la,", "la"],
    startSec: 10.3,
    typeDurationSec: 1.7,
    fadeStartSec: 13.0,
    fadeDurationSec: 0.55,
    variant: "serif",
    fontSize: 100,
  },
  {
    id: "l4",
    lines: ["la, la,", "la, la,", "la"],
    startSec: 14.3,
    typeDurationSec: 1.75,
    fadeStartSec: 17.5,
    fadeDurationSec: 0.55,
    variant: "underlined",
    fontSize: 94,
  },
  {
    id: "l5",
    lines: ["LA-DA-DUN,", "DA-DA,", "DA"],
    startSec: 18.3,
    typeDurationSec: 1.85,
    fadeStartSec: 21.4,
    fadeDurationSec: 0.6,
    variant: "melted",
    fontSize: 92,
  },
  {
    id: "l6",
    lines: ["la, la,", "la, la,", "la"],
    startSec: 22.8,
    typeDurationSec: 1.75,
    fadeStartSec: 25.9,
    fadeDurationSec: 0.55,
    variant: "mono",
    fontSize: 92,
  },
  {
    id: "l7",
    lines: ["la, la,", "la, la,", "la..."],
    startSec: 27.3,
    typeDurationSec: 1.8,
    fadeStartSec: 30.1,
    fadeDurationSec: 0.85,
    variant: "typewriter",
    fontSize: 96,
  },
];

function getVariantStyle(variant: FontVariant): React.CSSProperties {
  switch (variant) {
    case "serif":
      return {
        fontFamily: '"EB Garamond", Georgia, "Times New Roman", serif',
        fontWeight: 400,
        letterSpacing: "-0.015em",
        lineHeight: 1.06,
      };
    case "typewriter":
      return {
        fontFamily: '"Special Elite", "Courier New", monospace',
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: 1.16,
      };
    case "melted":
      return {
        fontFamily: '"EB Garamond", Georgia, serif',
        fontWeight: 500,
        letterSpacing: "0.04em",
        lineHeight: 1.12,
      };
    case "underlined":
      return {
        fontFamily: '"Inter", Arial, Helvetica, sans-serif',
        fontWeight: 500,
        letterSpacing: "-0.02em",
        lineHeight: 1.12,
      };
    case "mono":
      return {
        fontFamily: '"Courier Prime", "Courier New", monospace',
        fontWeight: 400,
        letterSpacing: "-0.01em",
        lineHeight: 1.14,
      };
  }
}

const FPS = 60;

const LyricPhraseLayer: React.FC<{
  block: LyricBlock;
  frame: number;
}> = ({ block, frame }) => {
  const startFrame = Math.round(block.startSec * FPS);
  const typeFrames = Math.max(1, Math.round(block.typeDurationSec * FPS));
  const fadeStartFrame = Math.round(block.fadeStartSec * FPS);
  const fadeFrames = Math.max(1, Math.round(block.fadeDurationSec * FPS));
  const endFrame = fadeStartFrame + fadeFrames;

  if (frame < startFrame || frame > endFrame + 2) {
    return null;
  }

  // Ghost cross-dissolve halus di belakang baris baru (ciri khas video 15 detik)
  const exitProgress = interpolate(
    frame,
    [fadeStartFrame, endFrame],
    [0, 1],
    { ...CLAMP, easing: Easing.out(Easing.cubic) }
  );
  const blockOpacity = 1 - exitProgress;
  const exitBlur = exitProgress * 4.5;

  // Gerakan analog mikro deterministik
  const driftX = Math.sin(frame * 0.09 + startFrame) * 1.1;
  const driftY = Math.cos(frame * 0.07 + startFrame) * 1.1;

  const totalChars = block.lines.reduce((acc, line) => acc + line.length, 0);
  const framesPerChar = typeFrames / Math.max(1, totalChars);

  const fontSize = block.fontSize ?? 96;
  const variantStyle = getVariantStyle(block.variant);

  const rgbShadow = ENABLE_RGB_ABERRATION
    ? "-2.6px 0px 1.2px rgba(255, 86, 64, 0.58), 2.6px 0px 1.2px rgba(78, 178, 255, 0.58), 0px 0px 14px rgba(255, 255, 255, 0.28)"
    : "0px 0px 12px rgba(255, 255, 255, 0.22)";

  let globalCharIndex = 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "26%",
        top: "50%",
        transform: `translate3d(${driftX}px, calc(-50% + ${driftY}px), 0)`,
        opacity: blockOpacity,
        filter:
          block.variant === "melted"
            ? `url(#analog-melt) blur(${exitBlur.toFixed(2)}px)`
            : exitBlur > 0.05
            ? `blur(${exitBlur.toFixed(2)}px)`
            : "none",
        color: "#FFFFFF",
        fontSize,
        textAlign: "left",
        whiteSpace: "pre",
        textShadow: rgbShadow,
        ...variantStyle,
      }}
    >
      {block.lines.map((line, lineIdx) => {
        const chars = line.split("");
        return (
          <div key={`${block.id}-line-${lineIdx}`} style={{ display: "block" }}>
            {chars.map((ch, charIdx) => {
              const idx = globalCharIndex;
              globalCharIndex += 1;
              const charAppearFrame = startFrame + idx * framesPerChar;
              const charProg = interpolate(
                frame,
                [charAppearFrame, charAppearFrame + 7],
                [0, 1],
                CLAMP
              );
              const charBlur = interpolate(charProg, [0, 1], [5, 0], CLAMP);
              const charY = interpolate(charProg, [0, 1], [3, 0], CLAMP);

              const showUnderline =
                block.variant === "underlined" && lineIdx === 0 && charIdx < 2;

              return (
                <span
                  key={`${block.id}-${lineIdx}-${charIdx}`}
                  style={{
                    display: "inline-block",
                    opacity: charProg,
                    transform: `translateY(${charY}px)`,
                    filter:
                      charBlur > 0.1 ? `blur(${charBlur.toFixed(2)}px)` : "none",
                    borderBottom: showUnderline ? "4px solid #FFFFFF" : "none",
                    paddingBottom: showUnderline ? "2px" : "0px",
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const LyricVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadLyricFonts();
  }, []);

  const meltScale = 3.2 + Math.sin(frame * 0.12) * 0.9;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Filter SVG efek teks meleleh tipis untuk frasa klimaks */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="analog-melt" x="-15%" y="-15%" width="130%" height="145%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03 0.14"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={meltScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {LYRIC_BLOCKS.map((block) => (
        <LyricPhraseLayer key={block.id} block={block} frame={frame} />
      ))}
    </AbsoluteFill>
  );
};
