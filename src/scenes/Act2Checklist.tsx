import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACTS, COPY, TIMELINE } from "../data/videoData";
import {
  CLAMP,
  EASE_APPLE,
  FONT_SIZE,
  FONTS,
  PALETTE,
  SPRING_SILKY,
  SPRING_TACTILE,
} from "../theme";
import { GlassSurface, Icon, SafeArea } from "../components/LiquidGlassUI";

export const Act2Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = ACTS.act2.duration;

  const enter = spring({
    frame: Math.max(0, frame - TIMELINE.act2.cardStart),
    fps,
    config: SPRING_SILKY,
  });

  const exit = interpolate(
    frame,
    [TIMELINE.act2.exitStart, total - 1],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const checkedCount = COPY.act2.items.filter((it) => frame >= it.checkLocal).length;
  const cardY = interpolate(enter, [0, 1], [44, 0], CLAMP) - exit * 34;
  const cardScale = interpolate(enter, [0, 1], [0.96, 1], CLAMP) * (1 - exit * 0.03);
  const cardOpacity = enter * (1 - exit);

  return (
    <SafeArea style={{ justifyContent: "center" }}>
      <GlassSurface
        variant="card"
        sheenStartFrame={10}
        style={{
          padding: "40px 36px",
          opacity: cardOpacity,
          transform: `translate3d(0, ${cardY}px, 0) scale(${cardScale})`,
        }}
      >
        {/* Header Notes */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            paddingBottom: 28,
            borderBottom: "1.5px solid rgba(15, 23, 20, 0.08)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: FONT_SIZE.xs,
                fontWeight: 700,
                color: PALETTE.warm,
                letterSpacing: "0.04em",
              }}
            >
              {COPY.act2.tag}
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: FONT_SIZE.md,
                fontWeight: 800,
                color: PALETTE.ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.12,
                marginTop: 8,
              }}
            >
              {COPY.act2.title}
            </div>
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: FONT_SIZE.xs,
              fontWeight: 700,
              color: PALETTE.accent,
              backgroundColor: PALETTE.accentSoft,
              padding: "10px 20px",
              borderRadius: 999,
              fontVariantNumeric: "tabular-nums",
              flexShrink: 0,
            }}
          >
            {checkedCount}/{COPY.act2.items.length}
          </div>
        </div>

        {/* 3 Poin Checklist (tanpa nested backdropFilter) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 32 }}>
          {COPY.act2.items.map((item) => {
            const rowIn = spring({
              frame: Math.max(0, frame - item.appearLocal),
              fps,
              config: SPRING_SILKY,
            });
            const isChecked = frame >= item.checkLocal;
            const checkBounce = spring({
              frame: Math.max(0, frame - item.checkLocal),
              fps,
              config: SPRING_TACTILE,
            });
            const drawProg = interpolate(
              frame,
              [item.checkLocal, item.checkLocal + 14],
              [0, 1],
              CLAMP
            );

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "24px 24px",
                  borderRadius: 24,
                  backgroundColor: isChecked
                    ? "rgba(255, 255, 255, 0.62)"
                    : "rgba(255, 255, 255, 0.34)",
                  border: isChecked
                    ? "1.5px solid rgba(21, 128, 61, 0.28)"
                    : "1.5px solid rgba(255, 255, 255, 0.72)",
                  opacity: rowIn,
                  transform: `translate3d(0, ${interpolate(rowIn, [0, 1], [24, 0], CLAMP)}px, 0)`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: isChecked ? PALETTE.accent : "rgba(255, 255, 255, 0.8)",
                    border: isChecked
                      ? `2px solid ${PALETTE.accent}`
                      : "2.5px solid rgba(15, 23, 20, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: `scale(${isChecked ? interpolate(checkBounce, [0, 1], [0.7, 1], CLAMP) : 1})`,
                  }}
                >
                  {isChecked && (
                    <Icon
                      name="check"
                      size={32}
                      color={PALETTE.white}
                      drawProgress={drawProg}
                    />
                  )}
                </div>

                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 700,
                    color: PALETTE.ink,
                    lineHeight: 1.3,
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </GlassSurface>
    </SafeArea>
  );
};
