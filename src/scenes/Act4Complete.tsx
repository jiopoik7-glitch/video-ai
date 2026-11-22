import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HUMAN_FEELINGS } from "../data/storyData";
import {
  AE_LANDING,
  AE_PORTAL,
  AE_SILKY_PAN,
  ART_GRID,
  CLAMP,
  COLORS,
  FONTS,
  H,
  SPRING_TACTILE,
  SPRING_VELVET,
} from "../theme";
import {
  BotanicalRingCrest,
  CameraRig,
  MaskRevealLine,
  ParallaxAtmosphere,
} from "../components/ArtPrimitives";

export const Act4Complete: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seamless Circular Focus Portal opening cleanly ON TOP of Act 3 (f0..42) -> ZERO blank frames!
  const portal = interpolate(frame, [0, 42], [0, 1], { ...CLAMP, easing: AE_PORTAL });
  const portalPct = interpolate(portal, [0, 1], [0, 145], CLAMP);

  // Circle climbs from 76% (the broken circle from Act 1!) to 100% at f76 (global f1186)
  const circleProg = interpolate(frame, [16, 76], [0.76, 1.0], {
    ...CLAMP,
    easing: AE_LANDING,
  });
  const pctShown = Math.round(circleProg * 100);
  const lockRipple = interpolate(frame, [74, 126], [0, 1], { ...CLAMP, easing: AE_LANDING });
  const lockPop = spring({ frame: Math.max(0, frame - 76), fps, config: SPRING_TACTILE });

  // Smooth Rule-of-Thirds shift: Center (960) -> Left Third (520 -> offset -440px)
  const shift = spring({ frame: Math.max(0, frame - 102), fps, config: SPRING_VELVET });
  const ringOffsetX = interpolate(shift, [0, 1], [0, -440], CLAMP);
  const ringScale = interpolate(shift, [0, 1], [1.10, 0.90], CLAMP);

  // Seamless Vertical Camera Tilt-Up out paired 1:1 with Act 5 entrance (f350..394)
  const tiltOut = interpolate(frame, [350, 394], [0, 1], { ...CLAMP, easing: AE_SILKY_PAN });
  const slideY = tiltOut * H;
  const blurY = interpolate(tiltOut, [0, 0.45, 0.55, 1], [0, 7, 7, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.NIGHT,
        overflow: "hidden",
        clipPath: portal < 0.999 ? `circle(${portalPct.toFixed(1)}% at 50% 50%)` : "none",
        transform: `translate3d(0, ${slideY.toFixed(1)}px, 0)`,
      }}
    >
      <ParallaxAtmosphere dark cameraOffsetY={tiltOut * 300} />

      <CameraRig
        scale={interpolate(frame, [0, 350], [1.03, 1.0], CLAMP)}
        blurY={blurY}
        filterId="act4-tilt-blur"
      >
        {/* Hero Focal Point: The Circle That Finally Closes 100% Utuh (High Contrast Always!) */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 20 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              transform: `translate3d(${ringOffsetX.toFixed(1)}px, 0, 0) scale(${ringScale.toFixed(3)})`,
            }}
          >
            {lockRipple > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  top: 190,
                  left: "50%",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  border: `3px solid ${COLORS.MINT_BRIGHT}`,
                  transform: `translate(-50%, -50%) scale(${1 + lockRipple * 0.65})`,
                  opacity: (1 - lockRipple) * 0.68,
                  pointerEvents: "none",
                }}
              />
            )}

            <div
              style={{
                transform: `scale(${frame >= 76 ? interpolate(lockPop, [0, 0.5, 1], [0.96, 1.04, 1], CLAMP) : 1})`,
              }}
            >
              <BotanicalRingCrest
                size={380}
                progress={circleProg}
                color={COLORS.MINT_BRIGHT}
                accentColor="#86EFAC"
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 66,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: COLORS.WHITE,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pctShown}%{" "}
                <span
                  style={{
                    fontFamily: FONTS.SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 78,
                    color: COLORS.MINT_BRIGHT,
                  }}
                >
                  Utuh.
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 28,
                  fontWeight: 500,
                  color: COLORS.WHITE_MUTED,
                  marginTop: 8,
                }}
              >
                Satu siklus yang benar-benar selesai.
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* Right Rule-of-Thirds Stack: 3 Relatable Human Feelings */}
        <div
          style={{
            position: "absolute",
            right: ART_GRID.marginX,
            top: 0,
            bottom: 0,
            width: 820,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
            zIndex: 25,
          }}
        >
          <MaskRevealLine startFrame={106} duration={26}>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 23,
                fontWeight: 700,
                letterSpacing: "0.09em",
                color: COLORS.MINT_BRIGHT,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              APA YANG KAMU RASAKAN?
            </div>
          </MaskRevealLine>

          {HUMAN_FEELINGS.map((item) => {
            const p = spring({
              frame: Math.max(0, frame - item.appearLocal),
              fps,
              config: SPRING_VELVET,
            });
            return (
              <div
                key={item.title}
                style={{
                  backgroundColor: COLORS.NIGHT_CARD,
                  borderRadius: 28,
                  padding: "30px 36px",
                  border: `1.5px solid ${COLORS.LINE_DARK}`,
                  opacity: p,
                  transform: `translate3d(${interpolate(p, [0, 1], [84, 0], CLAMP)}px, 0, 0)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: COLORS.WHITE,
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 26,
                    fontWeight: 500,
                    color: COLORS.WHITE_MUTED,
                    marginTop: 8,
                    lineHeight: 1.42,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
