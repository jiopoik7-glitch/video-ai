import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { INDISCHE_PARTIJ_DATA, ORG_SUB_TIMING } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  Z_INDEX,
} from "../theme";
import {
  IconNewspaperPress,
  IconUsersTrio,
} from "../components/HistoricalIcons";
import {
  CardStagger,
  LivingParallax,
  MaskedReveal,
  RollingYear,
  SafeSceneContainer,
  SceneTransitionWrapper,
  StabiloHighlight,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SubTitlePunch: React.FC = () => {
  return (
    <SceneTransitionWrapper durationInFrames={120} direction="horizontal" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
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
            <IconNewspaperPress size={64} color={COLORS.LIME} />
          </div>
          <RollingYear year={INDISCHE_PARTIJ_DATA.year} delay={8} fontSize={148} color={COLORS.LIME} />
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
            {INDISCHE_PARTIJ_DATA.numberTitle}
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
            {INDISCHE_PARTIJ_DATA.subtitle}
          </div>
        </MaskedReveal>
      </SafeSceneContainer>
    </SceneTransitionWrapper>
  );
};

const SubBroadsheetLatarBelakang: React.FC = () => {
  const d = INDISCHE_PARTIJ_DATA;
  const b = d.background;

  return (
    <SceneTransitionWrapper durationInFrames={420} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={420}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 18 }}>
          {/* Historical Newspaper Masthead */}
          <div
            style={{
              borderTop: `3px solid ${COLORS.INK}`,
              borderBottom: `3px double ${COLORS.INK}`,
              padding: "12px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON }}>
              {d.masthead.edition}
            </span>
            <span
              style={{
                fontFamily: FONTS.SERIF,
                fontStyle: "italic",
                fontSize: 42,
                color: COLORS.INK,
                letterSpacing: "0.02em",
              }}
            >
              {d.masthead.paperName}
            </span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.INK }}>
              {d.masthead.motto} {d.sourceRef}
            </span>
          </div>

          {/* Three-Column Newspaper Broadsheet */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              flex: 1,
              backgroundColor: COLORS.WHITE,
              border: BORDERS.LIGHT,
              padding: "26px 0",
            }}
          >
            {/* Column 1: Tiga Serangkai */}
            <CardStagger
              index={0}
              baseDelay={14}
              style={{
                padding: "0 28px",
                borderRight: BORDERS.LIGHT_STRONG,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <IconUsersTrio size={28} color={COLORS.CRIMSON} />
                  <span style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON }}>
                    KOLOM 01 · {b.trioTitle.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {b.trio.map((person) => (
                    <div
                      key={person.name}
                      style={{
                        borderBottom: BORDERS.LIGHT,
                        paddingBottom: 10,
                      }}
                    >
                      <div style={{ fontFamily: FONTS.SANS, fontSize: 24, fontWeight: 800, color: COLORS.INK }}>
                        {person.name}
                      </div>
                      <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 24, color: COLORS.SLATE }}>
                        {person.alias}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 22, lineHeight: 1.42, color: COLORS.SLATE, marginTop: 12 }}>
                {b.trioNote}
              </div>
            </CardStagger>

            {/* Column 2: Date, Place & Nature */}
            <CardStagger
              index={1}
              baseDelay={28}
              style={{
                padding: "0 28px",
                borderRight: BORDERS.LIGHT_STRONG,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 14 }}>
                  KOLOM 02 · {b.metaTitle.toUpperCase()}
                </div>
                <div
                  style={{
                    backgroundColor: COLORS.INK,
                    color: COLORS.LIME,
                    fontFamily: FONTS.MONO,
                    fontSize: 20,
                    fontWeight: 700,
                    padding: "10px 14px",
                    marginBottom: 14,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {b.date} · BANDUNG
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 22, lineHeight: 1.42, color: COLORS.SLATE, marginBottom: 18 }}>
                  {b.dateNote}
                </div>
                {b.traits.map((tr) => (
                  <div
                    key={tr}
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.42,
                      color: COLORS.INK,
                      marginBottom: 10,
                    }}
                  >
                    ▪ {tr}
                  </div>
                ))}
              </div>
            </CardStagger>

            {/* Column 3: Social Condition & Inclusive Nationalism Note */}
            <CardStagger
              index={2}
              baseDelay={42}
              style={{
                padding: "0 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 14 }}>
                  KOLOM 03 · {b.socialTitle.toUpperCase()}
                </div>
                {b.socialPoints.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      lineHeight: 1.44,
                      color: COLORS.INK,
                      marginBottom: 12,
                    }}
                  >
                    • {pt}
                  </div>
                ))}
              </div>

              <div
                style={{
                  backgroundColor: COLORS.PAPER,
                  borderTop: `3px solid ${COLORS.CRIMSON}`,
                  padding: "16px 18px",
                  fontFamily: FONTS.SANS,
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: COLORS.INK,
                }}
              >
                {b.inclusiveNote}
              </div>
            </CardStagger>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubBroadsheetTujuan: React.FC = () => {
  const g = INDISCHE_PARTIJ_DATA.goalsAndGrowth;

  return (
    <SceneTransitionWrapper durationInFrames={390} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={390}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 20 }}>
          {/* Centerpiece Broadsheet Pull-Quote */}
          <CardStagger
            index={0}
            baseDelay={6}
            style={{
              backgroundColor: COLORS.WHITE,
              borderTop: `4px solid ${COLORS.CRIMSON}`,
              borderBottom: `2px solid ${COLORS.INK}`,
              padding: "20px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.SERIF,
                fontStyle: "italic",
                fontSize: 54,
                color: COLORS.INK,
                lineHeight: 1.08,
              }}
            >
              &ldquo;
              <StabiloHighlight wordStartFrame={18} color={COLORS.LIME} textColor={COLORS.INK}>
                {g.pullQuote}
              </StabiloHighlight>
              &rdquo;
            </div>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 22,
                color: COLORS.SLATE,
                marginTop: 10,
                lineHeight: 1.38,
              }}
            >
              {g.pullQuoteSub}
            </div>
          </CardStagger>

          {/* Two-Column Editorial: Left Goals + Motto, Right Distinct 1913 Chronology */}
          <div style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: 26, flex: 1 }}>
            {/* Left: Goals + Indie voor Indiërs */}
            <CardStagger
              index={1}
              baseDelay={24}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 12 }}>
                  TUJUAN UTAMA INDISCHE PARTIJ
                </div>
                {g.goals.map((goal) => (
                  <div
                    key={goal}
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      fontWeight: 600,
                      lineHeight: 1.42,
                      color: COLORS.INK,
                      marginBottom: 10,
                    }}
                  >
                    ▪ {goal}
                  </div>
                ))}
              </div>

              <div
                style={{
                  backgroundColor: COLORS.INK,
                  color: COLORS.DARK_TEXT,
                  padding: "16px 20px",
                  borderLeft: `5px solid ${COLORS.LIME}`,
                }}
              >
                <div style={{ fontFamily: FONTS.MONO, fontSize: 22, fontWeight: 800, color: COLORS.LIME }}>
                  {g.motto}
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.DARK_TEXT, marginTop: 4 }}>
                  {g.mottoMeaning}
                </div>
              </div>
            </CardStagger>

            {/* Right: Colonial Pressure & Exact Three-Stage 1913 Chronology */}
            <CardStagger
              index={2}
              baseDelay={36}
              style={{
                backgroundColor: COLORS.PAPER,
                border: BORDERS.LIGHT_STRONG,
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON }}>
                PERKEMBANGAN & TEKANAN KOLONIAL (3 TAHAP TERPISAH)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                {g.chronology.map((c, i) => (
                  <div
                    key={c.date}
                    style={{
                      backgroundColor: COLORS.WHITE,
                      border: BORDERS.LIGHT,
                      borderLeft: `5px solid ${i === 2 ? COLORS.CRIMSON : COLORS.INK}`,
                      padding: "14px 18px",
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
                      {c.date}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 22,
                        fontWeight: 600,
                        lineHeight: 1.38,
                        color: COLORS.INK,
                        marginTop: 4,
                      }}
                    >
                      {c.event}
                    </div>
                  </div>
                ))}
              </div>
            </CardStagger>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubDampak: React.FC = () => {
  const frame = useCurrentFrame();
  const imp = INDISCHE_PARTIJ_DATA.impact;
  const spread = interpolate(frame, [10, 70], [0, 1], CLAMP);

  return (
    <SceneTransitionWrapper durationInFrames={270} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "space-between", position: "relative" }}>
        {/* Radiating Unity Lines SVG */}
        <svg
          width="520"
          height="320"
          viewBox="0 0 520 320"
          fill="none"
          style={{ position: "absolute", right: 84, top: 120, pointerEvents: "none" }}
        >
          <rect x="200" y="130" width="120" height="60" rx="6" stroke={COLORS.LIME} strokeWidth="2" />
          <line x1="220" y1="152" x2="300" y2="152" stroke={COLORS.LIME} strokeWidth="2" />
          <line x1="220" y1="168" x2="280" y2="168" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          {[
            [200, 160, 40, 60],
            [200, 160, 40, 260],
            [320, 160, 480, 60],
            [320, 160, 480, 260],
            [260, 130, 260, 20],
            [260, 190, 260, 300],
          ].map(([x1, y1, x2, y2], idx) => (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x1 + (x2 - x1) * spread}
              y2={y1 + (y2 - y1) * spread}
              stroke={idx % 2 === 0 ? COLORS.LIME : COLORS.DARK_MUTED}
              strokeWidth="1.8"
              strokeDasharray="6 6"
              opacity={0.7}
            />
          ))}
        </svg>

        <div style={{ maxWidth: 1120 }}>
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
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.15,
                color: COLORS.DARK_TEXT,
              }}
            >
              {imp.headline}
            </div>
          </MaskedReveal>
        </div>

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
                borderLeft: `4px solid ${COLORS.CRIMSON}`,
                borderRadius: 14,
                padding: "26px 28px",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.LIME, marginBottom: 10 }}>
                DAMPAK 0{idx + 1}
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

export const SceneIndischePartij: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <Sequence from={ORG_SUB_TIMING.TITLE_PUNCH.from} durationInFrames={ORG_SUB_TIMING.TITLE_PUNCH.duration}>
        <SubTitlePunch />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.LATAR_BELAKANG.from} durationInFrames={ORG_SUB_TIMING.LATAR_BELAKANG.duration}>
        <SubBroadsheetLatarBelakang />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.from} durationInFrames={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.duration}>
        <SubBroadsheetTujuan />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.DAMPAK.from} durationInFrames={ORG_SUB_TIMING.DAMPAK.duration}>
        <SubDampak />
      </Sequence>
    </AbsoluteFill>
  );
};
