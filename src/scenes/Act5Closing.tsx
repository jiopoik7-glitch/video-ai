import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AE_SMOOTH_LAND,
  AE_WHIP,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_FLUID,
} from "../theme";
import {
  BotanicalRingCrest,
  CameraRig,
  MaskRevealLine,
  SubtleAmbientLight,
} from "../components/MotionPrimitives";

export const Act5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Silky upward camera rise from Act 4
  const riseIn = interpolate(frame, [0, 34], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const enterY = interpolate(riseIn, [0, 1], [520, 0], CLAMP);
  const enterBlur = interpolate(riseIn, [0, 0.35, 0.75, 1], [16, 10, 0, 0], CLAMP);

  // Phase A (0..162): Warm Relatable Emotional Closing Quote
  const showQuote = frame < 170;
  const quoteOut = interpolate(frame, [138, 168], [0, 1], { ...CLAMP, easing: AE_WHIP });

  // Phase B (156..324): Refined Original Botanical Crest + Seflorner. Finale
  const showBrand = frame >= 154;
  const crestPop = spring({ frame: Math.max(0, frame - 160), fps, config: SPRING_FLUID });
  const crestDraw = interpolate(frame, [158, 214], [0, 1], { ...CLAMP, easing: AE_SMOOTH_LAND });
  const gentleDolly = interpolate(frame, [0, 323], [0.985, 1.03], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.CREAM, overflow: "hidden" }}>
      <SubtleAmbientLight dark={false} />

      <CameraRig
        y={enterY}
        scale={gentleDolly}
        blurY={enterBlur}
        filterId="act5-blur"
      >
        {/* PHASE A: RELATABLE EMOTIONAL CLOSING */}
        {showQuote && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: "0 170px",
              textAlign: "center",
              opacity: 1 - quoteOut,
              transform: `translate3d(0, ${-quoteOut * 70}px, 0)`,
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <MaskRevealLine startFrame={18} duration={30}>
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

              <MaskRevealLine startFrame={38} duration={30}>
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

        {/* PHASE B: ORIGINAL BOTANICAL CREST & SEFLORNER SIGNATURE */}
        {showBrand && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
                opacity: crestPop,
                transform: `translate3d(0, ${interpolate(crestPop, [0, 1], [40, 0], CLAMP)}px, 0)`,
              }}
            >
              <BotanicalRingCrest
                size={156}
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

                <MaskRevealLine startFrame={192} duration={28}>
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
