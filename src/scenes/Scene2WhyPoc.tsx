import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { POC_PILLS } from "../data/pocData";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, PocDropEmblem } from "../components/BotanicalUI";

export const Scene2WhyPoc: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [388, 420], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const absorbProg = interpolate(frame, [42, 180], [0, 1], { ...CLAMP, easing: EASE_APPLE });
  const absorbPct = Math.round(interpolate(absorbProg, [0, 1], [12, 96], CLAMP));

  // 3D Tilt & naik halus ke atas saat 3 Floating Pills manfaat muncul di bawah (Layout 9:16)
  const tilt = interpolate(frame, [190, 244], [0, 1], { ...CLAMP, easing: EASE_APPLE });
  const shiftY = interpolate(tilt, [0, 1], [0, -245], CLAMP);
  const rotX = interpolate(tilt, [0, 1], [0, 10], CLAMP);
  const rotY = interpolate(tilt, [0, 1], [0, -5], CLAMP);
  const scaleTilt = interpolate(tilt, [0, 1], [1, 0.91], CLAMP);

  const checklist = [
    { text: "Air biasa tidak mencukupi nutrisi fase buah", doneAt: 54 },
    { text: "Bentuk cair cepat serap lewat daun & akar", doneAt: 102 },
    { text: "Takaran pump praktis, aman bagi pemula", doneAt: 150 },
  ];

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        padding: "130px 64px 200px 64px",
        opacity: 1 - exit,
        filter: exit > 0.02 ? `blur(${exit * 14}px)` : "none",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", marginBottom: 42 }}>
        <BlurWords
          start={4}
          stagger={7}
          fontSize={62}
          words={[
            { text: "Nutrisi" },
            { text: "cair,", accent: true, italic: true },
            { text: "hasil" },
            { text: "lebih" },
            { text: "cepat", accent: true },
            { text: "terserap." },
          ]}
        />
      </div>

      {/* Stage 3D Vertical */}
      <div
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Kartu Edukasi Utama */}
        <div
          style={{
            width: "100%",
            backgroundColor: COLORS.WHITE,
            borderRadius: 36,
            padding: "40px 42px",
            border: `1.5px solid ${COLORS.BORDER}`,
            boxShadow: "0 34px 84px rgba(17, 26, 20, 0.11)",
            opacity: cardIn,
            transform: `perspective(1400px) translateY(${
              interpolate(cardIn, [0, 1], [65, 0], CLAMP) + shiftY
            }px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${
              interpolate(cardIn, [0, 1], [0.93, 1], CLAMP) * scaleTilt
            })`,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 22,
              borderBottom: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <PocDropEmblem size={54} />
              <div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 30, fontWeight: 800, color: COLORS.INK }}>
                  Fakta Nutrisi Pemula
                </div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 18, color: COLORS.SUBTLE }}>
                  FOLIAR DAUN + KOCOR MEDIA
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: COLORS.SAGE_SOFT,
                color: COLORS.EMERALD,
                fontFamily: FONTS.MONO,
                fontSize: 20,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
              }}
            >
              100% Organik
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {checklist.map((item, idx) => {
              const p = spring({ frame: Math.max(0, frame - (20 + idx * 24)), fps, config: SPRING_SILKY });
              const checked = frame >= item.doneAt;
              return (
                <div
                  key={item.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [16, 0], CLAMP)}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      backgroundColor: checked ? COLORS.EMERALD : COLORS.SAGE_SOFT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke={checked ? "#FFFFFF" : COLORS.SUBTLE}
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 28,
                      fontWeight: 600,
                      color: checked ? COLORS.INK : COLORS.MUTED,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar Kecepatan Serap */}
          <div
            style={{
              backgroundColor: COLORS.CANVAS,
              borderRadius: 22,
              padding: "22px 26px",
              border: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.SANS,
                fontSize: 23,
                fontWeight: 700,
                color: COLORS.MUTED,
                marginBottom: 14,
              }}
            >
              <span>Efisiensi Serapan Nutrisi</span>
              <span style={{ fontFamily: FONTS.MONO, color: COLORS.EMERALD, fontVariantNumeric: "tabular-nums" }}>
                {absorbPct}% Optimal
              </span>
            </div>
            <div style={{ height: 16, borderRadius: 999, backgroundColor: "rgba(21, 128, 61, 0.12)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${absorbPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.AMBER} 0%, ${COLORS.LEAF} 55%, ${COLORS.EMERALD} 100%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 3 Floating Pills Manfaat di Bagian Bawah */}
        <div
          style={{
            position: "absolute",
            bottom: 34,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {POC_PILLS.map((pill, idx) => {
            const p = spring({ frame: Math.max(0, frame - pill.start), fps, config: SPRING_SNAPPY });
            const bob = Math.sin(frame / 22 + idx * 1.2) * 4;
            return (
              <div
                key={pill.title}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [60, 0], CLAMP) + bob}px) scale(${interpolate(
                    p,
                    [0, 1],
                    [0.92, 1],
                    CLAMP
                  )})`,
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 26,
                  padding: "24px 32px",
                  border: `1.5px solid ${COLORS.BORDER}`,
                  boxShadow: "0 18px 42px rgba(17, 26, 20, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: pill.color,
                      boxShadow: `0 0 0 7px ${pill.color}22`,
                    }}
                  />
                  <span style={{ fontFamily: FONTS.SANS, fontSize: 31, fontWeight: 700, color: COLORS.INK }}>
                    {pill.title}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 19,
                    fontWeight: 700,
                    color: pill.color,
                    backgroundColor: `${pill.color}18`,
                    padding: "8px 18px",
                    borderRadius: 999,
                  }}
                >
                  {pill.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
