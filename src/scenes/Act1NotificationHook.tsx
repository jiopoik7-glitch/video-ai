import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SAFE_ZONE, SPRING_SILKY, SPRING_TACTILE } from "../theme";
import { BlurWords, LiquidGlassCard, StrawberryEmblem } from "../components/LiquidGlassUI";

export const Act1NotificationHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const notifDrop = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_TACTILE });
  const notifY = interpolate(notifDrop, [0, 1], [-190, 0], CLAMP);
  const subIn = spring({ frame: Math.max(0, frame - 108), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [168, 195], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE.paddingTop,
        paddingBottom: SAFE_ZONE.paddingBottom,
        paddingLeft: SAFE_ZONE.paddingLeft,
        paddingRight: SAFE_ZONE.paddingRight,
        justifyContent: "space-between",
        opacity: 1 - exit,
        transform: `scale(${1 + exit * 0.04})`,
        filter: exit > 0.02 ? `blur(${exit * 12}px)` : "none",
      }}
    >
      {/* iOS Liquid Glass Notification Banner */}
      <div
        style={{
          transform: `translateY(${notifY}px) scale(${interpolate(notifDrop, [0, 1], [0.92, 1], CLAMP)})`,
          opacity: interpolate(notifDrop, [0, 0.35, 1], [0, 0.9, 1], CLAMP),
        }}
      >
        <LiquidGlassCard borderRadius={28} sheenStart={14} style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 82,
                height: 82,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                border: "1px solid rgba(225, 29, 72, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <StrawberryEmblem size={56} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: COLORS.BERRY,
                  }}
                >
                  PENGINGAT KEBUN · SEFLORNER
                </span>
                <span style={{ fontFamily: FONTS.MONO, fontSize: 17, color: COLORS.SUBTLE }}>
                  Baru saja
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 31,
                  fontWeight: 800,
                  color: COLORS.INK,
                  marginTop: 6,
                  lineHeight: 1.24,
                }}
              >
                Stroberi cuma hidup di puncak?
              </div>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 25,
                  fontWeight: 500,
                  color: COLORS.MUTED,
                  marginTop: 4,
                  lineHeight: 1.35,
                }}
              >
                Faktanya, di kota panas juga bisa berbuah lebat.
              </div>
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Main Kinetic Blur-In Headline di Tengah Layar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
          padding: "0 14px",
        }}
      >
        <BlurWords
          start={52}
          stagger={6}
          fontSize={74}
          words={[
            { text: "Tanam" },
            { text: "stroberi", berry: true },
            { text: "di" },
            { text: "dataran", emerald: true, italic: true },
            { text: "rendah,", emerald: true, italic: true },
            { text: "ternyata" },
            { text: "bisa!" },
          ]}
        />

        <div
          style={{
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [18, 0], CLAMP)}px)`,
            fontFamily: FONTS.SANS,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.MUTED,
            lineHeight: 1.44,
            maxWidth: 820,
          }}
        >
          Kuncinya ada di pilihan bibit adaptif dan 4 langkah perawatan simpel ini.
        </div>
      </div>
    </AbsoluteFill>
  );
};
