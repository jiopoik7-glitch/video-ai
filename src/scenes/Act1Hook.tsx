import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { UNFINISHED_CARDS } from "../data/storyData";
import {
  AE_LANDING,
  AE_SILKY_PAN,
  ART_GRID,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_TACTILE,
  W,
} from "../theme";
import {
  CameraRig,
  MaskRevealLine,
  ParallaxAtmosphere,
  StuckRingBadge,
} from "../components/ArtPrimitives";

export const Act1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Silky dolly-in (1.0 -> 1.035), then continuous horizontal camera pan-wipe out to left (-W) synced 1:1 with Act 2!
  const dolly = interpolate(frame, [0, 324], [1.0, 1.035], { ...CLAMP, easing: AE_LANDING });
  const panOut = interpolate(frame, [324, 360], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const slideX = -panOut * W;
  const panBlur = interpolate(panOut, [0, 0.45, 0.55, 1], [0, 7, 7, 0], CLAMP);

  // Hero Motif: Giant Broken Circle (76%) anchored softly at screen center
  const ringRot = frame * 0.20;
  const r = 340;
  const circ = 2 * Math.PI * r;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.CREAM,
        overflow: "hidden",
        transform: `translate3d(${slideX.toFixed(1)}px, 0, 0)`,
      }}
    >
      <ParallaxAtmosphere dark={false} cameraOffsetX={panOut * 500} />

      <CameraRig
        scale={dolly}
        blurX={panBlur}
        filterId="act1-pan-blur"
      >
        {/* Hero Motif Background Anchor (zIndex 1, soft opacity) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${ringRot}deg)`,
            opacity: 0.13,
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

        {/* Golden Ratio 2-Column Composition */}
        <AbsoluteFill
          style={{
            padding: `0 ${ART_GRID.marginX}px`,
            display: "grid",
            gridTemplateColumns: "1.12fr 0.88fr",
            alignItems: "center",
            gap: 80,
            zIndex: 20,
          }}
        >
          {/* Left Focal Point: Relatable Hook */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <MaskRevealLine startFrame={2} duration={26}>
              <span
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 23,
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  color: COLORS.EMERALD,
                  textTransform: "uppercase",
                }}
              >
                PERNAH NGERASAIN INI?
              </span>
            </MaskRevealLine>

            <MaskRevealLine startFrame={12} duration={30}>
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

            <MaskRevealLine startFrame={28} duration={30}>
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

            <MaskRevealLine startFrame={150} duration={30}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 30,
                  fontWeight: 500,
                  color: COLORS.INK_MUTED,
                  marginTop: 22,
                  lineHeight: 1.46,
                  maxWidth: 740,
                }}
              >
                Bukan karena kurang tidur — tapi terlalu banyak hal kecil yang terasa belum selesai.
              </div>
            </MaskRevealLine>
          </div>

          {/* Right Counter-Weight: 3 Unfinished Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {UNFINISHED_CARDS.map((card, idx) => {
              const pop = spring({
                frame: Math.max(0, frame - card.appearLocal),
                fps,
                config: SPRING_TACTILE,
              });
              const floatY = Math.sin(frame * 0.048 + idx * 1.4) * 4.5;

              return (
                <div
                  key={card.id}
                  style={{
                    backgroundColor: COLORS.CREAM_CARD,
                    borderRadius: 28,
                    padding: "26px 32px",
                    border: `1.5px solid ${COLORS.LINE_LIGHT}`,
                    boxShadow: "0 20px 50px rgba(12, 24, 17, 0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    opacity: pop,
                    transform: `translate3d(${interpolate(pop, [0, 1], [110, 0], CLAMP)}px, ${floatY}px, 0)`,
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
