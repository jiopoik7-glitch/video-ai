import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACTS, COPY, TIMELINE } from "../data/videoData";
import {
  CLAMP,
  EASE_APPLE,
  FONT_SIZE,
  FONTS,
  PALETTE,
  SAFE,
  SPRING_SILKY,
} from "../theme";
import {
  GlassSurface,
  SafeArea,
  TomatoPotSvg,
  TouchCursor,
} from "../components/LiquidGlassUI";

export const Act3Widget: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = ACTS.act3.duration;

  const enter = spring({
    frame: Math.max(0, frame - TIMELINE.act3.cardStart),
    fps,
    config: SPRING_SILKY,
  });

  const exit = interpolate(
    frame,
    [TIMELINE.act3.exitStart, total - 1],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  // Semua nilai diturunkan langsung dari frame (zero useState)
  const dragProgress = interpolate(
    frame,
    [TIMELINE.act3.tapStart, TIMELINE.act3.dragEnd],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );
  const metricProgress = interpolate(
    frame,
    [TIMELINE.act3.tapStart, TIMELINE.act3.metricEnd],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const score = Math.round(
    interpolate(metricProgress, [0, 1], [COPY.act3.beforeScore, COPY.act3.afterScore], CLAMP)
  );
  const isRoutine = metricProgress >= 0.5;
  const knobPct = interpolate(dragProgress, [0, 1], [10, 90], CLAMP);

  // Ring progress SVG
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  // Lintasan kursor sentuh deterministik di atas slider
  const cursorOpacity = interpolate(
    frame,
    [TIMELINE.act3.cursorAppear, TIMELINE.act3.cursorAppear + 14, TIMELINE.act3.cursorHide, TIMELINE.act3.cursorHide + 16],
    [0, 1, 1, 0],
    CLAMP
  );
  const approach = interpolate(
    frame,
    [TIMELINE.act3.cursorAppear, TIMELINE.act3.tapStart],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );
  const trackLeftX = SAFE.left + 80;
  const trackRightX = 1080 - SAFE.right - 80;
  const trackY = 1265;
  const cursorX =
    frame < TIMELINE.act3.tapStart
      ? interpolate(approach, [0, 1], [trackRightX - 80, trackLeftX], CLAMP)
      : interpolate(dragProgress, [0, 1], [trackLeftX, trackRightX], CLAMP);
  const cursorY =
    frame < TIMELINE.act3.tapStart
      ? interpolate(approach, [0, 1], [trackY + 130, trackY], CLAMP)
      : trackY;
  const isPressing = frame >= TIMELINE.act3.tapStart && frame <= TIMELINE.act3.dragEnd;

  const cardY = interpolate(enter, [0, 1], [44, 0], CLAMP) - exit * 32;
  const cardScale = interpolate(enter, [0, 1], [0.96, 1], CLAMP) * (1 - exit * 0.03);
  const cardOpacity = enter * (1 - exit);

  return (
    <>
      <SafeArea style={{ justifyContent: "center" }}>
        <GlassSurface
          variant="card"
          sheenStartFrame={12}
          style={{
            padding: "40px 36px",
            opacity: cardOpacity,
            transform: `translate3d(0, ${cardY}px, 0) scale(${cardScale})`,
          }}
        >
          {/* Label Ilustrasi eksplisit */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: FONT_SIZE.xs,
              fontWeight: 700,
              color: PALETTE.inkMuted,
            }}
          >
            {COPY.act3.tag}
          </div>

          {/* Baris Metrik Besar (160px tabular-nums) + Ring SVG */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: FONT_SIZE.hero,
                  fontWeight: 700,
                  color: PALETTE.ink,
                  lineHeight: 0.96,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {score}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: FONT_SIZE.xs,
                  fontWeight: 600,
                  color: PALETTE.inkMuted,
                  marginTop: 8,
                }}
              >
                {COPY.act3.metricLabel}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="rgba(15, 23, 20, 0.10)"
                  strokeWidth="16"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={isRoutine ? PALETTE.accent : PALETTE.warm}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: FONT_SIZE.xs,
                  fontWeight: 700,
                  color: isRoutine ? PALETTE.accent : PALETTE.warm,
                  backgroundColor: isRoutine ? PALETTE.accentSoft : PALETTE.warmSoft,
                  padding: "8px 20px",
                  borderRadius: 999,
                }}
              >
                {isRoutine ? COPY.act3.afterStatus : COPY.act3.beforeStatus}
              </div>
            </div>
          </div>

          {/* Grafik Pertumbuhan Tomat Prosedural */}
          <div
            style={{
              marginTop: 28,
              height: 310,
              borderRadius: 28,
              backgroundColor: "rgba(255, 255, 255, 0.54)",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TomatoPotSvg progress={metricProgress} size={280} />
          </div>

          {/* Interactive Slider Track (tanpa nested backdropFilter) */}
          <div style={{ marginTop: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.sans,
                fontSize: FONT_SIZE.xs,
                fontWeight: 700,
                color: PALETTE.inkMuted,
                marginBottom: 20,
              }}
            >
              <span>{COPY.act3.beforeLabel}</span>
              <span style={{ color: PALETTE.accent }}>{COPY.act3.afterLabel}</span>
            </div>

            <div
              style={{
                position: "relative",
                height: 22,
                borderRadius: 999,
                backgroundColor: "rgba(15, 23, 20, 0.10)",
              }}
            >
              <div
                style={{
                  width: `${knobPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: isRoutine ? PALETTE.accent : PALETTE.warm,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${knobPct}%`,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: PALETTE.white,
                  border: `5px solid ${isRoutine ? PALETTE.accent : PALETTE.warm}`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 8px 18px rgba(15, 23, 20, 0.22)",
                }}
              />
            </div>
          </div>
        </GlassSurface>
      </SafeArea>

      <TouchCursor
        x={cursorX}
        y={cursorY}
        opacity={cursorOpacity * (1 - exit)}
        pressing={isPressing}
      />
    </>
  );
};
