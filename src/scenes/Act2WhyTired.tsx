import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STUCK_BARS } from "../data/storyData";
import {
  AE_DRAMA_IN,
  AE_SMOOTH_LAND,
  AE_WHIP,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_FLUID,
} from "../theme";
import {
  CameraRig,
  MaskRevealLine,
  SubtleAmbientLight,
} from "../components/MotionPrimitives";

export const Act2WhyTired: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // AE Whip-Pan entrance from right (matches Act 1 whip exit seamlessly!)
  const whipIn = interpolate(frame, [0, 32], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const enterX = interpolate(whipIn, [0, 1], [1150, 0], CLAMP);
  const enterRot = interpolate(whipIn, [0, 0.5, 1], [3.2, 1.4, 0], CLAMP);
  const enterBlur = interpolate(whipIn, [0, 0.35, 0.75, 1], [24, 14, 0, 0], CLAMP);

  // Subtle 3D camera shift while bars animate (never static!)
  const camDolly = interpolate(frame, [32, 360], [1.0, 1.07], { ...CLAMP, easing: AE_SMOOTH_LAND });
  const camTiltY = interpolate(frame, [32, 360], [-2.5, 2.5], CLAMP);

  // Morning Iris Aperture Transition out to Act 3 (f368..405)
  const irisOut = interpolate(frame, [368, 404], [0, 1], { ...CLAMP, easing: AE_DRAMA_IN });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.NIGHT, overflow: "hidden" }}>
      <SubtleAmbientLight dark />

      <CameraRig
        x={enterX}
        scale={camDolly}
        rotateZ={enterRot}
        rotateY={camTiltY}
        blurX={enterBlur}
        filterId="act2-blur"
      >
        <AbsoluteFill
          style={{
            padding: "0 140px",
            justifyContent: "center",
            gap: 54,
            zIndex: 20,
          }}
        >
          {/* Clear, Relatable Explanation (ZERO textbook jargon!) */}
          <div style={{ maxWidth: 1380 }}>
            <MaskRevealLine startFrame={16} duration={28}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: COLORS.LEAF,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                KENAPA BISA BEGITU?
              </div>
            </MaskRevealLine>

            <MaskRevealLine startFrame={26} duration={32}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 78,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  color: COLORS.WHITE,
                }}
              >
                Otak kita paling nggak suka
                <br />
                sama hal yang{" "}
                <span
                  style={{
                    fontFamily: FONTS.SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 92,
                    color: "#FBBF24",
                  }}
                >
                  nanggung.
                </span>
              </div>
            </MaskRevealLine>
          </div>

          {/* 3 Visual Proof Bars: keep trying to finish, getting stuck before 100% */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              width: "100%",
            }}
          >
            {STUCK_BARS.map((bar, idx) => {
              const cardIn = spring({
                frame: Math.max(0, frame - (74 + idx * 20)),
                fps,
                config: SPRING_FLUID,
              });
              // Bar climbs smoothly up to stuckPct, tries to nudge forward, then slips back slightly — visually showing frustration!
              const climb = interpolate(frame, [94 + idx * 20, 174 + idx * 20], [0, bar.stuckPct], {
                ...CLAMP,
                easing: AE_SMOOTH_LAND,
              });
              const slip =
                frame > 174 + idx * 20
                  ? Math.sin((frame - (174 + idx * 20)) * 0.14) * 4.5
                  : 0;
              const shownPct = Math.max(0, Math.min(92, climb + slip));

              return (
                <div
                  key={bar.label}
                  style={{
                    backgroundColor: COLORS.NIGHT_CARD,
                    borderRadius: 30,
                    padding: "32px 34px",
                    border: `1.5px solid ${COLORS.LINE_DARK}`,
                    opacity: cardIn,
                    transform: `translate3d(0, ${interpolate(cardIn, [0, 1], [48, 0], CLAMP)}px, 0)`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 700, color: COLORS.WHITE }}>
                      {bar.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 28,
                        fontWeight: 800,
                        color: bar.color,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {Math.round(shownPct)}%
                    </span>
                  </div>

                  <div
                    style={{
                      height: 14,
                      borderRadius: 999,
                      backgroundColor: "rgba(255, 255, 255, 0.10)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${shownPct}%`,
                        height: "100%",
                        borderRadius: 999,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>

                  <div style={{ fontFamily: FONTS.SANS, fontSize: 21, fontWeight: 500, color: COLORS.WHITE_MUTED }}>
                    Berjalan terus, tapi belum tuntas.
                  </div>
                </div>
              );
            })}
          </div>

          {/* Punchline Bridge */}
          <MaskRevealLine startFrame={224} duration={30}>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 34,
                fontWeight: 600,
                color: COLORS.WHITE_MUTED,
              }}
            >
              Selama masih ada yang setengah jalan,{" "}
              <span style={{ color: COLORS.WHITE, fontWeight: 800 }}>
                pikiranmu diam-diam terus mengingatkan.
              </span>
            </div>
          </MaskRevealLine>
        </AbsoluteFill>
      </CameraRig>

      {/* Morning Sunlight Iris Bloom expanding smoothly to reveal Act 3 (ZERO blank frames!) */}
      {irisOut > 0.005 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 2400,
            height: 2400,
            borderRadius: "50%",
            backgroundColor: COLORS.CREAM,
            transform: `translate(-50%, -50%) scale(${irisOut})`,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
