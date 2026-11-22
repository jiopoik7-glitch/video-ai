import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MEDIA_CONFIG } from "../data/pocData";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, SmoothCursor } from "../components/BotanicalUI";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0 - 142): Closing kalimat hangat untuk pemula
  const showQuote = frame <= 146;
  const quoteExit = interpolate(frame, [118, 144], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Phase B (134 - 220): Morphing Pill "Cek Keranjang Kuning ->"
  const pillIn = spring({ frame: Math.max(0, frame - 134), fps, config: SPRING_SNAPPY });
  const cursorOp = interpolate(frame, [148, 160, 186, 198], [0, 1, 1, 0], CLAMP);
  const cursorX = interpolate(frame, [148, 172], [790, 625], { ...CLAMP, easing: EASE_APPLE });
  const cursorY = interpolate(frame, [148, 172], [1160, 915], { ...CLAMP, easing: EASE_APPLE });
  const pillClicking = frame >= 172 && frame <= 182;
  const pillPress = interpolate(frame, [172, 177, 184], [1, 0.91, 1], CLAMP);
  const morph = interpolate(frame, [182, 206], [0, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const pillVanish = interpolate(frame, [202, 218], [1, 0], CLAMP);
  const pillWidth = interpolate(morph, [0, 1], [660, 112], CLAMP);

  // Phase C (212 - 330): Finale Lockup dengan Foto Produk + Presented by Seflorner
  const showFinale = frame >= 212;
  const finalePop = spring({ frame: Math.max(0, frame - 216), fps, config: SPRING_SILKY });
  const subFade = interpolate(frame, [242, 268], [0, 1], CLAMP);
  const drift = interpolate(frame, [212, 330], [0.985, 1.03], CLAMP);

  return (
    <AbsoluteFill>
      {showQuote && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 86px 140px 86px",
            opacity: 1 - quoteExit,
            transform: `scale(${1 + quoteExit * 0.05})`,
            filter: quoteExit > 0.02 ? `blur(${quoteExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <BlurWords
              start={4}
              stagger={7}
              fontSize={68}
              words={[
                { text: "Merawat" },
                { text: "tanaman" },
                { text: "buah" },
                { text: "tak" },
                { text: "perlu" },
                { text: "rumit." },
              ]}
            />
            <BlurWords
              start={38}
              stagger={6}
              fontSize={74}
              words={[
                { text: "Cukup" },
                { text: "nutrisi", accent: true, italic: true },
                { text: "yang" },
                { text: "tepat.", accent: true, italic: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      )}

      {frame >= 132 && pillVanish > 0.01 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 100 }}>
          <div
            style={{
              width: pillWidth,
              height: 112,
              borderRadius: 999,
              backgroundColor: COLORS.WHITE,
              border: `1.5px solid ${COLORS.BORDER}`,
              boxShadow: "0 28px 66px rgba(17, 26, 20, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: morph > 0.5 ? "center" : "space-between",
              padding: morph > 0.5 ? "0" : "0 16px 0 44px",
              opacity: pillIn * pillVanish,
              transform: `scale(${pillIn * pillPress * interpolate(pillVanish, [0, 1], [1.2, 1], CLAMP)})`,
              overflow: "hidden",
            }}
          >
            {morph < 0.45 && (
              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: COLORS.INK,
                  whiteSpace: "nowrap",
                  opacity: interpolate(morph, [0, 0.35], [1, 0], CLAMP),
                }}
              >
                Cek Keranjang Kuning
              </span>
            )}

            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: COLORS.EMERALD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 10px 24px rgba(21, 128, 61, 0.36)",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="#FFFFFF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={pillClicking} />
        </AbsoluteFill>
      )}

      {showFinale && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px 140px 80px",
            transform: `scale(${drift})`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              opacity: finalePop,
              transform: `translateY(${interpolate(finalePop, [0, 1], [38, 0], CLAMP)}px) scale(${interpolate(
                finalePop,
                [0, 1],
                [0.92, 1],
                CLAMP
              )})`,
            }}
          >
            {/* Bingkai Foto Produk Akhir */}
            <div
              style={{
                width: 480,
                height: 480,
                borderRadius: 42,
                overflow: "hidden",
                backgroundColor: COLORS.WHITE,
                border: `2px solid ${COLORS.BORDER_STRONG}`,
                boxShadow: "0 34px 80px rgba(17, 26, 20, 0.14)",
              }}
            >
              <Img
                src={staticFile(MEDIA_CONFIG.PHOTO_PAKET)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: COLORS.AMBER,
                  marginBottom: 10,
                }}
              >
                PAKET BERBUAH LEBAT · INFARM
              </div>

              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 82,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: COLORS.INK,
                  lineHeight: 1.04,
                }}
              >
                Seflorner<span style={{ color: COLORS.EMERALD }}>.</span>
              </div>

              <div
                style={{
                  opacity: subFade,
                  transform: `translateY(${interpolate(subFade, [0, 1], [12, 0], CLAMP)}px)`,
                  fontFamily: FONTS.SERIF,
                  fontStyle: "italic",
                  fontSize: 40,
                  color: COLORS.EMERALD,
                  marginTop: 12,
                }}
              >
                Klik keranjang kuning · Mulai panen sendiri
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
