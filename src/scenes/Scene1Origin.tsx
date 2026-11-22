import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, SeflornerLeafEmblem } from "../components/BotanicalPrimitives";

export const Scene1Origin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bagian A (0 - 165): Hook Blur-In "Berawal dari satu sudut kebun kecil..."
  const showPartA = frame <= 168;
  const partAExit = interpolate(frame, [132, 165], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Bagian B (156 - 330): Titik hitam -> Mekar jadi Emblem Daun + "Kenalin, Seflorner" (Sejak 2024)
  const showPartB = frame >= 154;
  const dotPop = spring({ frame: Math.max(0, frame - 158), fps, config: SPRING_SNAPPY });
  const emblemMorph = spring({ frame: Math.max(0, frame - 178), fps, config: SPRING_SILKY });
  const textSpread = spring({ frame: Math.max(0, frame - 186), fps, config: SPRING_SILKY });
  const badgeUp = spring({ frame: Math.max(0, frame - 216), fps, config: SPRING_SILKY });
  const partBExit = interpolate(frame, [298, 330], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const dotScale = interpolate(emblemMorph, [0, 0.35], [1, 0], CLAMP) * dotPop;

  return (
    <AbsoluteFill>
      {/* PART A: HOOK */}
      {showPartA && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 180px",
            opacity: 1 - partAExit,
            transform: `scale(${1 + partAExit * 0.06})`,
            filter: partAExit > 0.02 ? `blur(${partAExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div
              style={{
                opacity: interpolate(frame, [4, 24], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [4, 24], [14, 0], CLAMP)}px)`,
                fontFamily: FONTS.MONO,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: COLORS.EMERALD,
                backgroundColor: COLORS.SAGE_SOFT,
                border: `1px solid ${COLORS.BORDER_STRONG}`,
                padding: "9px 22px",
                borderRadius: 999,
              }}
            >
              EST. 2024 · SEBUAH PERJALANAN
            </div>

            <BlurWords
              start={14}
              stagger={8}
              fontSize={76}
              words={[
                { text: "Berawal" },
                { text: "dari" },
                { text: "satu" },
                { text: "sudut" },
                { text: "kebun" },
                { text: "kecil.", accent: true, italic: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* PART B: KENALIN SEFLORNER (DNA Transisi Titik -> Emblem Orisinal) */}
      {showPartB && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - partBExit,
            transform: `scale(${1 + partBExit * 0.06})`,
            filter: partBExit > 0.02 ? `blur(${partBExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 82,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: COLORS.INK,
                  opacity: interpolate(frame, [160, 182], [0, 1], CLAMP),
                  transform: `translateX(${interpolate(textSpread, [0, 1], [36, 0], CLAMP)}px)`,
                }}
              >
                Kenalin,
              </span>

              <div
                style={{
                  position: "relative",
                  width: 112,
                  height: 112,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Titik awal yang mengecil saat daun mekar */}
                {dotScale > 0.01 && (
                  <div
                    style={{
                      position: "absolute",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: COLORS.INK,
                      transform: `scale(${dotScale})`,
                    }}
                  />
                )}
                {/* Emblem Daun Berlapis Seflorner */}
                <div
                  style={{
                    transform: `scale(${emblemMorph}) rotate(${interpolate(emblemMorph, [0, 1], [-18, 0], CLAMP)}deg)`,
                    opacity: emblemMorph,
                  }}
                >
                  <SeflornerLeafEmblem size={108} />
                </div>
              </div>

              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 86,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: COLORS.EMERALD,
                  opacity: textSpread,
                  transform: `translateX(${interpolate(textSpread, [0, 1], [-46, 0], CLAMP)}px)`,
                }}
              >
                Seflorner
              </span>
            </div>

            <div
              style={{
                opacity: badgeUp,
                transform: `translateY(${interpolate(badgeUp, [0, 1], [22, 0], CLAMP)}px)`,
                fontFamily: FONTS.SANS,
                fontSize: 28,
                fontWeight: 500,
                color: COLORS.MUTED,
                letterSpacing: "-0.01em",
              }}
            >
              Konten kreator berkebun · Muncul sejak <strong style={{ color: COLORS.INK }}>2024</strong>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
