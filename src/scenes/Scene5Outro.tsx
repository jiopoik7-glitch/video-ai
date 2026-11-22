import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, SeflornerLeafEmblem, SmoothCursor } from "../components/BotanicalPrimitives";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0 - 138): "Jangan selalu menunda." / "Let's start your own garden!"
  const showQuote = frame <= 146;
  const quoteExit = interpolate(frame, [118, 144], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Phase B (135 - 224): Morphing Pill Button "Start Your Garden ->" diklik lalu menciut jadi lingkaran
  const pillIn = spring({ frame: Math.max(0, frame - 134), fps, config: SPRING_SNAPPY });
  const cursorOp = interpolate(frame, [148, 160, 186, 198], [0, 1, 1, 0], CLAMP);
  const cursorX = interpolate(frame, [148, 172], [1220, 1080], { ...CLAMP, easing: EASE_APPLE });
  const cursorY = interpolate(frame, [148, 172], [710, 552], { ...CLAMP, easing: EASE_APPLE });
  const pillClicking = frame >= 172 && frame <= 182;
  const pillPress = interpolate(frame, [172, 177, 184], [1, 0.91, 1], CLAMP);
  const morph = interpolate(frame, [182, 206], [0, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const pillVanish = interpolate(frame, [202, 218], [1, 0], CLAMP);
  const pillWidth = interpolate(morph, [0, 1], [510, 96], CLAMP);

  // Phase C (214 - 330): "Presented by Seflorner." Finale Lockup
  const showFinale = frame >= 214;
  const finalePop = spring({ frame: Math.max(0, frame - 218), fps, config: SPRING_SILKY });
  const subFade = interpolate(frame, [242, 268], [0, 1], CLAMP);
  const slowDrift = interpolate(frame, [214, 330], [0.99, 1.025], CLAMP);

  return (
    <AbsoluteFill>
      {/* PHASE A: JANGAN SELALU MENUNDA, LET'S START YOUR OWN GARDEN! */}
      {showQuote && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 160px",
            opacity: 1 - quoteExit,
            transform: `scale(${1 + quoteExit * 0.05})`,
            filter: quoteExit > 0.02 ? `blur(${quoteExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <BlurWords
              start={4}
              stagger={7}
              fontSize={72}
              words={[
                { text: "Jangan" },
                { text: "selalu" },
                { text: "menunda." },
              ]}
            />
            <BlurWords
              start={34}
              stagger={6}
              fontSize={80}
              words={[
                { text: "Let's" },
                { text: "start" },
                { text: "your" },
                { text: "own", italic: true, accent: true },
                { text: "garden!", italic: true, accent: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE B: MORPHING CTA PILL (DNA Ikonik Referensi) */}
      {frame >= 132 && pillVanish > 0.01 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: pillWidth,
              height: 96,
              borderRadius: 999,
              backgroundColor: COLORS.WHITE,
              border: `1.5px solid ${COLORS.BORDER}`,
              boxShadow: "0 26px 64px rgba(17, 26, 20, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: morph > 0.5 ? "center" : "space-between",
              padding: morph > 0.5 ? "0" : "0 14px 0 42px",
              opacity: pillIn * pillVanish,
              transform: `scale(${pillIn * pillPress * interpolate(pillVanish, [0, 1], [1.2, 1], CLAMP)})`,
              overflow: "hidden",
            }}
          >
            {morph < 0.45 && (
              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: COLORS.INK,
                  whiteSpace: "nowrap",
                  opacity: interpolate(morph, [0, 0.35], [1, 0], CLAMP),
                }}
              >
                Start Your Garden
              </span>
            )}

            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                backgroundColor: COLORS.EMERALD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 10px 22px rgba(21, 128, 61, 0.35)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={pillClicking} />
        </AbsoluteFill>
      )}

      {/* PHASE C: PRESENTED BY SEFLORNER */}
      {showFinale && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${slowDrift})`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              opacity: finalePop,
              transform: `translateY(${interpolate(finalePop, [0, 1], [34, 0], CLAMP)}px) scale(${interpolate(
                finalePop,
                [0, 1],
                [0.92, 1],
                CLAMP
              )})`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: COLORS.SUBTLE,
              }}
            >
              PRESENTED BY
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <SeflornerLeafEmblem size={112} />
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 108,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: COLORS.INK,
                  lineHeight: 1,
                }}
              >
                Seflorner<span style={{ color: COLORS.EMERALD }}>.</span>
              </div>
            </div>

            <div
              style={{
                opacity: subFade,
                transform: `translateY(${interpolate(subFade, [0, 1], [12, 0], CLAMP)}px)`,
                fontFamily: FONTS.SERIF,
                fontStyle: "italic",
                fontSize: 38,
                color: COLORS.EMERALD,
                marginTop: 6,
              }}
            >
              Let&apos;s start your own garden · Since 2024
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
