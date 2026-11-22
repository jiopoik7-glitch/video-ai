import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { INTRO_DATA, TIMELINE } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_EDITORIAL,
  Z_INDEX,
} from "../theme";
import { IconBookQuill } from "../components/HistoricalIcons";
import {
  CardStagger,
  LivingParallax,
  MaskedReveal,
  SafeSceneContainer,
  SceneTransitionWrapper,
  StabiloHighlight,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emblemScale = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING_EDITORIAL,
  });

  const pillOpacity = interpolate(frame, [28, 46], [0, 1], CLAMP);
  const pillY = interpolate(frame, [28, 46], [16, 0], CLAMP);
  const subtitleOpacity = interpolate(frame, [88, 114], [0, 1], CLAMP);
  const subtitleY = interpolate(frame, [88, 114], [14, 0], CLAMP);
  const lineExpand = interpolate(frame, [136, 166], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <SceneTransitionWrapper
        durationInFrames={TIMELINE.INTRO.duration}
        direction="horizontal"
        exitFrames={16}
      >
        <LivingParallax durationInFrames={TIMELINE.INTRO.duration}>
          <SafeSceneContainer style={{ justifyContent: "space-between" }}>
            {/* Top Editorial Emblem & Pill */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 14,
                    backgroundColor: COLORS.WHITE,
                    border: BORDERS.LIGHT,
                    boxShadow: SHADOWS.CARD_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${emblemScale})`,
                  }}
                >
                  <IconBookQuill size={34} color={COLORS.INK} />
                </div>

                <div
                  style={{
                    opacity: pillOpacity,
                    transform: `translateY(${pillY}px)`,
                    backgroundColor: COLORS.INK,
                    color: COLORS.DARK_TEXT,
                    padding: "10px 20px",
                    borderRadius: 999,
                    fontFamily: FONTS.MONO,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  {INTRO_DATA.pill}
                </div>
              </div>

              {/* Main Two-Line Display Headline */}
              <div style={{ marginTop: 10 }}>
                <MaskedReveal delay={34}>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 92,
                      fontWeight: 800,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.04,
                      color: COLORS.INK,
                    }}
                  >
                    {INTRO_DATA.headlineLine1}
                  </div>
                </MaskedReveal>

                <MaskedReveal delay={50} style={{ marginTop: 4 }}>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 92,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.08,
                      color: COLORS.INK,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 20,
                    }}
                  >
                    <span>{INTRO_DATA.headlineLine2Prefix}</span>
                    <StabiloHighlight
                      wordStartFrame={62}
                      color={COLORS.LIME}
                      textColor={COLORS.INK}
                      paddingHorizontal={16}
                    >
                      <span
                        style={{
                          fontFamily: FONTS.SERIF,
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: 102,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {INTRO_DATA.headlineLine2Highlight}
                      </span>
                    </StabiloHighlight>
                  </div>
                </MaskedReveal>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  opacity: subtitleOpacity,
                  transform: `translateY(${subtitleY}px)`,
                  fontFamily: FONTS.SANS,
                  fontSize: 27,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: COLORS.SLATE,
                  maxWidth: 960,
                }}
              >
                {INTRO_DATA.subtitle}
              </div>
            </div>

            {/* Editorial Divider & Four Academic Identity Cards (150-450) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  height: 1.5,
                  width: "100%",
                  backgroundColor: COLORS.BORDER_STRONG,
                  transform: `scaleX(${lineExpand})`,
                  transformOrigin: "left center",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  backgroundColor: COLORS.WHITE,
                  border: BORDERS.LIGHT,
                  borderRadius: 18,
                  boxShadow: SHADOWS.CARD_LIGHT,
                  overflow: "hidden",
                }}
              >
                {INTRO_DATA.identityCards.map((item, idx) => (
                  <CardStagger
                    key={item.label}
                    index={idx}
                    baseDelay={152}
                    staggerFrames={8}
                    style={{
                      padding: "28px 30px",
                      borderRight:
                        idx < INTRO_DATA.identityCards.length - 1
                          ? BORDERS.LIGHT
                          : "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONTS.MONO,
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: "0.09em",
                        color: COLORS.CRIMSON,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 28,
                        fontWeight: 700,
                        color: COLORS.INK,
                        lineHeight: 1.25,
                      }}
                    >
                      {item.value}
                    </div>
                  </CardStagger>
                ))}
              </div>
            </div>
          </SafeSceneContainer>
        </LivingParallax>
      </SceneTransitionWrapper>
    </AbsoluteFill>
  );
};
