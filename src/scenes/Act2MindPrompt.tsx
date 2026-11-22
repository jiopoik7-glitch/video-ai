import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
  SeflornerCircleEmblem,
} from "../components/KineticPrimitives";

const PROMPT_TEXT = "Terlalu banyak hal tak tuntas di layar...";

export const Act2MindPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0..268): Interactive Mind Input Bar + Drag Card + Typing + 3D Camera Dive into Submit Button
  const showPromptPhase = frame < 276;
  const barIn = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SILKY });

  // Drag stress chip from bottom into bar (f16 -> f58)
  const dragP = interpolate(frame, [16, 56], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const chipX = interpolate(dragP, [0, 1], [860, 446], CLAMP);
  const chipY = interpolate(dragP, [0, 1], [865, 588], CLAMP);
  const chipScale = interpolate(dragP, [0, 0.8, 1], [1.15, 1.05, 0.92], CLAMP);
  const chipDropped = frame >= 56;

  // Typing text inside prompt bar (f70 -> f158)
  const typedCount = Math.floor(
    interpolate(frame, [70, 158], [0, PROMPT_TEXT.length], CLAMP)
  );
  const typedSlice = PROMPT_TEXT.slice(0, typedCount);

  // 3D Camera Rig Dive toward right-side lime submit button (f164 -> f224) — EXACT homage to 00:08–00:10!
  const dive = interpolate(frame, [164, 218], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const camScale = interpolate(dive, [0, 1], [1, 2.28], CLAMP);
  const camShiftX = interpolate(dive, [0, 1], [0, -560], CLAMP);
  const camShiftY = interpolate(dive, [0, 1], [0, -70], CLAMP);
  const camRotY = interpolate(dive, [0, 0.6, 1], [0, -14, -6], CLAMP);
  const camRotX = interpolate(dive, [0, 0.6, 1], [0, 11, 5], CLAMP);

  // Cursor click at f226 (global f586)
  const cursorClick = frame >= 224 && frame <= 238;
  const btnPress = interpolate(frame, [224, 229, 238], [1, 0.84, 1.06], CLAMP);
  const clickFlash = interpolate(frame, [232, 248, 272], [0, 0.65, 0], CLAMP);

  // Cursor movement: drags chip -> moves to green arrow button
  const moveBtn = interpolate(frame, [145, 216], [0, 1], { ...CLAMP, easing: EASE_EXPO_OUT });
  const cursorX =
    frame < 145
      ? chipX + 34
      : interpolate(moveBtn, [0, 1], [chipX + 34, 1428], CLAMP);
  const cursorY =
    frame < 145
      ? chipY + 26
      : interpolate(moveBtn, [0, 1], [chipY + 26, 610], CLAMP);
  const cursorOp = interpolate(frame, [8, 20, 246, 260], [0, 1, 1, 0], CLAMP);

  // Phase B (266..390): Pullback to Dark Mind-Reset Calm Wave Studio (Homage to 00:11!)
  const showMonitor = frame >= 264;
  const monIn = spring({ frame: Math.max(0, frame - 266), fps, config: SPRING_PUNCH });
  const calmProgress = interpolate(frame, [278, 355], [0, 1], { ...CLAMP, easing: EASE_EXPO_OUT });
  const exitWhip = interpolate(frame, [368, 390], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  // Build dynamic SVG waveform: chaotic jagged stress -> smooth calm green wave
  const wavePoints: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const u = i / 48;
    const x = 40 + u * 860;
    const chaos =
      (Math.sin(u * 38 + frame * 0.16) * 58 + Math.cos(u * 61 - frame * 0.12) * 32) *
      (1 - calmProgress);
    const calm = Math.sin(u * Math.PI * 3 - frame * 0.08) * 28 * calmProgress;
    const y = 180 + chaos + calm;
    wavePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DarkMatrixBackdrop glowX={380} glowY={840} />

      {/* PHASE A: 3D CAMERA RIG OVER MIND INPUT BAR */}
      {showPromptPhase && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `perspective(1200px) translate3d(${camShiftX}px, ${camShiftY}px, 0) scale(${camScale}) rotateY(${camRotY}deg) rotateX(${camRotX}deg)`,
            opacity: interpolate(frame, [252, 274], [1, 0], CLAMP),
          }}
        >
          {/* Uppercase Lime Header (00:07 homage) */}
          <div
            style={{
              position: "absolute",
              top: 324,
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: barIn,
              transform: `translate3d(0, ${interpolate(barIn, [0, 1], [30, 0], CLAMP)}px, 0)`,
            }}
          >
            <SeflornerCircleEmblem size={44} />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "0.02em",
                color: COLORS.LIME,
              }}
            >
              APA YANG MENGGANTUNG <span style={{ color: COLORS.WHITE_MUTED }}>HARI INI?</span>
            </div>
          </div>

          {/* Translucent Dark Glass Prompt Capsule (00:07–00:10) */}
          <div
            style={{
              position: "absolute",
              top: 500,
              width: 1200,
              height: 196,
              borderRadius: 42,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "2px solid rgba(163, 230, 0, 0.35)",
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 34px",
              opacity: barIn,
              transform: `scale(${interpolate(barIn, [0, 1], [0.94, 1], CLAMP)})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 28, flex: 1 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BotanicalIcon name="plus" size={32} color={COLORS.WHITE_MUTED} />
              </div>

              {/* Dropped Slot Placeholder */}
              {chipDropped && <div style={{ width: 146, height: 84, flexShrink: 0 }} />}

              {/* Typing Prompt Text */}
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 36,
                  fontWeight: 600,
                  color: COLORS.WHITE,
                  letterSpacing: "-0.015em",
                }}
              >
                {typedSlice}
                {frame >= 70 && frame < 195 && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 4,
                      height: 36,
                      backgroundColor: COLORS.LIME,
                      marginLeft: 6,
                      verticalAlign: "middle",
                      opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.2,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Glowing Lime Submit Arrow Button (00:09–00:10!) */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: COLORS.LIME,
                boxShadow: "0 0 36px rgba(163, 230, 0, 0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${btnPress})`,
                flexShrink: 0,
              }}
            >
              <BotanicalIcon name="arrowUp" size={44} color={COLORS.DARK_BG} />
            </div>
          </div>

          {/* Dragged Stress Tag Card (00:07–00:08 homage) */}
          <div
            style={{
              position: "absolute",
              left: chipX,
              top: chipY,
              transform: `translate(-50%, -50%) scale(${chipScale}) rotate(${interpolate(dragP, [0, 1], [-10, 0], CLAMP)}deg)`,
              width: 144,
              height: 102,
              borderRadius: 22,
              background: "linear-gradient(145deg, #F43F5E 0%, #9F1239 100%)",
              border: "2px solid rgba(255, 255, 255, 0.45)",
              boxShadow: "0 16px 36px rgba(244, 63, 94, 0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 800, color: COLORS.WHITE }}>
              OPEN LOOP
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
              Stres Digital
            </div>
          </div>

          <KineticCursor
            x={cursorX}
            y={cursorY}
            label="pikiran"
            opacity={cursorOp}
            clicking={cursorClick}
            mode={frame < 75 ? "hand" : "arrow"}
          />
        </AbsoluteFill>
      )}

      {/* PHASE B: MIND-RESET BOTANICAL MONITOR (Homage to 00:11 studio screen!) */}
      {showMonitor && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: monIn * (1 - exitWhip),
            transform: `scale(${interpolate(monIn, [0, 1], [1.14, 1], CLAMP)}) translate3d(${
              -exitWhip * 260
            }px, 0, 0)`,
          }}
        >
          <div
            style={{
              width: 1460,
              height: 680,
              borderRadius: 38,
              backgroundColor: "rgba(14, 22, 13, 0.92)",
              border: "2px solid rgba(163, 230, 0, 0.32)",
              boxShadow: "0 40px 100px rgba(0, 0, 0, 0.65)",
              padding: "44px 52px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <SeflornerCircleEmblem size={46} />
                <span style={{ fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, color: COLORS.WHITE }}>
                  Respon Sistem Saraf · Berkebun
                </span>
              </div>
              <div
                style={{
                  backgroundColor: calmProgress > 0.55 ? "rgba(163, 230, 0, 0.18)" : "rgba(244, 63, 94, 0.18)",
                  color: calmProgress > 0.55 ? COLORS.LIME : COLORS.CORAL,
                  border: `1.5px solid ${calmProgress > 0.55 ? COLORS.LIME : COLORS.CORAL}`,
                  fontFamily: FONT_SANS,
                  fontSize: 22,
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 999,
                }}
              >
                {calmProgress > 0.55 ? "Mode Parasimpatis Aktif" : "Alarm Open-Loop Tinggi"}
              </div>
            </div>

            {/* Real-Time Stress-to-Calm Sine Wave Monitor */}
            <div
              style={{
                height: 360,
                borderRadius: 26,
                backgroundColor: "rgba(6, 10, 5, 0.82)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="940" height="340" viewBox="0 0 940 340" fill="none">
                <line x1="40" y1="180" x2="900" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="8 8" />
                <polyline
                  points={wavePoints.join(" ")}
                  fill="none"
                  stroke={calmProgress > 0.55 ? COLORS.LIME : COLORS.CORAL}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 26, fontWeight: 600, color: COLORS.WHITE_MUTED }}>
                Dari cemas tak terlihat di layar → kembali hadir lewat sentuhan alam nyata.
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, color: COLORS.LIME }}>
                RESTORASI TENANG
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Subtle Lime Submit Flash */}
      {clickFlash > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.LIME,
            opacity: clickFlash,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
