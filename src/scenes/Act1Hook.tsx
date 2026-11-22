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
} from "../theme";
import { BlurWords, GlassSurface, Icon, SafeArea } from "../components/LiquidGlassUI";

export const Act1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = ACTS.act1.duration;

  const notifDrop = spring({
    frame: Math.max(0, frame - TIMELINE.act1.notifStart),
    fps,
    config: SPRING_SILKY,
  });

  const textFade = interpolate(
    frame,
    [TIMELINE.act1.notifTextStart, TIMELINE.act1.notifTextStart + 18],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const exitProgress = interpolate(
    frame,
    [TIMELINE.act1.exitStart, total - 1],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const notifY = interpolate(notifDrop, [0, 1], [-180, 0], CLAMP) - exitProgress * 36;
  const notifScale = interpolate(notifDrop, [0, 1], [0.95, 1], CLAMP);
  const notifOpacity = interpolate(notifDrop, [0, 0.25, 1], [0, 0.9, 1], CLAMP) * (1 - exitProgress);

  return (
    <SafeArea style={{ justifyContent: "space-between", gap: 40 }}>
      {/* Notification Banner: animasi opacity & transform langsung pada GlassSurface */}
      <GlassSurface
        variant="notif"
        sheenStartFrame={TIMELINE.act1.notifStart + 8}
        style={{
          padding: "32px 32px",
          opacity: notifOpacity,
          transform: `translate3d(0, ${notifY}px, 0) scale(${notifScale})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              border: "1.5px solid rgba(194, 65, 12, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="tomato" size={42} color={PALETTE.warm} />
          </div>

          <div style={{ flex: 1, opacity: textFade }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: FONT_SIZE.xs,
                fontWeight: 600,
                color: PALETTE.inkMuted,
                marginBottom: 8,
              }}
            >
              {COPY.act1.notifHeader}
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
              {COPY.act1.notifBody}
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* Main Kinetic Headline (96px, maks 3 baris, 1 kata Instrument Serif Italic) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          opacity: 1 - exitProgress,
          transform: `translate3d(0, ${-exitProgress * 28}px, 0)`,
        }}
      >
        <BlurWords
          words={COPY.act1.headline}
          startFrame={TIMELINE.act1.headlineStart}
          stagger={5}
          fontSize={FONT_SIZE.xl}
          align="left"
        />
      </div>
    </SafeArea>
  );
};
