import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY } from "../theme";
import { BlurWords, GrowingGardenPlant, SmoothCursor } from "../components/BotanicalPrimitives";

export const Scene3Growth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 14), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [328, 360], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Kursor menyeret slider dari frame 68 -> 248 untuk menumbuhkan tanaman secara real-time
  const growProgress = interpolate(frame, [68, 248], [0.06, 1], { ...CLAMP, easing: EASE_SMOOTH });
  const dayNumber = Math.round(interpolate(growProgress, [0.06, 1], [1, 60], CLAMP));
  const sliderPct = interpolate(growProgress, [0.06, 1], [8, 92], CLAMP);

  const stageLabel =
    dayNumber < 16
      ? "Fase Kecambah"
      : dayNumber < 42
      ? "Daun Rimbun"
      : "Siap Panen Segar";

  // Kursor mengarah ke knob slider lalu menarik ke kanan
  const cursorOpacity = interpolate(frame, [36, 52, 280, 302], [0, 1, 1, 0], CLAMP);
  const knobStartX = 1045;
  const knobEndX = 1585;
  const cursorX = interpolate(
    frame,
    [36, 66, 248],
    [1420, knobStartX, knobEndX],
    { ...CLAMP, easing: EASE_SMOOTH }
  );
  const cursorY = interpolate(
    frame,
    [36, 66, 248],
    [940, 772, 772],
    { ...CLAMP, easing: EASE_SMOOTH }
  );
  const isDragging = frame >= 66 && frame <= 248;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 130px",
        opacity: 1 - exit,
        filter: exit > 0.02 ? `blur(${exit * 14}px)` : "none",
      }}
    >
      {/* Headline Atas */}
      <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center" }}>
        <BlurWords
          start={4}
          stagger={7}
          fontSize={62}
          words={[
            { text: "Setiap" },
            { text: "rawatan" },
            { text: "kecil" },
            { text: "=" },
            { text: "tumbuh", accent: true, italic: true },
            { text: "nyata." },
          ]}
        />
      </div>

      {/* Layout 2 Kolom (DNA Referensi frame 0:20, dirombak total jadi Botani) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: 72,
          alignItems: "center",
          width: "100%",
          marginTop: 100,
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [44, 0], CLAMP)}px)`,
        }}
      >
        {/* Kolom Kiri: Counter Hari Tumbuh */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 24, fontWeight: 600, color: COLORS.SUBTLE }}>
            PROGRES PERTUMBUHAN
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              fontFamily: FONTS.SANS,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: 172,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: COLORS.INK,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(dayNumber).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 44, fontWeight: 700, color: COLORS.EMERALD }}>Hari</span>
          </div>

          {/* Pill Status Botani */}
          <div
            style={{
              backgroundColor: dayNumber >= 45 ? COLORS.EMERALD : COLORS.INK,
              color: "#FFFFFF",
              fontFamily: FONTS.MONO,
              fontSize: 22,
              fontWeight: 600,
              padding: "14px 26px",
              borderRadius: 16,
              marginTop: 8,
              boxShadow: "0 14px 32px rgba(17, 26, 20, 0.16)",
            }}
          >
            Status: <span style={{ color: COLORS.MINT }}>{stageLabel}</span>
          </div>

          <div
            style={{
              fontFamily: FONTS.SANS,
              fontSize: 25,
              lineHeight: 1.5,
              color: COLORS.MUTED,
              marginTop: 10,
              maxWidth: 520,
            }}
          >
            Dari satu benih yang dirawat sabar, pelan-pelan berubah jadi kebun hidup yang selalu bikin tenang.
          </div>
        </div>

        {/* Kolom Kanan: Preview Tanaman Tumbuh + Slider Interaktif */}
        <div
          style={{
            backgroundColor: COLORS.WHITE,
            borderRadius: 36,
            padding: "42px 48px 38px 48px",
            border: `1.5px solid ${COLORS.BORDER}`,
            boxShadow: "0 34px 86px rgba(17, 26, 20, 0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* Area Kanvas Tanaman */}
          <div
            style={{
              width: "100%",
              height: 360,
              borderRadius: 26,
              background:
                "linear-gradient(180deg, #F4FAF5 0%, #FFFFFF 100%)",
              border: `1px solid ${COLORS.BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Cahaya matahari sudut */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(253, 224, 71, 0.35) 0%, rgba(253, 224, 71, 0) 70%)",
              }}
            />
            <GrowingGardenPlant progress={growProgress} size={325} />
          </div>

          {/* Interactive Timeline Slider */}
          <div style={{ width: "100%", padding: "0 8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.MONO,
                fontSize: 16,
                color: COLORS.SUBTLE,
                marginBottom: 14,
              }}
            >
              <span>BENIH</span>
              <span>TUNAS</span>
              <span>PANEN</span>
            </div>
            <div
              style={{
                position: "relative",
                height: 12,
                borderRadius: 999,
                backgroundColor: "#E5ECE7",
              }}
            >
              <div
                style={{
                  width: `${sliderPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.LEAF} 0%, ${COLORS.EMERALD} 100%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${sliderPct}%`,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: COLORS.WHITE,
                  border: `5px solid ${COLORS.EMERALD}`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 6px 16px rgba(21, 128, 61, 0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOpacity} clicking={isDragging} />
    </AbsoluteFill>
  );
};
