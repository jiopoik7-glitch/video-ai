import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AE_LANDING,
  AE_SILKY_PAN,
  CLAMP,
  COLORS,
  FONTS,
  H,
  SPRING_VELVET,
} from "../theme";
import {
  BotanicalRingCrest,
  CameraRig,
  MaskRevealLine,
  ParallaxAtmosphere,
} from "../components/ArtPrimitives";

export const Act5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seamless Vertical Camera Tilt-Up paired 1:1 with Act 4 exit (f0..44) -> ZERO blank frames!
  const tiltIn = interpolate(frame, [0, 44], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const slideY = -(1 - tiltIn) * H;
  const blurY = interpolate(tiltIn, [0, 0.45, 0.55, 1], [0, 7, 7, 0], CLAMP);

  // Phase A (0..176): Warm Emotional Quote — ALREADY visible as screen tilts into morning daylight!
  const showQuote = frame < 182;
  const quoteOut = interpolate(frame, [146, 178], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });

  // Phase B (162..340): Optical-Center Original Botanical Crest + Seflorner.
  const showBrand = frame >= 160;
  const brandIn = spring({ frame: Math.max(0, frame - 166), fps, config: SPRING_VELVET });
  const crestDraw = interpolate(frame, [164, 224], [0, 1], { ...CLAMP, easing: AE_LANDING });
  const calmDolly = interpolate(frame, [44, 339], [0.99, 1.03], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.CREAM,
        overflow: "hidden",
        transform: `translate3d(0, ${slideY.toFixed(1)}px, 0)`,
      }}
    >
      <ParallaxAtmosphere dark={false} cameraOffsetY={-(1 - tiltIn) * 320} />

      <CameraRig
        scale={calmDolly}
        blurY={blurY}
        filterId="act5-tilt-blur"
      >
        {/* PHASE A: OPTICAL-CENTER EMOTIONAL QUOTE */}
        {showQuote && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: "0 170px 64px 170px",
              textAlign: "center",
              opacity: 1 - quoteOut,
              transform: `translate3d(0, ${-quoteOut * 56}px, 0)`,
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <MaskRevealLine startFrame={8} duration={28}>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 72,
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.12,
                    color: COLORS.INK,
                  }}
                >
                  Kadang, kepala cuma butuh satu hal kecil
                </div>
              </MaskRevealLine>

              <MaskRevealLine startFrame={24} duration={28}>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 72,
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.12,
                    color: COLORS.INK,
                  }}
                >
                  yang bisa tumbuh dan{" "}
                  <span
                    style={{
                      fontFamily: FONTS.SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: 88,
                      color: COLORS.EMERALD,
                    }}
                  >
                    selesai
                  </span>{" "}
                  di depan matamu.
                </div>
              </MaskRevealLine>
            </div>
          </AbsoluteFill>
        )}

        {/* PHASE B: OPTICAL-CENTER BOTANICAL CREST & SEFLORNER SIGNATURE */}
        {showBrand && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 56,
              zIndex: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
                opacity: brandIn,
                transform: `translate3d(0, ${interpolate(brandIn, [0, 1], [34, 0], CLAMP)}px, 0)`,
              }}
            >
              <BotanicalRingCrest
                size={164}
                progress={crestDraw}
                color={COLORS.EMERALD}
                accentColor={COLORS.LEAF}
              />

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 96,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.02,
                    color: COLORS.INK,
                  }}
                >
                  Seflorner<span style={{ color: COLORS.EMERALD }}>.</span>
                </div>

                <MaskRevealLine startFrame={198} duration={28}>
                  <div
                    style={{
                      fontFamily: FONTS.SERIF,
                      fontStyle: "italic",
                      fontSize: 44,
                      color: COLORS.EMERALD,
                      marginTop: 12,
                    }}
                  >
                    Mulai dari satu pot kecil hari ini.
                  </div>
                </MaskRevealLine>
              </div>
            </div>
          </AbsoluteFill>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
