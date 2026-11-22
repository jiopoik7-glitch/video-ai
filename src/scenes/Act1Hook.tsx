import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { UNFINISHED_CARDS } from "../data/storyData";
import {
  AE_SMOOTH_LAND,
  AE_WHIP,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_CRISP,
} from "../theme";
import {
  CameraRig,
  MaskRevealLine,
  StuckRingBadge,
  SubtleAmbientLight,
} from "../components/MotionPrimitives";

export const Act1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // AE Virtual Camera: gentle dolly-in (1.0 -> 1.04) across scene, then dramatic whip-zoom dive into dark Act 2!
  const dollyScale = interpolate(frame, [0, 320], [1.0, 1.05], { ...CLAMP, easing: AE_SMOOTH_LAND });
  const whipExit = interpolate(frame, [328, 362], [0, 1], { ...CLAMP, easing: AE_WHIP });

  const camX = interpolate(whipExit, [0, 1], [0, -1400], CLAMP);
  const camRotZ = interpolate(whipExit, [0, 0.5, 1], [0, -3.5, 0], CLAMP);
  const camScale = dollyScale + whipExit * 0.22;
  const blurX = interpolate(whipExit, [0, 0.45, 0.7, 1], [0, 26, 20, 0], CLAMP);

  // Giant subtle broken circle (76% incomplete) rotating restlessly in the background behind everything
  const ringRot = frame * 0.22;
  const r = 340;
  const circ = 2 * Math.PI * r;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.CREAM,
        overflow: "hidden",
        opacity: interpolate(whipExit, [0.72, 1], [1, 0], CLAMP),
      }}
    >
      <SubtleAmbientLight dark={false} />

      <CameraRig
        x={camX}
        scale={camScale}
        rotateZ={camRotZ}
        blurX={blurX}
        filterId="act1-blur"
      >
        {/* Background Motif: Giant Incomplete Circle (76% — never closes!) strictly behind text */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${ringRot}deg)`,
            opacity: 0.14,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <svg width="760" height="760" viewBox="0 0 760 760" fill="none">
            <circle
              cx="380"
              cy="380"
              r={r}
              stroke={COLORS.EMERALD}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * 0.24}
            />
          </svg>
        </div>

        {/* Main 2-Column Editorial Layout — 100% Inside Safe Margins, Crystal Clear Text */}
        <AbsoluteFill
          style={{
            padding: "0 130px",
            display: "grid",
            gridTemplateColumns: "1.12fr 0.88fr",
            alignItems: "center",
            gap: 80,
            zIndex: 20,
          }}
        >
          {/* Left: Relatable Hook Typography */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <MaskRevealLine startFrame={4} duration={26}>
              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: COLORS.EMERALD,
                  textTransform: "uppercase",
                }}
              >
                PERNAH NGERASAIN INI?
              </span>
            </MaskRevealLine>

            <MaskRevealLine startFrame={16} duration={30}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 82,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                  color: COLORS.INK,
                }}
              >
                Badan udah rebahan,
              </div>
            </MaskRevealLine>

            <MaskRevealLine startFrame={32} duration={30}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 82,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                  color: COLORS.INK,
                }}
              >
                tapi kepala masih{" "}
                <span
                  style={{
                    fontFamily: FONTS.SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 94,
                    color: COLORS.TOMATO,
                  }}
                >
                  capek.
                </span>
              </div>
            </MaskRevealLine>

            <MaskRevealLine startFrame={158} duration={30}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 30,
                  fontWeight: 500,
                  color: COLORS.INK_MUTED,
                  marginTop: 22,
                  lineHeight: 1.45,
                  maxWidth: 740,
                }}
              >
                Bukan karena kamu kurang tidur — tapi terlalu banyak hal kecil yang terasa belum selesai.
              </div>
            </MaskRevealLine>
          </div>

          {/* Right: 3 Everyday Unfinished Cards with Restless Stuck Rings */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {UNFINISHED_CARDS.map((card, idx) => {
              const pop = spring({
                frame: Math.max(0, frame - card.appearLocal),
                fps,
                config: SPRING_CRISP,
              });
              const floatY = Math.sin(frame * 0.05 + idx * 1.4) * 5;

              return (
                <div
                  key={card.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 28,
                    padding: "26px 32px",
                    border: `1.5px solid ${COLORS.LINE_LIGHT}`,
                    boxShadow: "0 20px 50px rgba(13, 25, 18, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    opacity: pop,
                    transform: `translate3d(${interpolate(pop, [0, 1], [140, 0], CLAMP)}px, ${floatY}px, 0) scale(${interpolate(
                      pop,
                      [0, 1],
                      [0.92, 1],
                      CLAMP
                    )})`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 28,
                        fontWeight: 800,
                        color: COLORS.INK,
                        lineHeight: 1.25,
                      }}
                    >
                      {card.title}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 21,
                        fontWeight: 600,
                        color: card.color,
                        marginTop: 6,
                      }}
                    >
                      {card.note}
                    </div>
                  </div>
                  <StuckRingBadge pct={card.pct} color={card.color} size={74} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
