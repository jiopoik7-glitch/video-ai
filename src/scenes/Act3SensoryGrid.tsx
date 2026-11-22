import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SENSORY_GRID_TILES } from "../data/videoData";
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
  BotanicalIcon,
  DarkMatrixBackdrop,
  KineticCursor,
} from "../components/KineticPrimitives";

export const Act3SensoryGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0..92): Clean White Punch Question "Lalu kenapa berkebun bikin tenang?" (00:12–00:13)
  const showWhiteQ = frame < 94;
  const qPop = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_PUNCH });
  const qZoomExit = interpolate(frame, [66, 92], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  // Phase B (88..390): Dark 3D-Tilted 3x3 Sensory Grid (00:14–00:15!) -> Select Center Tile "Tunas Baru" (00:16!) -> Drop Seed Care Card (00:17!) -> Lime Burst (00:18–00:19!)
  const showGridPhase = frame >= 88;
  const gridIn = spring({ frame: Math.max(0, frame - 90), fps, config: SPRING_SILKY });

  // 3D Tilt sweeps straight when cursor locks onto "Tunas Baru" at f192 (global f942)
  const selectProg = spring({
    frame: Math.max(0, frame - 192),
    fps,
    config: SPRING_SILKY,
  });

  const gridRotX = interpolate(gridIn, [0, 1], [24, 14], CLAMP) * (1 - selectProg);
  const gridRotY = interpolate(gridIn, [0, 1], [-18, -10], CLAMP) * (1 - selectProg);
  const gridScale = interpolate(gridIn, [0, 1], [0.82, 1], CLAMP);

  // Drop "Sabar & Rawat" badge into bottom pill (f254..f296)
  const dropP = interpolate(frame, [252, 294], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const dropY = interpolate(dropP, [0, 1], [1040, 818], CLAMP);
  const showDropDock = frame >= 210;
  const dockIn = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_SILKY });

  // Cursor path across 3D grid -> center tile -> bottom dock
  const cMove1 = interpolate(frame, [118, 188], [0, 1], { ...CLAMP, easing: EASE_EXPO_OUT });
  const cursorX =
    frame < 240
      ? interpolate(cMove1, [0, 1], [1340, 960], CLAMP)
      : interpolate(dropP, [0, 1], [960, 840], CLAMP);
  const cursorY =
    frame < 240
      ? interpolate(cMove1, [0, 1], [860, 520], CLAMP)
      : dropY + 12;
  const cursorOp = interpolate(frame, [116, 128, 326, 342], [0, 1, 1, 0], CLAMP);
  const cursorClick = (frame >= 190 && frame <= 202) || (frame >= 292 && frame <= 304);

  // Finale Lime Glow Burst (f336..f390 -> exact 00:18–00:19 transition into Act 4!)
  const burst = interpolate(frame, [334, 386], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* PHASE A: CRISP WHITE PUNCH QUESTION (00:12 homage) */}
      {showWhiteQ && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.LIGHT_BG,
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - qZoomExit,
            transform: `scale(${1 + qZoomExit * 0.35})`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 82,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: COLORS.INK,
                opacity: qPop,
                transform: `scale(${interpolate(qPop, [0, 1], [0.88, 1], CLAMP)})`,
              }}
            >
              Kenapa berkebun bikin tenang?
            </div>

            <div
              style={{
                backgroundColor: COLORS.LIME,
                color: COLORS.DARK_BG,
                fontFamily: FONT_SANS,
                fontSize: 34,
                fontWeight: 800,
                padding: "16px 38px",
                borderRadius: 999,
                boxShadow: "0 18px 46px rgba(163, 230, 0, 0.42)",
                opacity: interpolate(frame, [26, 44], [0, 1], CLAMP),
                transform: `translate3d(0, ${interpolate(frame, [26, 44], [24, 0], CLAMP)}px, 0)`,
              }}
            >
              Karena siklusnya terlihat nyata & tuntas.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE B: 3D-TILTED 3x3 SENSORY GRID (00:14–00:17 homage) */}
      {showGridPhase && (
        <AbsoluteFill style={{ opacity: gridIn }}>
          <DarkMatrixBackdrop glowX={1480} glowY={380} />

          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: interpolate(selectProg, [0, 1], [0, 140], CLAMP),
            }}
          >
            <div
              style={{
                width: 960,
                padding: 28,
                borderRadius: 42,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1.5px solid rgba(255, 255, 255, 0.14)",
                transform: `perspective(1200px) rotateX(${gridRotX}deg) rotateY(${gridRotY}deg) scale(${gridScale})`,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 22,
              }}
            >
              {SENSORY_GRID_TILES.map((tile) => {
                const isCenter = Boolean(tile.selected);
                const tileOpacity = isCenter
                  ? 1
                  : interpolate(selectProg, [0, 1], [1, 0.14], CLAMP);
                const tileBlur = isCenter
                  ? 0
                  : interpolate(selectProg, [0, 1], [0, 10], CLAMP);
                const tileScale = isCenter
                  ? interpolate(selectProg, [0, 1], [1, 1.38], CLAMP)
                  : interpolate(selectProg, [0, 1], [1, 0.92], CLAMP);

                return (
                  <div
                    key={tile.id}
                    style={{
                      height: 205,
                      borderRadius: 28,
                      padding: "24px 24px",
                      backgroundColor: isCenter
                        ? "rgba(24, 38, 22, 0.96)"
                        : "rgba(18, 27, 17, 0.84)",
                      border: isCenter
                        ? `2.5px solid ${COLORS.LIME}`
                        : "1.5px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: isCenter
                        ? "0 24px 64px rgba(163, 230, 0, 0.35)"
                        : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      opacity: tileOpacity,
                      filter: tileBlur > 0.3 ? `blur(${tileBlur}px)` : "none",
                      transform: `scale(${tileScale})`,
                      zIndex: isCenter ? 10 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BotanicalIcon name={tile.icon} size={30} color={tile.accent} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 28,
                          fontWeight: 800,
                          color: COLORS.WHITE,
                          lineHeight: 1.15,
                        }}
                      >
                        {tile.title}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 19,
                          fontWeight: 500,
                          color: COLORS.WHITE_MUTED,
                          marginTop: 4,
                        }}
                      >
                        {tile.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>

          {/* Bottom Seed-Care Dock appearing after tile lock (00:16–00:17 homage) */}
          {showDropDock && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 145,
                width: 820,
                height: 122,
                borderRadius: 34,
                backgroundColor: "rgba(255, 255, 255, 0.10)",
                border: "1.5px solid rgba(163, 230, 0, 0.42)",
                transform: `translateX(-50%) translateY(${interpolate(dockIn, [0, 1], [80, 0], CLAMP)}px)`,
                opacity: dockIn,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px 0 36px",
              }}
            >
              <div style={{ fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: COLORS.WHITE }}>
                {dropP > 0.85 ? "Nutrisi + Rawatan Konsisten" : "Tambahkan kebiasaan kecil..."}
              </div>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: "50%",
                  backgroundColor: COLORS.LIME,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BotanicalIcon name="arrowUp" size={36} color={COLORS.DARK_BG} />
              </div>
            </div>
          )}

          {/* Dragged Care Pill */}
          {frame >= 246 && frame < 320 && (
            <div
              style={{
                position: "absolute",
                left: 690,
                top: dropY,
                transform: "translate(-50%, -50%)",
                backgroundColor: COLORS.LIME,
                color: COLORS.DARK_BG,
                fontFamily: FONT_SANS,
                fontSize: 24,
                fontWeight: 800,
                padding: "16px 30px",
                borderRadius: 24,
                boxShadow: "0 18px 46px rgba(163, 230, 0, 0.45)",
                opacity: interpolate(dropP, [0, 0.85, 1], [1, 1, 0], CLAMP),
              }}
            >
              Rawat Tiap Pagi
            </div>
          )}

          <KineticCursor
            x={cursorX}
            y={cursorY}
            label="fokus"
            opacity={cursorOp}
            clicking={cursorClick}
            mode={frame >= 246 ? "hand" : "arrow"}
          />

          {/* Radiant Acid-Lime Burst Transition into Act 4 (00:18–00:19!) */}
          {burst > 0.01 && (
            <AbsoluteFill
              style={{
                background: `radial-gradient(circle, ${COLORS.LIME_BRIGHT} 0%, ${COLORS.LIME} 60%, #78C800 100%)`,
                opacity: burst,
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
