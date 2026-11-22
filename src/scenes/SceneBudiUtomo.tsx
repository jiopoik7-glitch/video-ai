import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BUDI_UTOMO_DATA, ORG_SUB_TIMING } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_EDITORIAL,
  Z_INDEX,
} from "../theme";
import {
  IconSparkCheck,
  IconStoviaBuilding,
} from "../components/HistoricalIcons";
import {
  CardStagger,
  LivingParallax,
  MaskedReveal,
  RollingYear,
  SafeSceneContainer,
  SceneTransitionWrapper,
  StabiloHighlight,
  TimelineNodeDot,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SubTitlePunch: React.FC = () => {
  const frame = useCurrentFrame();
  const archLine = interpolate(frame, [0, 48], [0, 1], CLAMP);

  return (
    <SceneTransitionWrapper durationInFrames={120} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "center", position: "relative" }}>
        {/* Geometric Colonial STOVIA Architectural SVG Background Accent */}
        <svg
          width="680"
          height="420"
          viewBox="0 0 680 420"
          fill="none"
          style={{
            position: "absolute",
            right: 84,
            top: 160,
            opacity: 0.16 * archLine,
            pointerEvents: "none",
          }}
        >
          <path d="M40 160 L340 40 L640 160" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <line x1="70" y1="160" x2="610" y2="160" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <line x1="120" y1="160" x2="120" y2="360" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <line x1="220" y1="160" x2="220" y2="360" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <line x1="460" y1="160" x2="460" y2="360" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <line x1="560" y1="160" x2="560" y2="360" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          <path d="M295 360 V255 C295 230 315 210 340 210 C365 210 385 230 385 255 V360" stroke={COLORS.LIME} strokeWidth="2" />
          <line x1="40" y1="360" x2="640" y2="360" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 36, zIndex: 2 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 22,
              border: BORDERS.DARK,
              backgroundColor: COLORS.DARK_SURFACE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconStoviaBuilding size={64} color={COLORS.LIME} />
          </div>
          <RollingYear year={BUDI_UTOMO_DATA.year} delay={8} fontSize={148} color={COLORS.LIME} />
        </div>

        <MaskedReveal delay={24} style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: FONTS.SANS,
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: COLORS.DARK_TEXT,
              lineHeight: 1.08,
            }}
          >
            {BUDI_UTOMO_DATA.numberTitle}
          </div>
        </MaskedReveal>

        <MaskedReveal delay={38} style={{ marginTop: 14 }}>
          <div
            style={{
              fontFamily: FONTS.SERIF,
              fontStyle: "italic",
              fontSize: 46,
              color: COLORS.DARK_MUTED,
            }}
          >
            {BUDI_UTOMO_DATA.subtitle}
          </div>
        </MaskedReveal>
      </SafeSceneContainer>
    </SceneTransitionWrapper>
  );
};

const SubLatarBelakang: React.FC = () => {
  const b = BUDI_UTOMO_DATA.background;

  return (
    <SceneTransitionWrapper durationInFrames={420} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={420}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 20 }}>
          {/* Section Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <MaskedReveal delay={4}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: COLORS.INK,
                }}
              >
                Latar Belakang & Kelahiran Budi Utomo
              </div>
            </MaskedReveal>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 16, color: COLORS.SLATE }}>
              {BUDI_UTOMO_DATA.sourceRef}
            </span>
          </div>

          {/* ARCHETYPE A: Asymmetric Bento Grid (Left 1.25fr tall card, Right stacked 2 cards) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.22fr 0.78fr",
              gap: 24,
              flex: 1,
            }}
          >
            {/* Left Large Card: Founders, Members & Flow Diagram */}
            <CardStagger
              index={0}
              baseDelay={14}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderRadius: 20,
                padding: "28px 32px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 16,
                    fontWeight: 700,
                    color: COLORS.CRIMSON,
                    letterSpacing: "0.08em",
                  }}
                >
                  {b.foundersTitle.toUpperCase()}
                </div>

                <div style={{ fontFamily: FONTS.SANS, fontSize: 23, lineHeight: 1.45, color: COLORS.INK }}>
                  <strong>Penggagas:</strong> {b.wahidinNote}
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 23, lineHeight: 1.45, color: COLORS.INK }}>
                  <strong>Pendiri Formal:</strong> {b.stoviaNote}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    lineHeight: 1.44,
                    color: COLORS.SLATE,
                    backgroundColor: COLORS.PAPER,
                    borderLeft: `4px solid ${COLORS.CRIMSON}`,
                    padding: "12px 16px",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  {b.membershipNote}
                </div>
              </div>

              {/* Horizontal Causal Relationship Diagram */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: BORDERS.LIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                {b.flowSteps.map((step, i) => (
                  <React.Fragment key={step}>
                    <div
                      style={{
                        backgroundColor: i === b.flowSteps.length - 1 ? COLORS.INK : COLORS.SAGE,
                        color: i === b.flowSteps.length - 1 ? COLORS.LIME : COLORS.INK,
                        fontFamily: FONTS.MONO,
                        fontSize: 15,
                        fontWeight: 700,
                        padding: "10px 14px",
                        borderRadius: 10,
                        textAlign: "center",
                        flex: 1,
                      }}
                    >
                      {step}
                    </div>
                    {i < b.flowSteps.length - 1 && (
                      <span style={{ fontFamily: FONTS.MONO, fontSize: 18, color: COLORS.CRIMSON, fontWeight: 700 }}>
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardStagger>

            {/* Right Column: Top Metadata Card + Bottom Social Condition Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Top Right: Date, Place & Nature */}
              <CardStagger
                index={1}
                baseDelay={28}
                style={{
                  backgroundColor: COLORS.SAGE,
                  border: BORDERS.LIGHT,
                  borderRadius: 20,
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON }}>
                    {b.metaTitle.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontFamily: FONTS.MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      backgroundColor: COLORS.INK,
                      color: COLORS.LIME,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {b.date} · {b.place}
                  </span>
                </div>
                {b.traits.map((tr) => (
                  <div
                    key={tr}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 600,
                      color: COLORS.INK,
                      lineHeight: 1.38,
                    }}
                  >
                    <IconSparkCheck size={22} color={COLORS.CRIMSON} />
                    <span>{tr}</span>
                  </div>
                ))}
              </CardStagger>

              {/* Bottom Right: Social Condition + Mini Diagram */}
              <CardStagger
                index={2}
                baseDelay={42}
                style={{
                  backgroundColor: COLORS.WHITE,
                  border: BORDERS.LIGHT,
                  borderRadius: 20,
                  padding: "24px 28px",
                  boxShadow: SHADOWS.CARD_LIGHT,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.SLATE,
                      marginBottom: 10,
                    }}
                  >
                    {b.socialTitle.toUpperCase()}
                  </div>
                  {b.socialPoints.map((sp) => (
                    <div
                      key={sp}
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 22,
                        lineHeight: 1.4,
                        color: COLORS.INK,
                        marginBottom: 8,
                      }}
                    >
                      • {sp}
                    </div>
                  ))}
                </div>

                {/* Mini-diagram: PENDIDIKAN -> KESADARAN -> ORGANISASI */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: COLORS.PAPER,
                    border: BORDERS.LIGHT,
                    borderRadius: 12,
                    padding: "10px 16px",
                  }}
                >
                  {b.miniFlow.map((mf, i) => (
                    <React.Fragment key={mf}>
                      <span
                        style={{
                          fontFamily: FONTS.MONO,
                          fontSize: 15,
                          fontWeight: 700,
                          color: i === 2 ? COLORS.CRIMSON : COLORS.INK,
                        }}
                      >
                        {mf}
                      </span>
                      {i < b.miniFlow.length - 1 && (
                        <span style={{ fontFamily: FONTS.MONO, color: COLORS.SLATE }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </CardStagger>
            </div>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubTujuanPerkembangan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = BUDI_UTOMO_DATA.goalsAndGrowth;

  const lineProg = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: SPRING_EDITORIAL,
  });

  return (
    <SceneTransitionWrapper durationInFrames={390} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={390}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 26 }}>
          {/* Top Tier: Sage Goals Card */}
          <CardStagger
            index={0}
            baseDelay={8}
            style={{
              backgroundColor: COLORS.SAGE,
              border: BORDERS.LIGHT,
              borderRadius: 20,
              padding: "28px 34px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 36,
                  fontWeight: 800,
                  color: COLORS.INK,
                }}
              >
                {g.goalTitle}
              </div>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.CRIMSON, fontWeight: 700 }}>
                KEMAJUAN HARMONIS JAWA–MADURA
              </span>
            </div>

            <div style={{ fontFamily: FONTS.SANS, fontSize: 23, color: COLORS.SLATE, lineHeight: 1.4 }}>
              {g.goalIntro}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {g.fields.map((field) => (
                <div
                  key={field}
                  style={{
                    backgroundColor: COLORS.WHITE,
                    border: BORDERS.LIGHT,
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.INK,
                  }}
                >
                  {field}
                </div>
              ))}
            </div>
          </CardStagger>

          {/* Bottom Tier: Horizontal 3-Milestone Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: COLORS.CRIMSON,
              }}
            >
              GARIS WAKTU PERKEMBANGAN BUDI UTOMO (1908–1935)
            </div>

            {/* Animated Horizontal Line + 3 Nodes */}
            <div style={{ position: "relative", paddingTop: 10 }}>
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 20,
                  right: 20,
                  height: 3,
                  backgroundColor: COLORS.INK,
                  transform: `scaleX(${lineProg})`,
                  transformOrigin: "left center",
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {g.timeline.map((item, idx) => (
                  <div key={item.period} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ paddingLeft: 12 }}>
                      <TimelineNodeDot delay={56 + idx * 14} color={COLORS.CRIMSON} />
                    </div>
                    <CardStagger
                      index={idx}
                      baseDelay={66}
                      staggerFrames={14}
                      style={{
                        backgroundColor: COLORS.WHITE,
                        border: BORDERS.LIGHT,
                        borderRadius: 16,
                        padding: "20px 24px",
                        boxShadow: SHADOWS.CARD_LIGHT,
                        minHeight: 200,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONTS.MONO,
                          fontSize: 16,
                          fontWeight: 700,
                          color: COLORS.CRIMSON,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {item.period}
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.SANS,
                          fontSize: 25,
                          fontWeight: 800,
                          color: COLORS.INK,
                          marginTop: 6,
                          marginBottom: 8,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.SANS,
                          fontSize: 22,
                          lineHeight: 1.4,
                          color: COLORS.SLATE,
                        }}
                      >
                        {item.desc}
                      </div>
                    </CardStagger>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubDampak: React.FC = () => {
  const imp = BUDI_UTOMO_DATA.impact;

  return (
    <SceneTransitionWrapper durationInFrames={270} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-block",
                backgroundColor: COLORS.LIME,
                color: COLORS.CHARCOAL,
                fontFamily: FONTS.MONO,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "7px 16px",
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              {imp.badge}
            </div>

            <MaskedReveal delay={12}>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.18,
                  color: COLORS.DARK_TEXT,
                  maxWidth: 1120,
                }}
              >
                {imp.climax}
              </div>
            </MaskedReveal>
          </div>

          {/* 20 MEI Visual Focus */}
          <div
            style={{
              backgroundColor: COLORS.DARK_SURFACE,
              border: BORDERS.DARK,
              borderRadius: 20,
              padding: "28px 36px",
              textAlign: "center",
              minWidth: 360,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 64,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <StabiloHighlight wordStartFrame={54} color={COLORS.LIME} textColor={COLORS.CHARCOAL}>
                {imp.focusDate}
              </StabiloHighlight>
            </div>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 22,
                lineHeight: 1.4,
                color: COLORS.DARK_MUTED,
                marginTop: 14,
              }}
            >
              {imp.focusNote}
            </div>
          </div>
        </div>

        {/* Three Impact Points */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {imp.points.map((pt, idx) => (
            <CardStagger
              key={pt}
              index={idx}
              baseDelay={36}
              staggerFrames={8}
              style={{
                backgroundColor: COLORS.DARK_SURFACE,
                border: BORDERS.DARK,
                borderTop: `4px solid ${COLORS.LIME}`,
                borderRadius: 16,
                padding: "26px 28px",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.LIME, marginBottom: 10 }}>
                0{idx + 1}
              </div>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 23,
                  fontWeight: 600,
                  lineHeight: 1.44,
                  color: COLORS.DARK_TEXT,
                }}
              >
                {pt}
              </div>
            </CardStagger>
          ))}
        </div>
      </SafeSceneContainer>
    </SceneTransitionWrapper>
  );
};

export const SceneBudiUtomo: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <Sequence from={ORG_SUB_TIMING.TITLE_PUNCH.from} durationInFrames={ORG_SUB_TIMING.TITLE_PUNCH.duration}>
        <SubTitlePunch />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.LATAR_BELAKANG.from} durationInFrames={ORG_SUB_TIMING.LATAR_BELAKANG.duration}>
        <SubLatarBelakang />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.from} durationInFrames={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.duration}>
        <SubTujuanPerkembangan />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.DAMPAK.from} durationInFrames={ORG_SUB_TIMING.DAMPAK.duration}>
        <SubDampak />
      </Sequence>
    </AbsoluteFill>
  );
};
