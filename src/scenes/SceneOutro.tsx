import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OUTRO_DATA, STUDENT_META } from "../data/sejarahData";
import {
  BORDERS,
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_BOUNCY_MICRO,
  SPRING_EDITORIAL,
  Z_INDEX,
} from "../theme";
import {
  CardStagger,
  MaskedReveal,
  SafeSceneContainer,
  StabiloHighlight,
} from "../components/MotionPrimitives";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = OUTRO_DATA;

  // Phase A (0..240): Formula Sejarah
  const equalsDrop = spring({
    frame: Math.max(0, frame - 104),
    fps,
    config: SPRING_BOUNCY_MICRO,
  });
  const resultPop = spring({
    frame: Math.max(0, frame - 124),
    fps,
    config: SPRING_EDITORIAL,
  });

  // Crane lift-away transition starting around frame 222 -> 252
  const liftAwayProg = interpolate(frame, [222, 254], [0, 1], CLAMP);
  const formulaTranslateY = interpolate(liftAwayProg, [0, 1], [0, -680], CLAMP);
  const formulaOpacity = interpolate(liftAwayProg, [0, 0.85, 1], [1, 0.25, 0], CLAMP);

  // Phase B (240..450): Warm Editorial Outro
  const outroLocal = Math.max(0, frame - 242);
  const creditProg = spring({
    frame: Math.max(0, outroLocal - 26),
    fps,
    config: SPRING_EDITORIAL,
  });
  const refOpacity = interpolate(outroLocal, [48, 72], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ zIndex: Z_INDEX.CONTENT }}>
      {/* PHASE A: FORMULA SEJARAH (with Crane Lift-Away into Phase B) */}
      {formulaOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            transform: `translateY(${formulaTranslateY}px)`,
            opacity: formulaOpacity,
          }}
        >
          <SafeSceneContainer style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: COLORS.CRIMSON,
                  marginBottom: 8,
                }}
              >
                {d.formulaTitle}
              </div>
              <MaskedReveal delay={4}>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 48,
                    fontWeight: 800,
                    color: COLORS.INK,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Empat Tonggak yang Saling Menguatkan
                </div>
              </MaskedReveal>
            </div>

            {/* Four Chronological Formula Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                width: "100%",
              }}
            >
              {d.formulaCards.map((card, idx) => (
                <CardStagger
                  key={card.org}
                  index={idx}
                  baseDelay={22}
                  staggerFrames={14}
                  style={{
                    backgroundColor: COLORS.WHITE,
                    border: BORDERS.LIGHT,
                    borderTop: `5px solid ${idx % 2 === 0 ? COLORS.INK : COLORS.CRIMSON}`,
                    borderRadius: 16,
                    padding: "22px 24px",
                    boxShadow: SHADOWS.CARD_LIGHT,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.MONO,
                      fontSize: 24,
                      fontWeight: 800,
                      color: COLORS.CRIMSON,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {card.year}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 25,
                      fontWeight: 800,
                      color: COLORS.INK,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.org}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      lineHeight: 1.38,
                      color: COLORS.SLATE,
                    }}
                  >
                    {card.summary}
                  </div>
                </CardStagger>
              ))}
            </div>

            {/* Smooth Dropping "=" & Large Lime Result Pill */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 46,
                  fontWeight: 800,
                  color: COLORS.INK,
                  lineHeight: 1,
                  opacity: equalsDrop,
                  transform: `translateY(${interpolate(equalsDrop, [0, 1], [-24, 0], CLAMP)}px)`,
                }}
              >
                =
              </div>

              <div
                style={{
                  backgroundColor: COLORS.LIME,
                  color: COLORS.INK,
                  border: `2px solid ${COLORS.INK}`,
                  borderRadius: 999,
                  padding: "18px 46px",
                  fontFamily: FONTS.SANS,
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  boxShadow: SHADOWS.CARD_LIGHT,
                  opacity: resultPop,
                  transform: `scale(${interpolate(resultPop, [0, 1], [0.9, 1], CLAMP)})`,
                }}
              >
                {d.resultPill}
              </div>

              <div
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 14,
                  color: COLORS.SLATE,
                  textAlign: "center",
                }}
              >
                {d.formulaFootnote}
              </div>
            </div>
          </SafeSceneContainer>
        </AbsoluteFill>
      )}

      {/* PHASE B: CALM WARM OUTRO & ACADEMIC CREDITS (240..450 -> Master 6090..6299) */}
      {frame >= 238 && (
        <AbsoluteFill>
          <SafeSceneContainer
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              textAlign: "center",
            }}
          >
            <div>
              <MaskedReveal delay={246}>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 92,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: COLORS.INK,
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 20,
                  }}
                >
                  <span>{d.thanksPrefix}</span>
                  <StabiloHighlight
                    wordStartFrame={256}
                    color={COLORS.LIME}
                    textColor={COLORS.INK}
                    paddingHorizontal={18}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.SERIF,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 102,
                      }}
                    >
                      {d.thanksHighlight}
                    </span>
                  </StabiloHighlight>
                </div>
              </MaskedReveal>

              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 27,
                  fontWeight: 500,
                  color: COLORS.SLATE,
                  marginTop: 14,
                  opacity: interpolate(outroLocal, [14, 34], [0, 1], CLAMP),
                }}
              >
                {d.thanksSub}
              </div>
            </div>

            {/* Clean Academic Credit Card */}
            <div
              style={{
                backgroundColor: COLORS.WHITE,
                border: BORDERS.LIGHT,
                borderRadius: 20,
                padding: "28px 46px",
                boxShadow: SHADOWS.CARD_LIGHT,
                display: "grid",
                gridTemplateColumns: "repeat(3, auto)",
                columnGap: 48,
                rowGap: 14,
                textAlign: "left",
                opacity: creditProg,
                transform: `translateY(${interpolate(creditProg, [0, 1], [22, 0], CLAMP)}px)`,
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 14, color: COLORS.CRIMSON, fontWeight: 700 }}>
                  NAMA SISWA
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 800, color: COLORS.INK }}>
                  {STUDENT_META.studentName}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 14, color: COLORS.CRIMSON, fontWeight: 700 }}>
                  KELAS & MATA PELAJARAN
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 800, color: COLORS.INK }}>
                  {STUDENT_META.className} · {STUDENT_META.subject}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 14, color: COLORS.CRIMSON, fontWeight: 700 }}>
                  GURU MAPEL & SEKOLAH
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 800, color: COLORS.INK }}>
                  {STUDENT_META.teacherName} · {STUDENT_META.schoolName}
                </div>
              </div>
            </div>

            {/* Compact Reference Footer */}
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 16,
                color: COLORS.SLATE,
                letterSpacing: "0.04em",
                opacity: refOpacity,
              }}
            >
              {d.creditsFooter}
            </div>
          </SafeSceneContainer>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
