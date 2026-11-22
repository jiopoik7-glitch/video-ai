import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SAFE_ZONE, SPRING_SILKY } from "../theme";
import {
  BlurWords,
  IosTouchPointer,
  LiquidGlassCard,
  StrawberryPotArtwork,
} from "../components/LiquidGlassUI";

export const Act3InteractiveWidget: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [238, 265], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Slider ditarik mulus dari frame 45 -> 190 (Bibit Biasa -> Bibit Dataran Rendah)
  const prog = interpolate(frame, [45, 190], [0.06, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const adaptPct = Math.round(interpolate(prog, [0.06, 1], [32, 94], CLAMP));
  const sliderPct = interpolate(prog, [0.06, 1], [10, 90], CLAMP);
  const isReady = adaptPct >= 72;

  // Ring progress SVG
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - adaptPct / 100);

  // Sentuhan iOS menyeret slider
  const pointerOp = interpolate(frame, [24, 38, 206, 224], [0, 1, 1, 0], CLAMP);
  const pointerX = interpolate(frame, [24, 44, 190], [660, 210, 868], { ...CLAMP, easing: EASE_SMOOTH });
  const pointerY = interpolate(frame, [24, 44, 190], [1560, 1344, 1344], { ...CLAMP, easing: EASE_SMOOTH });
  const pressing = frame >= 44 && frame <= 190;

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE.paddingTop,
        paddingBottom: SAFE_ZONE.paddingBottom,
        paddingLeft: SAFE_ZONE.paddingLeft,
        paddingRight: SAFE_ZONE.paddingRight,
        justifyContent: "center",
        gap: 36,
        opacity: 1 - exit,
        transform: `scale(${1 - exit * 0.04})`,
        filter: exit > 0.02 ? `blur(${exit * 10}px)` : "none",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <BlurWords
          start={4}
          stagger={6}
          fontSize={62}
          words={[
            { text: "Beda" },
            { text: "bibit," },
            { text: "beda" },
            { text: "hasilnya.", berry: true, italic: true },
          ]}
        />
      </div>

      <div
        style={{
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [62, 0], CLAMP)}px)`,
        }}
      >
        <LiquidGlassCard borderRadius={40} sheenStart={12} style={{ padding: "40px 42px" }}>
          {/* Top Health-Style Metric + SVG Ring */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONTS.MONO, fontSize: 19, fontWeight: 700, color: COLORS.SUBTLE }}>
                ADAPTASI SUHU 31–34°C
              </div>
              <div
                style={{
                  fontFamily: FONTS.SANS,
                  fontSize: 112,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  color: COLORS.INK,
                  lineHeight: 1,
                  marginTop: 6,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {adaptPct}
                <span style={{ fontSize: 52, color: isReady ? COLORS.EMERALD : COLORS.BERRY }}>%</span>
              </div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontFamily: FONTS.MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: isReady ? COLORS.EMERALD : COLORS.BERRY,
                  backgroundColor: isReady ? COLORS.EMERALD_SOFT : COLORS.BERRY_SOFT,
                  padding: "8px 18px",
                  borderRadius: 999,
                }}
              >
                {isReady ? "RAJIN BERBUNGA & BERBUAH" : "RAWAN LAYU DI SUHU PANAS"}
              </div>
            </div>

            {/* Apple Health Style Adaptation Ring */}
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(17, 26, 20, 0.08)" strokeWidth="16" />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={isReady ? COLORS.EMERALD : COLORS.BERRY}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 80 80)"
              />
            </svg>
          </div>

          {/* Procedural Growing Strawberry Pot Box */}
          <div
            style={{
              marginTop: 28,
              height: 410,
              borderRadius: 30,
              backgroundColor: "rgba(255, 255, 255, 0.56)",
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StrawberryPotArtwork progress={prog} size={375} />
          </div>

          {/* Interactive Liquid Glass Slider */}
          <div style={{ marginTop: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.MONO,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.SUBTLE,
                marginBottom: 18,
              }}
            >
              <span>BIBIT BIASA</span>
              <span style={{ color: COLORS.EMERALD }}>BIBIT DATARAN RENDAH</span>
            </div>

            <div
              style={{
                position: "relative",
                height: 18,
                borderRadius: 999,
                backgroundColor: "rgba(17, 26, 20, 0.09)",
              }}
            >
              <div
                style={{
                  width: `${sliderPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.BERRY} 0%, ${COLORS.LEAF} 60%, ${COLORS.EMERALD} 100%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${sliderPct}%`,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: COLORS.WHITE,
                  border: `5px solid ${COLORS.EMERALD}`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 8px 20px rgba(21, 128, 61, 0.3)",
                }}
              />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      <IosTouchPointer x={pointerX} y={pointerY} opacity={pointerOp} pressing={pressing} />
    </AbsoluteFill>
  );
};
