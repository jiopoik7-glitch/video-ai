import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HUMAN_FEELINGS } from "../data/storyData";
import {
  AE_SMOOTH_LAND,
  AE_WHIP,
  CLAMP,
  COLORS,
  FONTS,
  SPRING_CRISP,
  SPRING_FLUID,
} from "../theme";
import {
  BotanicalRingCrest,
  CameraRig,
  MaskRevealLine,
  SubtleAmbientLight,
} from "../components/MotionPrimitives";

export const Act4Complete: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFade = interpolate(frame, [0, 22], [0, 1], CLAMP);

  // Circle climbs from 75% (the incomplete circle from Act 1!) and locks to 100% at f70 (global f1196)
  const circleProgress = interpolate(frame, [14, 72], [0.75, 1.0], {
    ...CLAMP,
    easing: AE_SMOOTH_LAND,
  });
  const pctShown = Math.round(circleProgress * 100);
  const lockRipple = interpolate(frame, [68, 118], [0, 1], { ...CLAMP, easing: AE_SMOOTH_LAND });
  const lockBounce = spring({ frame: Math.max(0, frame - 70), fps, config: SPRING_CRISP });

  // Camera smoothly pans left to make room for the 3 relatable human feelings on the right!
  const layoutShift = spring({ frame: Math.max(0, frame - 98), fps, config: SPRING_FLUID });
  const ringOffsetX = interpolate(layoutShift, [0, 1], [0, -430], CLAMP);
  const ringScale = interpolate(layoutShift, [0, 1], [1.12, 0.88], CLAMP);

  // Continuous gentle AE dolly + smooth glide upward into Act 5
  const exitUp = interpolate(frame, [344, 374], [0, 1], { ...CLAMP, easing: AE_WHIP });
  const blurY = interpolate(exitUp, [0, 0.45, 0.75, 1], [0, 18, 12, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.NIGHT,
        overflow: "hidden",
        opacity: enterFade * (1 - exitUp),
      }}
    >
      <SubtleAmbientLight dark />

      <CameraRig
        y={-exitUp * 640}
        scale={interpolate(frame, [0, 340], [1.04, 1.0], CLAMP)}
        blurY={blurY}
        filterId="act4-blur"
      >
        {/* Center -> Left: The Circle That Finally Becomes 100% Complete */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 20 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              transform: `translate3d(${ringOffsetX}px, 0, 0) scale(${ringScale})`,
            }}
          >
            {/* Radiant Completion Ripple Wave */}
            {lockRipple > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  top: 190,
                  left: "50%",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  border: `3px solid ${COLORS.LEAF}`,
                  transform: `translate(-50%, -50%) scale(${1 + lockRipple * 0.65})`,
                  opacity: (1 - lockRipple) * 0.7,
                  pointerEvents: "none",
                }}
              />
            )}

            <div
              style={{
                transform: `scale(${frame >= 70 ? interpolate(lockBounce, [0, 0.5, 1], [0.96, 1.04, 1], CLAMP) : 1})`,
              }}
            >
              <BotanicalRingCrest
                size={380}
                progress={circleProgress}
                color={COLORS.LEAF}
                accentColor="#86EFAC"
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 64,
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
                    fontSize: 74,
                    color: COLORS.LEAF,
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

        {/* Right Column: 3 Warm, Relatable Feelings (ZERO clinical jargon!) */}
        <div
          style={{
            position: "absolute",
            right: 130,
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
          <MaskRevealLine startFrame={102} duration={26}>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: COLORS.LEAF,
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
              config: SPRING_FLUID,
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
                  transform: `translate3d(${interpolate(p, [0, 1], [90, 0], CLAMP)}px, 0, 0)`,
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
                    lineHeight: 1.4,
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
