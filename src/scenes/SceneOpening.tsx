import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OPENING_DATA } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_EDITORIAL,
  Z_INDEX,
} from "../theme";
import {
  IconBookQuill,
  IconSparkCheck,
  IconTimelineArrow,
} from "../components/HistoricalIcons";
import {
  CardStagger,
  LivingParallax,
  MaskedReveal,
  SafeSceneContainer,
  SceneTransitionWrapper,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SubDefinisi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = OPENING_DATA.definition;

  const quoteProg = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: SPRING_EDITORIAL,
  });

  return (
    <SceneTransitionWrapper durationInFrames={300} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={300}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 24 }}>
          {/* Header */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: COLORS.CRIMSON,
                }}
              >
                {d.label}
              </span>
              <span
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 15,
                  color: COLORS.SLATE,
                }}
              >
                {d.sourceRef}
              </span>
            </div>

            <MaskedReveal delay={6}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: COLORS.INK,
                  lineHeight: 1.12,
                }}
              >
                {d.headline}
              </div>
            </MaskedReveal>
          </div>

          {/* Primary Definition Card */}
          <div
            style={{
              backgroundColor: COLORS.WHITE,
              border: BORDERS.LIGHT,
              borderLeft: `6px solid ${COLORS.CRIMSON}`,
              borderRadius: 18,
              padding: "30px 36px",
              boxShadow: SHADOWS.CARD_LIGHT,
              display: "flex",
              alignItems: "center",
              gap: 28,
              opacity: interpolate(quoteProg, [0, 0.4, 1], [0, 0.9, 1], CLAMP),
              transform: `translateY(${interpolate(quoteProg, [0, 1], [22, 0], CLAMP)}px)`,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: COLORS.SAGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconBookQuill size={42} color={COLORS.INK} />
            </div>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 25,
                fontWeight: 600,
                lineHeight: 1.48,
                color: COLORS.INK,
              }}
            >
              &ldquo;{d.quote}&rdquo;
            </div>
          </div>

          {/* Three Conceptual Pills */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 22,
            }}
          >
            {d.pills.map((pill, idx) => (
              <CardStagger
                key={pill.title}
                index={idx}
                baseDelay={44}
                staggerFrames={8}
                style={{
                  backgroundColor: COLORS.SAGE,
                  border: BORDERS.LIGHT,
                  borderRadius: 16,
                  padding: "24px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    backgroundColor: COLORS.INK,
                    color: COLORS.LIME,
                    fontFamily: FONTS.MONO,
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "5px 14px",
                    borderRadius: 999,
                  }}
                >
                  {pill.title}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 23,
                    fontWeight: 500,
                    lineHeight: 1.42,
                    color: COLORS.INK,
                  }}
                >
                  {pill.desc}
                </div>
              </CardStagger>
            ))}
          </div>

          {/* Bottom Strip: Role of Education, Press & Political Discussion */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              paddingTop: 6,
            }}
          >
            {d.pillars.map((item, idx) => (
              <CardStagger
                key={item.label}
                index={idx}
                baseDelay={90}
                staggerFrames={7}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: COLORS.WHITE,
                  border: BORDERS.LIGHT,
                  borderRadius: 12,
                  padding: "14px 20px",
                }}
              >
                <IconSparkCheck size={28} color={COLORS.CRIMSON} />
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.MONO,
                      fontSize: 14,
                      fontWeight: 700,
                      color: COLORS.CRIMSON,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 600,
                      color: COLORS.INK,
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </CardStagger>
            ))}
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubTransformasi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = OPENING_DATA.transformation;

  const arrowProg = spring({
    frame: Math.max(0, frame - 36),
    fps,
    config: SPRING_EDITORIAL,
  });

  const emphasisProg = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: SPRING_EDITORIAL,
  });

  return (
    <SceneTransitionWrapper durationInFrames={300} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={300}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 20 }}>
          {/* Header */}
          <div>
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: COLORS.CRIMSON,
                marginBottom: 8,
              }}
            >
              {t.label} {t.sourceRef}
            </div>
            <MaskedReveal delay={6}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 48,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: COLORS.INK,
                  lineHeight: 1.12,
                }}
              >
                {t.headline}
              </div>
            </MaskedReveal>
          </div>

          {/* Two-Column Comparison + Animated Center Bridge */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 250px 1fr",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* Left Column: Sebelum 1908 */}
            <CardStagger
              index={0}
              baseDelay={18}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderRadius: 18,
                padding: "26px 30px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.SLATE,
                  letterSpacing: "0.08em",
                  borderBottom: BORDERS.LIGHT,
                  paddingBottom: 12,
                }}
              >
                {t.beforeTitle}
              </div>
              {t.beforePoints.map((pt) => (
                <div
                  key={pt}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    lineHeight: 1.42,
                    color: COLORS.SLATE,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: COLORS.SLATE,
                      marginTop: 11,
                      flexShrink: 0,
                    }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </CardStagger>

            {/* Center Bridge: Animated Arrow & Catalyst Label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                opacity: arrowProg,
                transform: `scale(${interpolate(arrowProg, [0, 1], [0.85, 1], CLAMP)})`,
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: "50%",
                  backgroundColor: COLORS.LIME,
                  border: `2px solid ${COLORS.INK}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconTimelineArrow size={34} color={COLORS.INK} />
              </div>
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.INK,
                  textAlign: "center",
                  lineHeight: 1.5,
                  backgroundColor: COLORS.WHITE,
                  border: BORDERS.LIGHT,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                {t.bridgeLabel}
              </div>
            </div>

            {/* Right Column: Era Pergerakan Modern */}
            <CardStagger
              index={1}
              baseDelay={36}
              style={{
                backgroundColor: COLORS.SAGE,
                border: `1.5px solid ${COLORS.INK}`,
                borderRadius: 18,
                padding: "26px 30px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.CRIMSON,
                  letterSpacing: "0.08em",
                  borderBottom: BORDERS.LIGHT,
                  paddingBottom: 12,
                }}
              >
                {t.afterTitle}
              </div>
              {t.afterPoints.map((pt) => (
                <div
                  key={pt}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.42,
                    color: COLORS.INK,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: COLORS.CRIMSON,
                      marginTop: 11,
                      flexShrink: 0,
                    }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </CardStagger>
          </div>

          {/* Bottom Key Emphasis */}
          <div
            style={{
              backgroundColor: COLORS.INK,
              color: COLORS.DARK_TEXT,
              borderRadius: 14,
              padding: "18px 28px",
              fontFamily: FONTS.SANS,
              fontSize: 23,
              fontWeight: 600,
              lineHeight: 1.4,
              borderLeft: `6px solid ${COLORS.LIME}`,
              opacity: emphasisProg,
              transform: `translateY(${interpolate(emphasisProg, [0, 1], [16, 0], CLAMP)}px)`,
            }}
          >
            {t.emphasis}
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

export const SceneOpening: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <Sequence from={0} durationInFrames={300}>
        <SubDefinisi />
      </Sequence>
      <Sequence from={300} durationInFrames={300}>
        <SubTransformasi />
      </Sequence>
    </AbsoluteFill>
  );
};
