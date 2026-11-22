import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MEDIA_CONFIG } from "../data/videoData";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SAFE_ZONE, SPRING_SILKY, SPRING_TACTILE } from "../theme";
import {
  BlurWords,
  IosTouchPointer,
  LiquidGlassCard,
  StrawberryPotArtwork,
} from "../components/LiquidGlassUI";

export const Act5ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0 - 92): Kalimat penutup hangat + Tombol Pil Liquid Glass "Cek Keranjang Kuning ->"
  const showCta = frame <= 104;
  const pillIn = spring({ frame: Math.max(0, frame - 34), fps, config: SPRING_TACTILE });
  const pointerOp = interpolate(frame, [52, 64, 86, 98], [0, 1, 1, 0], CLAMP);
  const pointerX = interpolate(frame, [52, 74], [780, 620], { ...CLAMP, easing: EASE_APPLE });
  const pointerY = interpolate(frame, [52, 74], [1220, 1025], { ...CLAMP, easing: EASE_APPLE });
  const pressing = frame >= 74 && frame <= 84;
  const pressScale = interpolate(frame, [73, 78, 86], [1, 0.91, 1], CLAMP);
  const morph = interpolate(frame, [82, 102], [0, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const ctaFade = interpolate(frame, [90, 104], [1, 0], CLAMP);
  const pillW = interpolate(morph, [0, 1], [670, 114], CLAMP);

  // Phase B (96 - 205): Finale Showcase Card + Brand Lockup Seflorner.
  const showFinale = frame >= 94;
  const finalePop = spring({ frame: Math.max(0, frame - 98), fps, config: SPRING_SILKY });
  const drift = interpolate(frame, [94, 205], [0.99, 1.03], CLAMP);

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE.paddingTop,
        paddingBottom: SAFE_ZONE.paddingBottom,
        paddingLeft: SAFE_ZONE.paddingLeft,
        paddingRight: SAFE_ZONE.paddingRight,
      }}
    >
      {showCta && (
        <AbsoluteFill
          style={{
            paddingTop: SAFE_ZONE.paddingTop,
            paddingBottom: SAFE_ZONE.paddingBottom,
            paddingLeft: SAFE_ZONE.paddingLeft,
            paddingRight: SAFE_ZONE.paddingRight,
            justifyContent: "center",
            alignItems: "center",
            gap: 56,
            opacity: ctaFade,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <BlurWords
              start={2}
              stagger={6}
              fontSize={72}
              words={[
                { text: "Panen" },
                { text: "stroberi", berry: true },
                { text: "segar" },
                { text: "dari" },
                { text: "teras", emerald: true, italic: true },
                { text: "rumah.", emerald: true, italic: true },
              ]}
            />
          </div>

          {/* Morphing Liquid Glass CTA Pill */}
          <div
            style={{
              opacity: pillIn,
              transform: `scale(${pillIn * pressScale})`,
            }}
          >
            <LiquidGlassCard
              borderRadius={999}
              sheenStart={38}
              style={{
                width: pillW,
                height: 114,
                display: "flex",
                alignItems: "center",
                justifyContent: morph > 0.5 ? "center" : "space-between",
                padding: morph > 0.5 ? "0" : "0 16px 0 46px",
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
                  width: 82,
                  height: 82,
                  borderRadius: "50%",
                  backgroundColor: COLORS.BERRY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 10px 24px rgba(225, 29, 72, 0.35)",
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
            </LiquidGlassCard>
          </div>

          <IosTouchPointer x={pointerX} y={pointerY} opacity={pointerOp} pressing={pressing} />
        </AbsoluteFill>
      )}

      {showFinale && (
        <AbsoluteFill
          style={{
            paddingTop: SAFE_ZONE.paddingTop,
            paddingBottom: SAFE_ZONE.paddingBottom,
            paddingLeft: SAFE_ZONE.paddingLeft,
            paddingRight: SAFE_ZONE.paddingRight,
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${drift})`,
          }}
        >
          <div
            style={{
              width: "100%",
              opacity: finalePop,
              transform: `translateY(${interpolate(finalePop, [0, 1], [44, 0], CLAMP)}px) scale(${interpolate(
                finalePop,
                [0, 1],
                [0.92, 1],
                CLAMP
              )})`,
            }}
          >
            <LiquidGlassCard
              borderRadius={44}
              sheenStart={106}
              style={{
                padding: "42px 38px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 32,
                textAlign: "center",
              }}
            >
              {/* Foto Bibit / Pot Stroberi Finale */}
              <div
                style={{
                  width: 470,
                  height: 470,
                  borderRadius: 36,
                  overflow: "hidden",
                  border: "2px solid rgba(255, 255, 255, 0.92)",
                  background: "linear-gradient(160deg, #FFF1F2 0%, #ECFDF5 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 24px 56px rgba(17, 26, 20, 0.12)",
                }}
              >
                {MEDIA_CONFIG.ENABLE_PRODUCT_PHOTO ? (
                  <Img
                    src={staticFile(MEDIA_CONFIG.PHOTO_SECONDARY)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <StrawberryPotArtwork progress={1} size={420} />
                )}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    color: COLORS.BERRY,
                    marginBottom: 10,
                  }}
                >
                  BIBIT STROBERI DATARAN RENDAH
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 84,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: COLORS.INK,
                    lineHeight: 1.02,
                  }}
                >
                  Seflorner<span style={{ color: COLORS.EMERALD }}>.</span>
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SERIF,
                    fontStyle: "italic",
                    fontSize: 40,
                    color: COLORS.EMERALD,
                    marginTop: 12,
                  }}
                >
                  Cek keranjang kuning sekarang, ya.
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
