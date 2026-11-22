import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  ORG_SUB_TIMING,
  PERHIMPUNAN_INDONESIA_DATA,
} from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  Z_INDEX,
} from "../theme";
import {
  IconBrokenChain,
  IconGlobeDiplomacy,
  IconSelfReliance,
  IconUnityShield,
  IconUsersTrio,
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
  const d = PERHIMPUNAN_INDONESIA_DATA;

  return (
    <SceneTransitionWrapper durationInFrames={120} direction="horizontal" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "center" }}>
        {/* Three-Layer Chronology RollingYear: 1908 -> 1922 -> 1925 */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 22,
              border: BORDERS.DARK,
              backgroundColor: COLORS.DARK_SURFACE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconGlobeDiplomacy size={64} color={COLORS.LIME} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <RollingYear year={d.years[0]} delay={4} fontSize={94} color={COLORS.DARK_MUTED} />
            <span style={{ fontFamily: FONTS.MONO, fontSize: 44, color: COLORS.DARK_MUTED }}>→</span>
            <RollingYear year={d.years[1]} delay={14} fontSize={106} color={COLORS.DARK_TEXT} />
            <span style={{ fontFamily: FONTS.MONO, fontSize: 44, color: COLORS.LIME }}>→</span>
            <RollingYear year={d.years[2]} delay={24} fontSize={130} color={COLORS.LIME} />
          </div>
        </div>

        <MaskedReveal delay={30} style={{ marginTop: 18 }}>
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
            {d.numberTitle}
          </div>
        </MaskedReveal>

        <MaskedReveal delay={44} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span
              style={{
                fontFamily: FONTS.SERIF,
                fontStyle: "italic",
                fontSize: 44,
                color: COLORS.DARK_MUTED,
              }}
            >
              {d.subtitle}
            </span>
            <span
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 16,
                color: COLORS.LIME,
                border: BORDERS.DARK,
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              1908 Awal Berdiri · 1922 & 1925 Transformasi Politik
            </span>
          </div>
        </MaskedReveal>
      </SafeSceneContainer>
    </SceneTransitionWrapper>
  );
};

const SubDiplomaticDossier: React.FC = () => {
  const d = PERHIMPUNAN_INDONESIA_DATA;
  const b = d.background;

  return (
    <SceneTransitionWrapper durationInFrames={420} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={420}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 18 }}>
          {/* Diplomatic Dispatch Coordinate Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: COLORS.INK,
              color: COLORS.DARK_TEXT,
              borderRadius: 14,
              padding: "14px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconGlobeDiplomacy size={26} color={COLORS.LIME} />
              <span style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, letterSpacing: "0.08em", color: COLORS.LIME }}>
                DIPLOMATIC DOSSIER · {d.coordinates}
              </span>
            </div>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.DARK_MUTED }}>
              {d.sourceRef}
            </span>
          </div>

          {/* Three Diplomatic Dossier Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr 0.92fr", gap: 22, flex: 1 }}>
            {/* Card 1: Students & Founders */}
            <CardStagger
              index={0}
              baseDelay={14}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderTop: `4px solid ${COLORS.INK}`,
                borderRadius: 16,
                padding: "24px 26px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 12 }}>
                  DOSSIER 01 · {b.foundersTitle.toUpperCase()}
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 22, lineHeight: 1.42, color: COLORS.INK, marginBottom: 14 }}>
                  {b.earlyNote}
                </div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 14, fontWeight: 700, color: COLORS.SLATE, marginBottom: 10 }}>
                  TOKOH FASE PERGERAKAN:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {b.laterFigures.map((fig) => (
                    <span
                      key={fig}
                      style={{
                        backgroundColor: COLORS.SAGE,
                        border: BORDERS.LIGHT,
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontFamily: FONTS.SANS,
                        fontSize: 22,
                        fontWeight: 600,
                        color: COLORS.INK,
                      }}
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 22, lineHeight: 1.4, color: COLORS.SLATE, marginTop: 12 }}>
                {b.roleNote}
              </div>
            </CardStagger>

            {/* Card 2: Name Evolution 1908 -> 1922 -> 1925 & Traits */}
            <CardStagger
              index={1}
              baseDelay={28}
              style={{
                backgroundColor: COLORS.SAGE,
                border: BORDERS.LIGHT_STRONG,
                borderTop: `4px solid ${COLORS.CRIMSON}`,
                borderRadius: 16,
                padding: "24px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 14 }}>
                  DOSSIER 02 · {b.evolutionTitle.toUpperCase()}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {b.evolution.map((ev, idx) => (
                    <div
                      key={ev.year}
                      style={{
                        backgroundColor: COLORS.WHITE,
                        border: BORDERS.LIGHT,
                        borderLeft: `5px solid ${idx === 2 ? COLORS.CRIMSON : COLORS.INK}`,
                        borderRadius: 10,
                        padding: "12px 16px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: FONTS.SANS, fontSize: 23, fontWeight: 800, color: COLORS.INK }}>
                          {ev.name}
                        </span>
                        <span
                          style={{
                            fontFamily: FONTS.MONO,
                            fontSize: 16,
                            fontWeight: 700,
                            color: COLORS.CRIMSON,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {ev.year}
                        </span>
                      </div>
                      <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.SLATE, marginTop: 4 }}>
                        {ev.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {b.traits.map((tr) => (
                  <span
                    key={tr}
                    style={{
                      backgroundColor: COLORS.INK,
                      color: COLORS.LIME,
                      fontFamily: FONTS.MONO,
                      fontSize: 14,
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: 999,
                    }}
                  >
                    {tr}
                  </span>
                ))}
              </div>
            </CardStagger>

            {/* Card 3: European Democratic Context */}
            <CardStagger
              index={2}
              baseDelay={42}
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderTop: `4px solid ${COLORS.INK}`,
                borderRadius: 16,
                padding: "24px 26px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON, marginBottom: 14 }}>
                  DOSSIER 03 · {b.contextTitle.toUpperCase()}
                </div>
                {b.contextPoints.map((pt) => (
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
                  fontFamily: FONTS.MONO,
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.INK,
                  backgroundColor: COLORS.LIME,
                  padding: "10px 14px",
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                SELF-DETERMINATION · HAK BANGSA
              </div>
            </CardStagger>
          </div>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubManifestoDiplomasi: React.FC = () => {
  const g = PERHIMPUNAN_INDONESIA_DATA.goalsAndGrowth;
  const pillarIcons = [
    <IconUnityShield key="p1" size={34} color={COLORS.CRIMSON} />,
    <IconUsersTrio key="p2" size={34} color={COLORS.CRIMSON} />,
    <IconBrokenChain key="p3" size={34} color={COLORS.CRIMSON} />,
    <IconSelfReliance key="p4" size={34} color={COLORS.CRIMSON} />,
  ];

  return (
    <SceneTransitionWrapper durationInFrames={390} direction="horizontal" exitFrames={14}>
      <LivingParallax durationInFrames={390}>
        <SafeSceneContainer style={{ justifyContent: "space-between", gap: 22 }}>
          {/* Top Section: Four-Pillar Manifesto Politik 1925 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <MaskedReveal delay={4}>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 40, fontWeight: 800, color: COLORS.INK }}>
                  Empat Asas {g.manifestoTitle}
                </div>
              </MaskedReveal>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.CRIMSON }}>
                EMPAT PILAR IDEOLOGI PERHIMPUNAN INDONESIA
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
              {g.pillars.map((pillar, idx) => (
                <CardStagger
                  key={pillar.title}
                  index={idx}
                  baseDelay={14}
                  staggerFrames={8}
                  style={{
                    backgroundColor: COLORS.WHITE,
                    border: BORDERS.LIGHT,
                    borderTop: `4px solid ${COLORS.INK}`,
                    borderRadius: 16,
                    padding: "20px 22px",
                    boxShadow: SHADOWS.CARD_LIGHT,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {pillarIcons[idx]}
                    <span style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.SLATE }}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 17, fontWeight: 800, color: COLORS.INK }}>
                    {pillar.title}
                  </div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 22, lineHeight: 1.38, color: COLORS.SLATE }}>
                    {pillar.desc}
                  </div>
                </CardStagger>
              ))}
            </div>
          </div>

          {/* Bottom Section: International Diplomatic Route Dispatch */}
          <CardStagger
            index={4}
            baseDelay={54}
            style={{
              backgroundColor: COLORS.INK,
              color: COLORS.DARK_TEXT,
              borderRadius: 18,
              padding: "24px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 18, fontWeight: 800, color: COLORS.LIME, letterSpacing: "0.08em" }}>
                JALUR DIPLOMASI: {g.routeTitle}
              </span>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.DARK_MUTED }}>
                REPUTASI GERAKAN NASIONAL DI DUNIA
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {g.routeEvents.map((ev) => (
                <div
                  key={ev}
                  style={{
                    backgroundColor: COLORS.DARK_SURFACE,
                    borderLeft: `3px solid ${COLORS.LIME}`,
                    borderRadius: "0 10px 10px 0",
                    padding: "12px 16px",
                    fontFamily: FONTS.SANS,
                    fontSize: 22,
                    lineHeight: 1.38,
                    color: COLORS.DARK_TEXT,
                  }}
                >
                  {ev}
                </div>
              ))}
            </div>
          </CardStagger>
        </SafeSceneContainer>
      </LivingParallax>
    </SceneTransitionWrapper>
  );
};

const SubDampak: React.FC = () => {
  const frame = useCurrentFrame();
  const imp = PERHIMPUNAN_INDONESIA_DATA.impact;
  const arcDash = interpolate(frame, [10, 80], [260, 0], CLAMP);

  return (
    <SceneTransitionWrapper durationInFrames={270} direction="vertical" exitFrames={12}>
      <SafeSceneContainer style={{ justifyContent: "space-between", position: "relative" }}>
        {/* Geometric Globe & Europe-to-Indonesia Diplomatic Connection SVG */}
        <svg
          width="420"
          height="300"
          viewBox="0 0 420 300"
          fill="none"
          style={{ position: "absolute", right: 84, top: 112, pointerEvents: "none" }}
        >
          <circle cx="210" cy="150" r="115" stroke={COLORS.DARK_MUTED} strokeWidth="1.5" opacity="0.45" />
          <ellipse cx="210" cy="150" rx="56" ry="115" stroke={COLORS.DARK_MUTED} strokeWidth="1.5" opacity="0.45" />
          <line x1="95" y1="150" x2="325" y2="150" stroke={COLORS.DARK_MUTED} strokeWidth="1.5" opacity="0.4" />
          <line x1="115" y1="95" x2="305" y2="95" stroke={COLORS.DARK_MUTED} strokeWidth="1.5" opacity="0.35" />
          <line x1="115" y1="205" x2="305" y2="205" stroke={COLORS.DARK_MUTED} strokeWidth="1.5" opacity="0.35" />
          {/* Leiden/Brussels Node */}
          <circle cx="165" cy="98" r="7" fill={COLORS.LIME} />
          <text x="112" y="84" fill={COLORS.LIME} fontSize="14" fontFamily="monospace">
            EROPA
          </text>
          {/* Indonesia Node */}
          <circle cx="268" cy="186" r="8" fill={COLORS.CRIMSON} stroke={COLORS.LIME} strokeWidth="2" />
          <text x="278" y="210" fill={COLORS.DARK_TEXT} fontSize="14" fontFamily="monospace">
            INDONESIA
          </text>
          {/* Animated Diplomatic Arc */}
          <path
            d="M165 98 Q245 104 268 186"
            stroke={COLORS.LIME}
            strokeWidth="2.8"
            strokeDasharray="260"
            strokeDashoffset={arcDash}
          />
        </svg>

        <div style={{ maxWidth: 1140 }}>
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
                borderTop: `4px solid ${COLORS.CRIMSON}`,
                borderRadius: 16,
                padding: "26px 28px",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.LIME, marginBottom: 10 }}>
                DIPLOMASI 0{idx + 1}
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

export const ScenePerhimpunanIndonesia: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      <Sequence from={ORG_SUB_TIMING.TITLE_PUNCH.from} durationInFrames={ORG_SUB_TIMING.TITLE_PUNCH.duration}>
        <SubTitlePunch />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.LATAR_BELAKANG.from} durationInFrames={ORG_SUB_TIMING.LATAR_BELAKANG.duration}>
        <SubDiplomaticDossier />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.from} durationInFrames={ORG_SUB_TIMING.TUJUAN_PERKEMBANGAN.duration}>
        <SubManifestoDiplomasi />
      </Sequence>
      <Sequence from={ORG_SUB_TIMING.DAMPAK.from} durationInFrames={ORG_SUB_TIMING.DAMPAK.duration}>
        <SubDampak />
      </Sequence>
    </AbsoluteFill>
  );
};
