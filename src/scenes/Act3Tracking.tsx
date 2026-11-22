import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { JOURNEY_STATIONS } from "../data/storyData";
import {
  AE_SMOOTH_LAND,
  AE_WHIP,
  CLAMP,
  COLORS,
  FONTS,
} from "../theme";
import {
  CameraRig,
  MaskRevealLine,
  StageBotanicalArt,
  SubtleAmbientLight,
} from "../components/MotionPrimitives";

export const Act3Tracking: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth AE Camera Tracking along X across the 4 living stations (0 -> 1180 -> 2360 -> 3540)
  // Using fast-peak AE_WHIP between stations + gentle continuous drift during each station!
  const p1 = interpolate(frame, [96, 134], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const p2 = interpolate(frame, [192, 230], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const p3 = interpolate(frame, [288, 326], [0, 1], { ...CLAMP, easing: AE_WHIP });

  const trackX =
    p1 * 1180 +
    p2 * 1180 +
    p3 * 1180 +
    interpolate(frame, [0, 400], [0, 90], CLAMP); // continuous subtle forward camera glide!

  // Compute directional horizontal motion blur automatically during the 3 whip-pans!
  const speedBlur =
    interpolate(p1, [0, 0.45, 0.55, 1], [0, 18, 18, 0], CLAMP) +
    interpolate(p2, [0, 0.45, 0.55, 1], [0, 18, 18, 0], CLAMP) +
    interpolate(p3, [0, 0.45, 0.55, 1], [0, 18, 18, 0], CLAMP);

  // Dynamic camera banking tilt (leans subtly into each pan like a real AE 3D camera!)
  const bankRot =
    interpolate(p1, [0, 0.5, 1], [0, -2.4, 0], CLAMP) +
    interpolate(p2, [0, 0.5, 1], [0, -2.4, 0], CLAMP) +
    interpolate(p3, [0, 0.5, 1], [0, -2.4, 0], CLAMP);

  const zoomOutExit = interpolate(frame, [392, 424], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const enterOpacity = interpolate(frame, [0, 18], [0, 1], CLAMP);

  // Overall progress along the continuous botanical line connecting all 4 stages
  const lineDraw = interpolate(frame, [18, 365], [0.06, 1], { ...CLAMP, easing: AE_SMOOTH_LAND });
  const pathLen = 3800;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.CREAM,
        overflow: "hidden",
        opacity: enterOpacity * (1 - zoomOutExit),
      }}
    >
      <SubtleAmbientLight dark={false} />

      {/* Top Sticky Context Header (Always Clear, Never Moves Out of Frame) */}
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 120,
          right: 120,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        <MaskRevealLine startFrame={8} duration={26}>
          <span
            style={{
              fontFamily: FONTS.SANS,
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.EMERALD,
              letterSpacing: "-0.01em",
            }}
          >
            Lalu, kenapa berkebun bikin tenang?
          </span>
        </MaskRevealLine>

        {/* 4 Station Step Dots */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {[0, 1, 2, 3].map((i) => {
            const active =
              (i === 0 && frame < 115) ||
              (i === 1 && frame >= 115 && frame < 210) ||
              (i === 2 && frame >= 210 && frame < 306) ||
              (i === 3 && frame >= 306);
            return (
              <div
                key={i}
                style={{
                  width: active ? 46 : 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: active ? COLORS.EMERALD : "rgba(13, 25, 18, 0.16)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Virtual AE Tracking Camera Rig */}
      <CameraRig
        scale={1 + zoomOutExit * 0.25}
        rotateZ={bankRot}
        blurX={speedBlur}
        filterId="act3-track-blur"
      >
        {/* World Track Container translating opposite to camera trackX */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 5200,
            height: 1080,
            transform: `translate3d(${-trackX}px, 0, 0)`,
            zIndex: 20,
          }}
        >
          {/* Continuous Organic Wave Path Connecting All 4 Botanical Stations */}
          <svg
            width="4600"
            height="220"
            viewBox="0 0 4600 220"
            fill="none"
            style={{
              position: "absolute",
              left: 360,
              top: 730,
              pointerEvents: "none",
            }}
          >
            <path
              d="M0 110 C420 20, 760 200, 1180 110 C1600 20, 1940 200, 2360 110 C2780 20, 3120 200, 3540 110"
              stroke="rgba(21, 128, 61, 0.14)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M0 110 C420 20, 760 200, 1180 110 C1600 20, 1940 200, 2360 110 C2780 20, 3120 200, 3540 110"
              stroke={COLORS.EMERALD}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - lineDraw)}
            />
          </svg>

          {/* 4 Living Botanical Stations */}
          {JOURNEY_STATIONS.map((st, idx) => {
            const localEnter = idx === 0 ? 10 : 100 + (idx - 1) * 96;
            const artProg = interpolate(frame, [localEnter, localEnter + 70], [0, 1], {
              ...CLAMP,
              easing: AE_SMOOTH_LAND,
            });
            const centerScreenX = 240 + st.camX;

            return (
              <div
                key={st.id}
                style={{
                  position: "absolute",
                  left: centerScreenX,
                  top: 230,
                  width: 1440,
                  display: "grid",
                  gridTemplateColumns: "0.75fr 1.25fr",
                  alignItems: "center",
                  gap: 72,
                }}
              >
                {/* Left: Clean Animated Botanical Stage Artwork */}
                <div
                  style={{
                    width: 400,
                    height: 400,
                    borderRadius: 48,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${COLORS.LINE_LIGHT}`,
                    boxShadow: "0 28px 70px rgba(13, 25, 18, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${interpolate(artProg, [0, 1], [0.92, 1], CLAMP)})`,
                  }}
                >
                  <StageBotanicalArt kind={st.icon} progress={artProg} accent={st.accent} />
                </div>

                {/* Right: Crystal-Clear Relatable Explanation */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div
                    style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: st.accent,
                      backgroundColor: `${st.accent}18`,
                      padding: "10px 24px",
                      borderRadius: 999,
                      textTransform: "uppercase",
                    }}
                  >
                    {st.step}
                  </div>

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
                    {st.title}
                  </div>

                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 34,
                      fontWeight: 500,
                      lineHeight: 1.45,
                      color: COLORS.INK_MUTED,
                      maxWidth: 780,
                    }}
                  >
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
