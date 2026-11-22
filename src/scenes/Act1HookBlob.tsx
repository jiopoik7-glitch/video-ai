import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OPEN_LOOP_CARDS } from "../data/videoData";
import {
  CLAMP,
  COLORS,
  EASE_EXPO_OUT,
  EASE_WHIP,
  FONT_SANS,
  SPRING_PUNCH,
  SPRING_SILKY,
} from "../theme";
import {
  DarkMatrixBackdrop,
  OrganicLimeBlob,
  SeflornerCircleEmblem,
} from "../components/KineticPrimitives";

export const Act1HookBlob: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1A (0..115): White canvas + kinetic "Pernah merasa / pikiran tak berhenti?" + flying open-loop cards
  const whip1 = interpolate(frame, [6, 34], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const whip1Blur = interpolate(frame, [6, 18, 34], [0, 14, 0], CLAMP);
  const beat1Exit = interpolate(frame, [96, 118], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  // Beat 1B (108..236): Huge lime typography "Otak benci hal yang menggantung." (Homage to 00:03 "Anything")
  const giantPan = interpolate(frame, [108, 224], [620, -480], { ...CLAMP, easing: EASE_EXPO_OUT });
  const giantBlur = interpolate(frame, [108, 122, 138], [22, 10, 0], CLAMP);
  const giantOp = interpolate(frame, [106, 118, 218, 232], [0, 1, 1, 0], CLAMP);

  // Beat 1C (214..294): Explosive Organic Lime Blob Wipe filling entire 1920x1080 screen (00:04!)
  const blobExpand = interpolate(frame, [214, 258], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const blobScale = interpolate(blobExpand, [0, 1], [0.05, 8.2], CLAMP);

  // Beat 1D (262..360): Color Inversion -> Pitch-black matrix + Giant Circle Emblem shrinking to lockup (00:05–00:06!)
  const showDarkReveal = frame >= 262;
  const emblemZoom = spring({
    frame: Math.max(0, frame - 266),
    fps,
    config: SPRING_SILKY,
  });
  const emblemScale = interpolate(emblemZoom, [0, 1], [6.8, 1], CLAMP);
  const titlePop = spring({
    frame: Math.max(0, frame - 294),
    fps,
    config: SPRING_PUNCH,
  });
  const subFade = interpolate(frame, [306, 326], [0, 1], CLAMP);
  const actExit = interpolate(frame, [342, 360], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.LIGHT_BG, overflow: "hidden" }}>
      {/* LIGHT PHASE (f0..264) */}
      {!showDarkReveal && (
        <>
          {/* Organic Morphing Blobs on Corners (00:00–00:02 look) */}
          <OrganicLimeBlob
            size={840}
            x={1640 - frame * 2.1}
            y={220 + frame * 1.2}
            rotation={frame * 0.4}
            blurPx={24}
          />
          <OrganicLimeBlob
            size={680}
            x={180 + frame * 1.4}
            y={960 - frame * 1.1}
            rotation={-frame * 0.35}
            blurPx={28}
          />

          {/* BEAT 1A: Kinetic Intro + Whipping Open-Loop Cards */}
          {frame < 122 && (
            <AbsoluteFill
              style={{
                justifyContent: "center",
                paddingLeft: 180,
                paddingRight: 160,
                opacity: 1 - beat1Exit,
                transform: `translate3d(${interpolate(beat1Exit, [0, 1], [0, -360], CLAMP)}px, 0, 0)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 70,
                }}
              >
                <div
                  style={{
                    transform: `translate3d(${interpolate(whip1, [0, 1], [-180, 0], CLAMP)}px, 0, 0)`,
                    filter: whip1Blur > 0.3 ? `blur(${whip1Blur}px)` : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 94,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.06,
                      color: COLORS.INK,
                    }}
                  >
                    Pernah merasa
                    <br />
                    <span style={{ color: COLORS.INK_MUTED, fontWeight: 600 }}>pikiran tak berhenti?</span>
                  </div>
                </div>

                {/* Open-Loop Stack Whipping In on Right Edge (00:01–00:02 homage) */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 460 }}>
                  {OPEN_LOOP_CARDS.map((card, idx) => {
                    const p = spring({
                      frame: Math.max(0, frame - (24 + idx * 14)),
                      fps,
                      config: SPRING_PUNCH,
                    });
                    return (
                      <div
                        key={card.label}
                        style={{
                          backgroundColor: COLORS.DARK_BG,
                          borderRadius: 24,
                          padding: "24px 30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: "0 22px 46px rgba(12, 18, 11, 0.22)",
                          opacity: p,
                          transform: `translate3d(${interpolate(p, [0, 1], [340, 0], CLAMP)}px, 0, 0) rotate(${
                            (idx - 1) * 2.5
                          }deg)`,
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, color: COLORS.WHITE }}>
                            {card.label}
                          </div>
                          <div style={{ fontFamily: FONT_SANS, fontSize: 20, fontWeight: 600, color: card.color, marginTop: 4 }}>
                            {card.status}
                          </div>
                        </div>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: card.color,
                            boxShadow: `0 0 14px ${card.color}`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </AbsoluteFill>
          )}

          {/* BEAT 1B: Giant Whipping Acid-Lime Typography (00:03 "Anything" homage) */}
          {giantOp > 0.01 && (
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: giantOp,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 168,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  whiteSpace: "nowrap",
                  transform: `translate3d(${giantPan}px, 0, 0)`,
                  filter: giantBlur > 0.3 ? `blur(${giantBlur}px)` : "none",
                }}
              >
                <span style={{ color: COLORS.DEEP_GREEN }}>Otak benci hal </span>
                <span style={{ color: COLORS.LIME }}>menggantung.</span>
              </div>
            </AbsoluteFill>
          )}

          {/* BEAT 1C: Full-Screen Organic Lime Blob Wipe (00:04!) */}
          {blobExpand > 0.005 && (
            <OrganicLimeBlob
              size={520}
              x={960}
              y={540}
              scale={blobScale}
              rotation={blobExpand * 55}
              blurPx={interpolate(blobExpand, [0, 0.7, 1], [26, 8, 0], CLAMP)}
            />
          )}
        </>
      )}

      {/* BEAT 1D: DARK INVERSION — Giant Lime Emblem zooms out to "Zeigarnik Effect" Lockup (00:05–00:06!) */}
      {showDarkReveal && (
        <AbsoluteFill
          style={{
            opacity: 1 - actExit,
            transform: `scale(${1 + actExit * 0.08})`,
          }}
        >
          <DarkMatrixBackdrop glowX={960} glowY={540} />

          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
                <div
                  style={{
                    transform: `scale(${emblemScale}) rotate(${interpolate(emblemZoom, [0, 1], [-45, 0], CLAMP)}deg)`,
                  }}
                >
                  <SeflornerCircleEmblem size={146} />
                </div>

                <div
                  style={{
                    overflow: "hidden",
                    opacity: titlePop,
                    transform: `translate3d(${interpolate(titlePop, [0, 1], [-80, 0], CLAMP)}px, 0, 0)`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 122,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: COLORS.LIME,
                      lineHeight: 1,
                    }}
                  >
                    Zeigarnik Effect
                  </div>
                </div>
              </div>

              <div
                style={{
                  opacity: subFade,
                  transform: `translate3d(0, ${interpolate(subFade, [0, 1], [18, 0], CLAMP)}px, 0)`,
                  fontFamily: FONT_SANS,
                  fontSize: 34,
                  fontWeight: 500,
                  color: COLORS.WHITE_MUTED,
                  letterSpacing: "-0.01em",
                }}
              >
                Otak terus menyalakan alarm selama ada siklus yang belum tuntas.
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
