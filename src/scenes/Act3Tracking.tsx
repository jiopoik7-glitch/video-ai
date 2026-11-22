import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  JOURNEY_STATIONS,
  STATION_STRIDE,
  STATION_WIDTH,
} from "../data/storyData";
import {
  AE_LANDING,
  AE_PORTAL,
  AE_SILKY_PAN,
  CLAMP,
  COLORS,
  FONTS,
  W,
} from "../theme";
import {
  CameraRig,
  LivingBotanicalArt,
  ParallaxAtmosphere,
} from "../components/ArtPrimitives";

export const Act3Tracking: React.FC = () => {
  const frame = useCurrentFrame();

  // Seamless Morning Daylight Portal expanding directly ON TOP of Act 2 (f0..46) -> ZERO blank frames!
  const portal = interpolate(frame, [0, 46], [0, 1], { ...CLAMP, easing: AE_PORTAL });
  const portalPct = interpolate(portal, [0, 1], [0, 145], CLAMP);

  // Silky AE Camera Tracking across 4 stations spaced by 2160px (> 1920px viewport = ZERO overlap!)
  const p1 = interpolate(frame, [106, 154], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const p2 = interpolate(frame, [204, 252], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const p3 = interpolate(frame, [302, 350], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });

  const trackX =
    p1 * STATION_STRIDE +
    p2 * STATION_STRIDE +
    p3 * STATION_STRIDE;

  // Gentle sub-pixel directional blur during silky glides (max 6.5px — smooth, never harsh!)
  const glideBlur =
    interpolate(p1, [0, 0.45, 0.55, 1], [0, 6.5, 6.5, 0], CLAMP) +
    interpolate(p2, [0, 0.45, 0.55, 1], [0, 6.5, 6.5, 0], CLAMP) +
    interpolate(p3, [0, 0.45, 0.55, 1], [0, 6.5, 6.5, 0], CLAMP);

  // Subtle camera banking during pans
  const bankZ =
    interpolate(p1, [0, 0.5, 1], [0, -1.3, 0], CLAMP) +
    interpolate(p2, [0, 0.5, 1], [0, -1.3, 0], CLAMP) +
    interpolate(p3, [0, 0.5, 1], [0, -1.3, 0], CLAMP);

  // Continuous gentle zoom-in feel across the whole journey
  const journeyScale = interpolate(frame, [0, 440], [0.985, 1.02], CLAMP);

  // Continuous Organic Path spanning ALL 4 stations + extending cleanly past Station 4!
  const totalPathWidth = STATION_STRIDE * 4 + 800; // 9440px -> NEVER ends prematurely on screen!
  const leadX = 480 + trackX + interpolate(frame, [0, 400], [0, 480], { ...CLAMP, easing: AE_LANDING });
  const leadY = 110 + Math.sin((leadX / STATION_STRIDE) * Math.PI * 2) * 44;

  // Build smooth continuous wave SVG path across 9440px
  const wavePath = (() => {
    const pts: string[] = [];
    for (let x = 0; x <= totalPathWidth; x += 90) {
      const y = 110 + Math.sin((x / STATION_STRIDE) * Math.PI * 2) * 44;
      pts.push(x === 0 ? `M${x} ${y.toFixed(1)}` : `L${x} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  })();

  const activeIdx = frame < 130 ? 0 : frame < 228 ? 1 : frame < 326 ? 2 : 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.CREAM,
        overflow: "hidden",
        clipPath: portal < 0.999 ? `circle(${portalPct.toFixed(1)}% at 50% 50%)` : "none",
      }}
    >
      {/* Layer 0: Parallax Atmosphere moving at 0.14x camera speed */}
      <ParallaxAtmosphere dark={false} cameraOffsetX={trackX} />

      {/* Sticky Top Context Bar (Always balanced & clean) */}
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 136,
          right: 136,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.SANS,
            fontSize: 28,
            fontWeight: 800,
            color: COLORS.EMERALD,
            letterSpacing: "-0.01em",
          }}
        >
          Lalu, kenapa berkebun bikin tenang?
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === activeIdx ? 48 : 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: i === activeIdx ? COLORS.EMERALD : "rgba(12, 24, 17, 0.16)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Layer 1 & 2: Silky Virtual Tracking Camera */}
      <CameraRig
        scale={journeyScale}
        rotateZ={bankZ}
        blurX={glideBlur}
        filterId="act3-glide-blur"
      >
        {/* Midground Continuous Organic Guiding Wave + Glowing Leading Point (moves at 1.0x track) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: totalPathWidth,
            height: 1080,
            transform: `translate3d(${(-trackX).toFixed(1)}px, 0, 0)`,
            zIndex: 20,
          }}
        >
          <svg
            width={totalPathWidth}
            height="220"
            viewBox={`0 0 ${totalPathWidth} 220`}
            fill="none"
            style={{
              position: "absolute",
              left: 0,
              top: 760,
              pointerEvents: "none",
            }}
          >
            <path d={wavePath} stroke="rgba(21, 128, 61, 0.16)" strokeWidth="5" strokeLinecap="round" />
            <clipPath id="lead-progress-clip">
              <rect x="0" y="0" width={Math.max(0, leadX)} height="220" />
            </clipPath>
            <path
              d={wavePath}
              stroke={COLORS.EMERALD}
              strokeWidth="5.5"
              strokeLinecap="round"
              clipPath="url(#lead-progress-clip)"
            />
            {/* Glowing Leading Focal Point gliding continuously along the wave! */}
            <circle cx={leadX} cy={leadY} r="18" fill={COLORS.LEAF} opacity="0.24" />
            <circle cx={leadX} cy={leadY} r="8.5" fill={COLORS.EMERALD} />
          </svg>

          {/* 4 Mathematically Separated Botanical Stations (Centered in 1920px slice, 680px clean gap!) */}
          {JOURNEY_STATIONS.map((st, idx) => {
            const stationStart = idx === 0 ? 4 : 112 + (idx - 1) * 98;
            const artProg = interpolate(frame, [stationStart, stationStart + 62], [0, 1], {
              ...CLAMP,
              easing: AE_LANDING,
            });
            const marginInsideViewport = (W - STATION_WIDTH) / 2; // 220px symmetric margin!
            const leftPos = st.camX + marginInsideViewport;

            return (
              <div
                key={st.id}
                style={{
                  position: "absolute",
                  left: leftPos,
                  top: 236,
                  width: STATION_WIDTH,
                  display: "grid",
                  gridTemplateColumns: "420px 1fr",
                  alignItems: "center",
                  gap: 88,
                }}
              >
                {/* Left Optical Focal Card: Living Botanical Illustration */}
                <div
                  style={{
                    width: 420,
                    height: 420,
                    borderRadius: 48,
                    backgroundColor: COLORS.CREAM_CARD,
                    border: `1.5px solid ${COLORS.LINE_LIGHT}`,
                    boxShadow: "0 28px 72px rgba(12, 24, 17, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${interpolate(artProg, [0, 1], [0.93, 1], CLAMP)})`,
                  }}
                >
                  <LivingBotanicalArt kind={st.icon} enterProg={artProg} accent={st.accent} />
                </div>

                {/* Right Editorial Typography (Plenty of room, zero clipping!) */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div
                    style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "0.07em",
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
                      fontSize: 80,
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
                      lineHeight: 1.46,
                      color: COLORS.INK_MUTED,
                      maxWidth: 820,
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
