import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAIN_EFFECTS_LIST, COLLAGE_MOMENTS } from "../data/videoData";
import {
  CLAMP,
  COLORS,
  EASE_EXPO_OUT,
  EASE_WHIP,
  FONT_SANS,
  SPRING_PUNCH,
  SPRING_SILKY,
} from "../theme";
import { OrganicLimeBlob } from "../components/KineticPrimitives";

export const Act4ClosureList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lime burst recedes cleanly from Act 3 (f0..f28)
  const burstClear = interpolate(frame, [0, 26], [1, 0], { ...CLAMP, easing: EASE_EXPO_OUT });

  // Phase A (0..118): Radial Exploding Botanical Collage around center word "Tuntas." (00:20 homage!)
  const showCollage = frame < 126;
  const explode = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_PUNCH });
  const collageExit = interpolate(frame, [96, 122], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  // Phase B (112..348): White Card with Lime Pill Header + Growing Left Vertical Lime Bar (00:22–00:23 "Visual Styles" homage!)
  const showCard = frame >= 110;
  const cardIn = spring({ frame: Math.max(0, frame - 114), fps, config: SPRING_SILKY });
  const leftBarGrow = interpolate(frame, [132, 268], [0, 1], { ...CLAMP, easing: EASE_EXPO_OUT });
  const cardTilt = Math.sin(frame * 0.03) * 1.4;
  const actExit = interpolate(frame, [324, 348], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.LIGHT_BG, overflow: "hidden" }}>
      {/* Organic Sweeping Lime Blobs (00:20–00:23 look) */}
      <OrganicLimeBlob
        size={960}
        x={960 + interpolate(frame, [0, 130], [0, 740], CLAMP)}
        y={540 - interpolate(frame, [0, 130], [0, 320], CLAMP)}
        scale={interpolate(frame, [0, 120], [1.35, 0.92], CLAMP)}
        blurPx={34}
        opacity={0.82}
      />
      <OrganicLimeBlob
        size={640}
        x={1780 - frame * 0.5}
        y={240 + frame * 0.4}
        blurPx={24}
        opacity={0.75}
      />

      {/* PHASE A: RADIAL EXPLODING COLLAGE AROUND "Tuntas." (00:20!) */}
      {showCollage && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - collageExit,
            transform: `scale(${1 + collageExit * 0.25})`,
          }}
        >
          {COLLAGE_MOMENTS.map((m, idx) => {
            const tx = m.x * explode;
            const ty = m.y * explode;
            const bob = Math.sin(frame * 0.08 + idx) * 6;
            return (
              <div
                key={m.label}
                style={{
                  position: "absolute",
                  width: 320,
                  height: 185,
                  borderRadius: 24,
                  backgroundColor: m.bg,
                  border: `2px solid ${m.accent}`,
                  boxShadow: "0 24px 54px rgba(12, 18, 11, 0.22)",
                  padding: "24px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `translate3d(${tx}px, ${ty + bob}px, 0) rotate(${m.rot}deg) scale(${interpolate(
                    explode,
                    [0, 1],
                    [0.35, 1],
                    CLAMP
                  )})`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: m.accent,
                  }}
                />
                <div style={{ fontFamily: FONT_SANS, fontSize: 32, fontWeight: 800, color: COLORS.WHITE }}>
                  {m.label}
                </div>
              </div>
            );
          })}

          {/* Center Anchor Word */}
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 126,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              color: COLORS.DARK_BG,
              backgroundColor: "rgba(247, 248, 245, 0.92)",
              padding: "16px 56px",
              borderRadius: 999,
              boxShadow: "0 24px 60px rgba(12, 18, 11, 0.16)",
              transform: `scale(${explode})`,
              zIndex: 10,
            }}
          >
            Tuntas<span style={{ color: COLORS.EMERALD }}>.</span>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE B: FLOATING CARD + GROWING LEFT LIME VERTICAL BAR (00:22–00:23 homage!) */}
      {showCard && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: cardIn * (1 - actExit),
            transform: `translate3d(${-actExit * 340}px, ${interpolate(cardIn, [0, 1], [110, 0], CLAMP)}px, 0) scale(${interpolate(
              cardIn,
              [0, 1],
              [0.9, 1],
              CLAMP
            )})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 36,
              transform: `perspective(1200px) rotateY(${cardTilt}deg)`,
            }}
          >
            {/* Growing Vertical Lime Indicator Bar on Left (Signature 00:22–00:23 detail!) */}
            <div
              style={{
                width: 24,
                borderRadius: 999,
                backgroundColor: "rgba(163, 230, 0, 0.18)",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.max(12, leftBarGrow * 100)}%`,
                  borderRadius: 999,
                  backgroundColor: COLORS.LIME,
                }}
              />
            </div>

            {/* Clean White Elevated List Card */}
            <div
              style={{
                width: 780,
                backgroundColor: COLORS.WHITE,
                borderRadius: 42,
                padding: "46px 52px",
                boxShadow: "0 38px 92px rgba(12, 18, 11, 0.12)",
                border: "1.5px solid rgba(12, 18, 11, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 34,
              }}
            >
              {/* Lime Pill Header */}
              <div
                style={{
                  backgroundColor: COLORS.LIME,
                  borderRadius: 999,
                  padding: "18px 34px",
                  textAlign: "center",
                  fontFamily: FONT_SANS,
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: COLORS.DARK_BG,
                }}
              >
                Efek di Otak Manusia
              </div>

              {/* 4 Kinetic Rows Revealing Synchronously with Left Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {BRAIN_EFFECTS_LIST.map((item) => {
                  const p = spring({
                    frame: Math.max(0, frame - item.appearLocal),
                    fps,
                    config: SPRING_PUNCH,
                  });
                  return (
                    <div
                      key={item.title}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        opacity: p,
                        transform: `translate3d(${interpolate(p, [0, 1], [-42, 0], CLAMP)}px, 0, 0)`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 48,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: COLORS.INK,
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 26,
                          fontWeight: 600,
                          color: COLORS.EMERALD,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Smooth Fade Out of Act 3 Lime Burst */}
      {burstClear > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.LIME,
            opacity: burstClear,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
