import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT, TIMING } from "../data/videoData";
import {
  CLAMP,
  EASE_IOS,
  IOS_COLORS,
  IOS_FONT,
  LAYOUT,
  SPRING_IOS,
  SPRING_TACTILE,
} from "../theme";
import { GlassSurface, SfIcon, SfIconName } from "../components/LiquidGlassUI";

const STEP_ICONS: readonly SfIconName[] = ["sun", "drop", "scissors"];

export const Babak2InsetGuide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: SPRING_IOS,
  });

  const exit = interpolate(
    frame,
    [TIMING.guide.exitStart, TIMING.guide.exitEnd],
    [0, 1],
    { ...CLAMP, easing: EASE_IOS }
  );

  // Smooth horizontal iOS Navigation push-left exit into Babak 3
  const headerY = interpolate(enter, [0, 1], [60, 0], CLAMP);
  const slideX = interpolate(exit, [0, 1], [0, -180], CLAMP);
  const masterOpacity = interpolate(enter, [0, 0.35, 1], [0, 0.9, 1], CLAMP) * (1 - exit);

  const listY = interpolate(enter, [0, 1], [95, 0], CLAMP);

  return (
    <AbsoluteFill>
      {/* iOS Large Navigation Header (simetris 44px, Sentence/Title Case bersih) */}
      <div
        style={{
          position: "absolute",
          top: LAYOUT.topSafe,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
          opacity: masterOpacity,
          transform: `translate3d(${slideX}px, ${headerY}px, 0)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(48, 209, 88, 0.18)",
            border: "1px solid rgba(48, 209, 88, 0.38)",
            marginBottom: 18,
          }}
        >
          <SfIcon name="leaf" size={22} color={IOS_COLORS.iosGreen} />
          <span
            style={{
              fontFamily: IOS_FONT,
              fontSize: 28,
              fontWeight: 600,
              color: IOS_COLORS.iosGreen,
            }}
          >
            {CONTENT.guide.badge}
          </span>
        </div>

        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            color: IOS_COLORS.labelPrimary,
          }}
        >
          {CONTENT.guide.largeTitle}
        </div>

        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.35,
            color: IOS_COLORS.labelSecondary,
            marginTop: 14,
          }}
        >
          {CONTENT.guide.subtitle}
        </div>
      </div>

      {/* Single Authentic iOS Inset Grouped List (.regular Dark Liquid Glass, simetris 44px, hairline 1px dividers) */}
      <div
        style={{
          position: "absolute",
          top: 472,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
        }}
      >
        <GlassSurface
          variant="regular"
          borderRadius={38}
          sheenStartFrame={12}
          style={{
            padding: "10px 0",
            opacity: masterOpacity,
            transform: `translate3d(${slideX}px, ${listY}px, 0)`,
          }}
        >
          {CONTENT.guide.steps.map((step, idx) => {
            const rowIn = spring({
              frame: Math.max(0, frame - step.appearLocal),
              fps,
              config: SPRING_IOS,
            });
            const isChecked = frame >= step.checkLocal;
            const checkSpring = spring({
              frame: Math.max(0, frame - step.checkLocal),
              fps,
              config: SPRING_TACTILE,
            });
            const drawProg = interpolate(
              frame,
              [step.checkLocal, step.checkLocal + 14],
              [0, 1],
              CLAMP
            );
            const isLast = idx === CONTENT.guide.steps.length - 1;

            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "36px 34px",
                  borderBottom: isLast ? "none" : `1px solid ${IOS_COLORS.separator}`,
                  opacity: rowIn,
                  transform: `translate3d(0, ${interpolate(rowIn, [0, 1], [24, 0], CLAMP)}px, 0)`,
                }}
              >
                {/* Leading iOS Circular Check / Icon Badge */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: isChecked
                      ? IOS_COLORS.iosGreen
                      : "rgba(255, 255, 255, 0.10)",
                    border: isChecked
                      ? `2px solid ${IOS_COLORS.iosGreen}`
                      : "2px solid rgba(255, 255, 255, 0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: `scale(${
                      isChecked ? interpolate(checkSpring, [0, 1], [0.75, 1], CLAMP) : 1
                    })`,
                    boxShadow: isChecked
                      ? "0 8px 22px rgba(48, 209, 88, 0.36)"
                      : "none",
                  }}
                >
                  {isChecked ? (
                    <SfIcon name="check" size={34} color="#FFFFFF" drawProgress={drawProg} />
                  ) : (
                    <SfIcon name={STEP_ICONS[idx]} size={30} color="rgba(255,255,255,0.85)" />
                  )}
                </div>

                {/* Text Stack: Crisp Title + Concrete 1-line Description */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: IOS_FONT,
                      fontSize: 40,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: IOS_COLORS.labelPrimary,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontFamily: IOS_FONT,
                      fontSize: 31,
                      fontWeight: 400,
                      color: IOS_COLORS.labelSecondary,
                      lineHeight: 1.32,
                      marginTop: 8,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </GlassSurface>
      </div>
    </AbsoluteFill>
  );
};
