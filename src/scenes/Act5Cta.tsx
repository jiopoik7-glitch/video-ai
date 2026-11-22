import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, MEDIA_CONFIG, TIMELINE } from "../data/videoData";
import {
  CLAMP,
  EASE_APPLE,
  FONT_SIZE,
  FONTS,
  PALETTE,
  SPRING_SILKY,
  SPRING_TACTILE,
} from "../theme";
import {
  BlurWords,
  GlassSurface,
  Icon,
  SafeArea,
  TomatoPotSvg,
} from "../components/LiquidGlassUI";

export const Act5Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showPhaseA = frame < TIMELINE.act5.phaseAExit + 16;
  const phaseAExit = interpolate(
    frame,
    [TIMELINE.act5.phaseAExit, TIMELINE.act5.phaseAExit + 16],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const ctaIn = spring({
    frame: Math.max(0, frame - TIMELINE.act5.ctaAppear),
    fps,
    config: SPRING_TACTILE,
  });

  // Haptic press: 1 -> 0.94 -> 1.02 -> 1.0
  const ctaPress = interpolate(
    frame,
    [
      TIMELINE.act5.ctaPress,
      TIMELINE.act5.ctaPress + 6,
      TIMELINE.act5.ctaPress + 13,
      TIMELINE.act5.ctaPress + 20,
    ],
    [1, 0.94, 1.02, 1.0],
    CLAMP
  );

  const showFinale = frame >= TIMELINE.act5.finaleStart;
  const finaleIn = spring({
    frame: Math.max(0, frame - TIMELINE.act5.finaleStart),
    fps,
    config: SPRING_SILKY,
  });

  const activePhotoSlot = MEDIA_CONFIG.produk2.enabled
    ? MEDIA_CONFIG.produk2
    : MEDIA_CONFIG.produk1;

  return (
    <>
      {showPhaseA && (
        <SafeArea
          style={{
            justifyContent: "center",
            gap: 48,
          }}
        >
          <div style={{ opacity: 1 - phaseAExit }}>
            <BlurWords
              words={COPY.act5.closingWords}
              startFrame={TIMELINE.act5.closingStart}
              stagger={4}
              fontSize={FONT_SIZE.lg}
              align="left"
            />
          </div>

          <GlassSurface
            variant="pill"
            sheenStartFrame={TIMELINE.act5.ctaAppear + 4}
            style={{
              padding: "20px 22px 20px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              opacity: ctaIn * (1 - phaseAExit),
              transform: `scale(${interpolate(ctaIn, [0, 1], [0.92, 1], CLAMP) * ctaPress})`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.sans,
                fontSize: FONT_SIZE.sm,
                fontWeight: 800,
                color: PALETTE.ink,
              }}
            >
              {COPY.act5.ctaLabel}
            </span>

            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                backgroundColor: PALETTE.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="arrowRight" size={38} color={PALETTE.white} />
            </div>
          </GlassSurface>
        </SafeArea>
      )}

      {showFinale && (
        <SafeArea style={{ justifyContent: "center" }}>
          <GlassSurface
            variant="card"
            sheenStartFrame={TIMELINE.act5.finaleStart + 8}
            style={{
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 32,
              opacity: finaleIn,
              transform: `translate3d(0, ${interpolate(finaleIn, [0, 1], [36, 0], CLAMP)}px, 0) scale(${interpolate(
                finaleIn,
                [0, 1],
                [0.96, 1],
                CLAMP
              )})`,
            }}
          >
            {/* Bingkai Produk Akhir (Tenang & Layak Thumbnail) */}
            <div
              style={{
                width: 440,
                height: 440,
                borderRadius: 36,
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.68)",
                border: "1.5px solid rgba(255, 255, 255, 0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activePhotoSlot.enabled ? (
                <Img
                  src={staticFile(activePhotoSlot.file)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <TomatoPotSvg progress={1} size={360} />
              )}
            </div>

            <div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: FONT_SIZE.xl,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: PALETTE.ink,
                  lineHeight: 1.05,
                }}
              >
                {COPY.brandName}
                <span style={{ color: PALETTE.accent }}>.</span>
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: FONT_SIZE.sm,
                  fontWeight: 600,
                  color: PALETTE.inkMuted,
                  marginTop: 12,
                }}
              >
                {COPY.act5.finaleSub}
              </div>
            </div>
          </GlassSurface>
        </SafeArea>
      )}
    </>
  );
};
