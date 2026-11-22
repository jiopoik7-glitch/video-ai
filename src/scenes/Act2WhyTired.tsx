import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STUCK_BARS } from "../data/storyData";
import {
  AE_LANDING,
  AE_SILKY_PAN,
  ART_GRID,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_VELVET,
  W,
} from "../theme";
import {
  CameraRig,
  MaskRevealLine,
  ParallaxAtmosphere,
} from "../components/ArtPrimitives";

export const Act2WhyTired: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seamless physical Pan-Wipe entrance paired 1:1 with Act 1 exit (f0..36) -> ZERO blank frames!
  const panIn = interpolate(frame, [0, 36], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const slideX = (1 - panIn) * W;
  const enterBlur = interpolate(panIn, [0, 0.45, 0.55, 1], [0, 7, 7, 0], CLAMP);

  // Continuous silky dolly + gentle perspective turn throughout scene
  const camScale = interpolate(frame, [36, 420], [1.0, 1.05], { ...CLAMP, easing: AE_LANDING });
  const camRotY = interpolate(frame, [36, 420], [-2.2, 2.2], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.NIGHT,
        overflow: "hidden",
        transform: `translate3d(${slideX.toFixed(1)}px, 0, 0)`,
      }}
    >
      <ParallaxAtmosphere dark cameraOffsetX={(1 - panIn) * 400} />

      <CameraRig
        scale={camScale}
        rotateY={camRotY}
        blurX={enterBlur}
        filterId="act2-pan-blur"
      >
        <AbsoluteFill
          style={{
            padding: `0 ${ART_GRID.marginX}px`,
            justifyContent: "center",
            gap: 54,
            zIndex: 20,
          }}
        >
          {/* Editorial Focal Point */}
          <div style={{ maxWidth: 1380 }}>
            <MaskRevealLine startFrame={16} duration={26}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 23,
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  color: COLORS.MINT_BRIGHT,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                KENAPA BISA BEGITU?
              </div>
            </MaskRevealLine>

            <MaskRevealLine startFrame={26} duration={30}>
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
                    color: COLORS.AMBER_BRIGHT,
                  }}
                >
                  nanggung.
                </span>
              </div>
            </MaskRevealLine>
          </div>

          {/* 3 Stuck Progress Cards */}
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
                frame: Math.max(0, frame - (68 + idx * 20)),
                fps,
                config: SPRING_VELVET,
              });
              const climb = interpolate(frame, [88 + idx * 20, 168 + idx * 20], [0, bar.stuckPct], {
                ...CLAMP,
                easing: AE_LANDING,
              });
              const slip =
                frame > 168 + idx * 20
                  ? Math.sin((frame - (168 + idx * 20)) * 0.13) * 4.2
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
                    transform: `translate3d(0, ${interpolate(cardIn, [0, 1], [44, 0], CLAMP)}px, 0)`,
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

          {/* Relatable Emotional Bridge */}
          <MaskRevealLine startFrame={218} duration={30}>
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
    </AbsoluteFill>
  );
};
