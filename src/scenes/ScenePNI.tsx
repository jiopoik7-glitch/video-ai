import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ORG_SUB_TIMING, PNI_DATA } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_BOUNCY_MICRO,
  Z_INDEX,
} from "../theme";
import {
  IconBrokenChain,
  IconMegaphonePodium,
  IconScaleJustice,
} from "../components/HistoricalIcons";
import {
  CardStagger,
  LivingParallax,
  MaskedReveal,
  RollingYear,
  SafeSceneContainer,
  SceneTransitionWrapper,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SubTitlePunch: React.FC = () => {
  return (
    <SceneTransitionWrapper durationInFrames={120} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 22,
              border: `2px solid ${COLORS.CRIMSON}`,
              backgroundColor: COLORS.DARK_SURFACE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconMegaphonePodium size={64} color={COLORS.LIME} />
          </div>
          <RollingYear year={PNI_DATA.year} delay={8} fontSize={148} color={COLORS.LIME} />
        </div>

        <MaskedReveal delay={24} style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: FONTS.SANS,
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: COLORS.DARK_TEXT,
              lineHeight: 1.08,
            }}
          >
            {PNI_DATA.numberTitle}
          </div>
        </MaskedReveal>

        <MaskedReveal delay={38} style={{ marginTop: 14 }}>
          <div
            style={{
              fontFamily: FONTS.MONO,
              fontSize: 28,
              fontWeight: 600,
              color: COLORS.LIME,
              letterSpacing: "0.06em",
            }}
          >
            {PNI_DATA.subtitle}
          </div>
        </MaskedReveal>
      </SafeSceneContainer>
    </SceneTransitionWrapper>
  );
};

const SubManifestoLatarBelakang: React.FC = () => {
  const b = PNI_DATA.background;

  return (
    <SceneTransitionWrapper durationInFrames={420} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={420}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 20 }}>
          {/* Full Top Manifesto Strip: Date, Place, Name Evolution & Nature */}
          <CardStagger
            index={0}
            baseDelay={6}
            style={{
              backgroundColor: COLORS.INK,
              color: COLORS.DARK_TEXT,
              borderRadius: 16,
              padding: "22px 30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              borderLeft: `8px solid ${COLORS.CRIMSON}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 22,
                    fontWeight: 800,
                    color: COLORS.LIME,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {b.topStripDate}
                </span>
                <span style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.DARK_MUTED }}>
                  {PNI_DATA.sourceRef}
                </span>
              </div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 23, color: COLORS.DARK_TEXT, marginTop: 6 }}>
                {b.topStripNameNote}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {b.traits.map((tr) => (
                <span
                  key={tr}
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 15,
                    fontWeight: 700,
                    backgroundColor: "rgba(221, 252, 53, 0.14)",
                    border: `1px solid ${COLORS.LIME}`,
                    color: COLORS.LIME,
                    padding: "6px 14px",
                    borderRadius: 999,
                  }}
                >
                  {tr}
                </span>
              ))}
            </div>
          </CardStagger>

          {/* Bottom Split: Left Founders Card, Right Socio-Political + Pyramid Illustration */}
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 24, flex: 1 }}>
            {/* Left: Founders & Mass Membership */}
            <CardStagger
              index={1}
              baseDelay={22}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderRadius: 18,
                padding: "26px 30px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 14 }}>
                  {b.foundersTitle.toUpperCase()}
                </div>

                {/* Lead Founder Spotlight */}
                <div
                  style={{
                    backgroundColor: COLORS.PAPER,
                    borderLeft: `5px solid ${COLORS.CRIMSON}`,
                    padding: "16px 20px",
                    borderRadius: "0 12px 12px 0",
                    marginBottom: 18,
                  }}
                >
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 30, fontWeight: 800, color: COLORS.INK }}>
                    {b.leadFounder}
                  </div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.SLATE, marginTop: 4, lineHeight: 1.4 }}>
                    {b.leadRole}
                  </div>
                </div>

                {/* Other Founders Grid */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {b.otherFounders.map((name) => (
                    <span
                      key={name}
                      style={{
                        backgroundColor: COLORS.SAGE,
                        border: BORDERS.LIGHT,
                        borderRadius: 10,
                        padding: "8px 14px",
                        fontFamily: FONTS.SANS,
                        fontSize: 22,
                        fontWeight: 600,
                        color: COLORS.INK,
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 22,
                  fontWeight: 600,
                  color: COLORS.INK,
                  borderTop: BORDERS.LIGHT,
                  paddingTop: 14,
                  marginTop: 14,
                }}
              >
                {b.membershipNote}
              </div>
            </CardStagger>

            {/* Right: Colonial Repression & Power Pyramid Diagram */}
            <CardStagger
              index={2}
              baseDelay={36}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderRadius: 18,
                padding: "26px 30px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 12 }}>
                  {b.socialTitle.toUpperCase()}
                </div>
                {b.socialPoints.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      lineHeight: 1.42,
                      color: COLORS.INK,
                      marginBottom: 10,
                    }}
                  >
                    ▪ {pt}
                  </div>
                ))}
              </div>

              {/* Minimalist Colonial Hierarchy vs People Power Pyramid SVG */}
              <div
                style={{
                  backgroundColor: COLORS.PAPER,
                  border: BORDERS.LIGHT,
                  borderRadius: 14,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <svg width="160" height="106" viewBox="0 0 160 106" fill="none" style={{ flexShrink: 0 }}>
                  <polygon points="80,8 52,44 108,44" fill={COLORS.CRIMSON} opacity="0.9" />
                  <polygon points="48,50 112,50 132,74 28,74" fill={COLORS.INK} opacity="0.82" />
                  <polygon points="24,80 136,80 152,100 8,100" fill={COLORS.LIME} stroke={COLORS.INK} strokeWidth="1.5" />
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 14, fontWeight: 700, color: COLORS.CRIMSON }}>
                    PUNCAK · PEMERINTAH KOLONIAL
                  </div>
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 14, fontWeight: 700, color: COLORS.INK }}>
                    TENGAH · PENGAWASAN & REPRESI
                  </div>
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 800, color: COLORS.INK }}>
                    BASIS · KEKUATAN MASSA RAKYAT
                  </div>
                </div>
              </div>
            </CardStagger>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubManifestoTujuanPleidoi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = PNI_DATA.goalsAndGrowth;

  const stampScale = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: SPRING_BOUNCY_MICRO,
  });

  return (
    <SceneTransitionWrapper durationInFrames={390} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={390}>
        <SafeSceneContainer style={{ justifyContent: "space-between" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.86fr 1.14fr", gap: 26, flex: 1 }}>
            {/* Left Column: Vertical Manifesto INDONESIA MERDEKA + 3 Principles */}
            <CardStagger
              index={0}
              baseDelay={8}
              style={{
                backgroundColor: COLORS.INK,
                color: COLORS.DARK_TEXT,
                borderRadius: 20,
                padding: "30px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <IconBrokenChain size={34} color={COLORS.LIME} />
                  <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.LIME, letterSpacing: "0.08em" }}>
                    TUJUAN UTAMA · SELF-HELP
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 52,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.06,
                    color: COLORS.DARK_TEXT,
                  }}
                >
                  {g.headline}
                </div>

                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    lineHeight: 1.44,
                    color: COLORS.DARK_MUTED,
                    marginTop: 14,
                  }}
                >
                  {g.goalDesc}
                </div>
              </div>

              {/* Three Political Principles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
                {g.principles.map((pr, idx) => (
                  <div
                    key={pr.title}
                    style={{
                      backgroundColor: COLORS.DARK_SURFACE,
                      borderLeft: `4px solid ${COLORS.LIME}`,
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 18px",
                    }}
                  >
                    <div style={{ fontFamily: FONTS.SANS, fontSize: 23, fontWeight: 800, color: COLORS.LIME }}>
                      0{idx + 1} · {pr.title}
                    </div>
                    <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.DARK_TEXT, marginTop: 2 }}>
                      {pr.desc}
                    </div>
                  </div>
                ))}
              </div>
            </CardStagger>

            {/* Right Column: Courtroom Pleidoi Document + Exact Chronology */}
            <CardStagger
              index={1}
              baseDelay={20}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT_STRONG,
                borderRadius: 18,
                padding: "24px 30px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {/* Archival Document Header: INDONESIA MENGGUGAT + Crimson Stamp */}
              <div
                style={{
                  borderBottom: `2px solid ${COLORS.INK}`,
                  paddingBottom: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <IconScaleJustice size={28} color={COLORS.CRIMSON} />
                    <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.SLATE }}>
                      {g.docCode}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.SERIF,
                      fontStyle: "italic",
                      fontSize: 44,
                      color: COLORS.INK,
                      lineHeight: 1.05,
                      marginTop: 4,
                    }}
                  >
                    {g.pleidoiTitle}
                  </div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.SLATE }}>
                    {g.pleidoiSub}
                  </div>
                </div>

                {/* Archival Crimson Stamp */}
                <div
                  style={{
                    transform: `rotate(-8deg) scale(${stampScale})`,
                    border: `3px solid ${COLORS.CRIMSON}`,
                    color: COLORS.CRIMSON,
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontFamily: FONTS.MONO,
                    fontSize: 15,
                    fontWeight: 800,
                    textAlign: "center",
                    lineHeight: 1.25,
                    flexShrink: 0,
                  }}
                >
                  BANDUNG
                  <br />
                  1930
                </div>
              </div>

              {/* Exact 5-Point Historical Chronology (1927 -> 1929 -> 1930 -> 25 Apr 1931 -> Partindo & PNI Baru) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 14 }}>
                {g.chronology.map((item) => (
                  <div
                    key={item.date}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "185px 1fr",
                      gap: 16,
                      alignItems: "baseline",
                      borderBottom: BORDERS.LIGHT,
                      paddingBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.MONO,
                        fontSize: 15,
                        fontWeight: 700,
                        color: COLORS.CRIMSON,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.date}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 22,
                        fontWeight: 500,
                        lineHeight: 1.36,
                        color: COLORS.INK,
                      }}
                    >
                      {item.text}
                    </span>
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
  const imp = PNI_DATA.impact;
  const reach = interpolate(frame, [10, 65], [0, 1], CLAMP);

  return (
    <SceneTransitionWrapper durationInFrames={270} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "space-between", position: "relative" }}>
        {/* Minimalist Podium Silhouette Radiating to Society Nodes */}
        <svg
          width="480"
          height="290"
          viewBox="0 0 480 290"
          fill="none"
          style={{ position: "absolute", right: 84, top: 120, pointerEvents: "none" }}
        >
          {/* Podium */}
          <rect x="44" y="135" width="76" height="90" rx="6" stroke={COLORS.LIME} strokeWidth="2.2" />
          <line x1="34" y1="135" x2="130" y2="135" stroke={COLORS.LIME} strokeWidth="2.2" />
          <circle cx="82" cy="108" r="14" stroke={COLORS.DARK_TEXT} strokeWidth="2" />
          {/* Radiating lines to mass nodes */}
          {[
            [130, 155, 310, 60],
            [130, 165, 390, 120],
            [130, 175, 420, 190],
            [130, 185, 340, 245],
          ].map(([x1, y1, x2, y2], idx) => {
            const cx = x1 + (x2 - x1) * reach;
            const cy = y1 + (y2 - y1) * reach;
            return (
              <g key={idx}>
                <line x1={x1} y1={y1} x2={cx} y2={cy} stroke={COLORS.LIME} strokeWidth="1.8" opacity="0.72" />
                <circle cx={cx} cy={cy} r="7" fill={COLORS.CRIMSON} stroke={COLORS.LIME} strokeWidth="1.8" />
              </g>
            );
          })}
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
                fontSize: 54,
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
                borderBottom: `4px solid ${COLORS.LIME}`,
                borderRadius: 16,
                padding: "26px 28px",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.LIME, marginBottom: 10 }}>
                0{idx + 1} · PNI
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

export const ScenePNI: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <Sequence from={ORG_SUB_TIMING.TITLE_PUNCH.from} durationInFrames={ORG_SUB_TIMING.TITLE_PUNCH.duration}>
        <SubTitlePunch />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.LATAR_BELAKANG.from} durationInFrames={ORG_SUB_TIMING.LATAR_BELAKANG.duration}>
        <SubManifestoLatarBelakang />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.from} durationInFrames={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.duration}>
        <SubManifestoTujuanPleidoi />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.DAMPAK.from} durationInFrames={ORG_SUB_TIMING.DAMPAK.duration}>
        <SubDampak />
      </Sequence>
    </AbsoluteFill>
  );
};
