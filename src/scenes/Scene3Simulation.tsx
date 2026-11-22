import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY } from "../theme";
import { BlurWords, FruitTreeSimulation, SmoothCursor } from "../components/BotanicalUI";

export const Scene3Simulation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [328, 360], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const simProg = interpolate(frame, [66, 246], [0.05, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const fruitRetention = Math.round(interpolate(simProg, [0.05, 1], [28, 94], CLAMP));
  const weekNum = Math.round(interpolate(simProg, [0.05, 1], [1, 6], CLAMP));
  const sliderPct = interpolate(simProg, [0.05, 1], [10, 90], CLAMP);

  const isOptimal = fruitRetention >= 70;

  // Kursor menyeret slider secara horizontal di tengah-bawah layar 9:16
  const cursorOp = interpolate(frame, [36, 52, 278, 300], [0, 1, 1, 0], CLAMP);
  const cursorX = interpolate(frame, [36, 64, 246], [760, 215, 865], { ...CLAMP, easing: EASE_SMOOTH });
  const cursorY = interpolate(frame, [36, 64, 246], [1640, 1408, 1408], { ...CLAMP, easing: EASE_SMOOTH });
  const dragging = frame >= 64 && frame <= 246;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        padding: "130px 64px 200px 64px",
        opacity: 1 - exit,
        filter: exit > 0.02 ? `blur(${exit * 14}px)` : "none",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", marginBottom: 40 }}>
        <BlurWords
          start={4}
          stagger={7}
          fontSize={62}
          words={[
            { text: "Beda" },
            { text: "hasil" },
            { text: "rawatan" },
            { text: "rutin.", accent: true, italic: true },
          ]}
        />
      </div>

      {/* Main Interactive Card */}
      <div
        style={{
          width: "100%",
          backgroundColor: COLORS.WHITE,
          borderRadius: 40,
          padding: "42px 44px",
          border: `1.5px solid ${COLORS.BORDER}`,
          boxShadow: "0 36px 90px rgba(17, 26, 20, 0.11)",
          display: "flex",
          flexDirection: "column",
          gap: 32,
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [54, 0], CLAMP)}px)`,
        }}
      >
        {/* Top Metric Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: FONTS.MONO, fontSize: 20, fontWeight: 700, color: COLORS.SUBTLE }}>
              DAYA TAHAN BUNGA & BUAH
            </div>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 120,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                color: COLORS.INK,
                lineHeight: 1,
                marginTop: 6,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fruitRetention}
              <span style={{ fontSize: 56, color: isOptimal ? COLORS.EMERALD : COLORS.AMBER }}>%</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: isOptimal ? COLORS.SAGE_SOFT : COLORS.DANGER_SOFT,
              color: isOptimal ? COLORS.EMERALD : COLORS.DANGER,
              border: `1.5px solid ${isOptimal ? COLORS.BORDER_STRONG : "rgba(220, 38, 38, 0.25)"}`,
              borderRadius: 22,
              padding: "16px 24px",
              textAlign: "right",
            }}
          >
            <div style={{ fontFamily: FONTS.MONO, fontSize: 18, fontWeight: 700 }}>MINGGU 0{weekNum}</div>
            <div style={{ fontFamily: FONTS.SANS, fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {isOptimal ? "Berbuah Lebat" : "Rawan Rontok"}
            </div>
          </div>
        </div>

        {/* Procedural Fruit Tree Preview */}
        <div
          style={{
            width: "100%",
            height: 460,
            borderRadius: 30,
            background: "linear-gradient(180deg, #FFFDF5 0%, #F2FBF4 100%)",
            border: `1px solid ${COLORS.BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <FruitTreeSimulation progress={simProg} size={430} />
        </div>

        {/* Interactive Slider */}
        <div style={{ padding: "4px 6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: FONTS.MONO,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.SUBTLE,
              marginBottom: 18,
            }}
          >
            <span>AIR BIASA</span>
            <span style={{ color: COLORS.EMERALD }}>RUTIN POC + FRUIT EXPERT</span>
          </div>

          <div style={{ position: "relative", height: 14, borderRadius: 999, backgroundColor: "#E5ECE7" }}>
            <div
              style={{
                width: `${sliderPct}%`,
                height: "100%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${COLORS.AMBER} 0%, ${COLORS.LEAF} 55%, ${COLORS.EMERALD} 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${sliderPct}%`,
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: COLORS.WHITE,
                border: `6px solid ${COLORS.EMERALD}`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 6px 16px rgba(21, 128, 61, 0.32)",
              }}
            />
          </div>
        </div>

        {/* Dosis Praktis Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div
            style={{
              backgroundColor: COLORS.AMBER_SOFT,
              borderRadius: 20,
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.AMBER }}>
              POC BUAH (FOLIAR)
            </span>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 800, color: COLORS.INK }}>
              2 Pump / Liter Air
            </span>
          </div>
          <div
            style={{
              backgroundColor: COLORS.SAGE_SOFT,
              borderRadius: 20,
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.EMERALD }}>
              FRUIT EXPERT (KOCOR)
            </span>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 26, fontWeight: 800, color: COLORS.INK }}>
              4 Gram / Liter Air
            </span>
          </div>
        </div>
      </div>

      <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={dragging} />
    </AbsoluteFill>
  );
};
