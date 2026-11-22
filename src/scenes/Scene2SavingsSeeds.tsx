import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SEED_COLLECTION } from "../data/seflornerData";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, SeflornerLeafEmblem } from "../components/BotanicalPrimitives";

export const Scene2SavingsSeeds: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [388, 420], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Progress bar tabungan perlahan terisi (frame 42 -> 185)
  const saveProgress = interpolate(frame, [42, 182], [0, 1], { ...CLAMP, easing: EASE_APPLE });
  const savePct = Math.round(saveProgress * 100);
  const seedCount = Math.round(interpolate(saveProgress, [0, 1], [1, 24], CLAMP));

  // Efek 3D tilt & geser ke kiri saat kartu koleksi bibit muncul di kanan (DNA referensi!)
  const tilt = interpolate(frame, [192, 246], [0, 1], { ...CLAMP, easing: EASE_APPLE });
  const cardShiftX = interpolate(tilt, [0, 1], [0, -255], CLAMP);
  const cardRotY = interpolate(tilt, [0, 1], [0, 11], CLAMP);
  const cardRotX = interpolate(tilt, [0, 1], [0, 3], CLAMP);
  const cardScale = interpolate(tilt, [0, 1], [1, 0.93], CLAMP);

  const steps = [
    { label: "Mulai dari beberapa pot di kebun kecil", doneAt: 58 },
    { label: "Menyisihkan tabungan perlahan setiap minggu", doneAt: 105 },
    { label: "Membeli koleksi bibit tanaman pilihan", doneAt: 155 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 110px",
        opacity: 1 - exit,
        filter: exit > 0.02 ? `blur(${exit * 14}px)` : "none",
      }}
    >
      {/* Headline Atas */}
      <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center" }}>
        <BlurWords
          start={4}
          stagger={7}
          fontSize={58}
          words={[
            { text: "Perlahan" },
            { text: "menabung,", accent: true },
            { text: "koleksi" },
            { text: "bibit", italic: true, accent: true },
            { text: "bertambah." },
          ]}
        />
      </div>

      {/* Stage Utama: Botanical Ledger Card + Floating Seed Pills */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 540,
          marginTop: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Kartu Jurnal Kebun Botani (Pengganti Terminal Coding — hangat, elegan, 100% relevan perkebunan) */}
        <div
          style={{
            width: 820,
            backgroundColor: COLORS.WHITE,
            borderRadius: 34,
            padding: "40px 46px",
            border: `1.5px solid ${COLORS.BORDER}`,
            boxShadow: "0 36px 88px rgba(17, 26, 20, 0.11), 0 4px 12px rgba(17, 26, 20, 0.04)",
            opacity: cardIn,
            transform: `perspective(1400px) translateX(${cardShiftX}px) translateY(${interpolate(
              cardIn,
              [0, 1],
              [60, 0],
              CLAMP
            )}px) rotateY(${cardRotY}deg) rotateX(${cardRotX}deg) scale(${
              interpolate(cardIn, [0, 1], [0.92, 1], CLAMP) * cardScale
            })`,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Header Jurnal */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 22,
              borderBottom: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <SeflornerLeafEmblem size={42} />
              <div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 24, fontWeight: 800, color: COLORS.INK }}>
                  Catatan Kebun Seflorner
                </div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 15, color: COLORS.SUBTLE }}>
                  2024 → SEKARANG · JURNAL TABUNGAN BIBIT
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: COLORS.SAGE_SOFT,
                color: COLORS.EMERALD,
                fontFamily: FONTS.MONO,
                fontSize: 18,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(seedCount).padStart(2, "0")} Varietas
            </div>
          </div>

          {/* Checklist Perjalanan Menabung */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((st, idx) => {
              const p = spring({ frame: Math.max(0, frame - (22 + idx * 24)), fps, config: SPRING_SILKY });
              const checked = frame >= st.doneAt;
              return (
                <div
                  key={st.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [16, 0], CLAMP)}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: checked ? COLORS.EMERALD : COLORS.SAGE_SOFT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke={checked ? "#FFFFFF" : COLORS.SUBTLE}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 25,
                      fontWeight: 600,
                      color: checked ? COLORS.INK : COLORS.MUTED,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bar Tabungan Bibit Smooth */}
          <div
            style={{
              backgroundColor: COLORS.CANVAS,
              borderRadius: 20,
              padding: "22px 26px",
              border: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.SANS,
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.MUTED,
                marginBottom: 14,
              }}
            >
              <span>Target Tabungan Koleksi Bibit</span>
              <span style={{ fontFamily: FONTS.MONO, color: COLORS.EMERALD, fontVariantNumeric: "tabular-nums" }}>
                {savePct}% Tercapai
              </span>
            </div>
            <div
              style={{
                height: 16,
                borderRadius: 999,
                backgroundColor: "rgba(21, 128, 61, 0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${savePct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.LEAF} 0%, ${COLORS.EMERALD} 100%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 4 Floating Seed Pills di Kanan (muncul elegan saat jurnal miring 3D) */}
        <div
          style={{
            position: "absolute",
            right: 42,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: 470,
          }}
        >
          {SEED_COLLECTION.map((seed, idx) => {
            const p = spring({ frame: Math.max(0, frame - seed.start), fps, config: SPRING_SNAPPY });
            const bob = Math.sin(frame / 22 + idx * 1.1) * 4;
            return (
              <div
                key={seed.name}
                style={{
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [68, 0], CLAMP)}px) translateY(${bob}px) scale(${interpolate(
                    p,
                    [0, 1],
                    [0.9, 1],
                    CLAMP
                  )})`,
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 24,
                  padding: "20px 26px",
                  border: `1px solid ${COLORS.BORDER}`,
                  boxShadow: "0 18px 40px rgba(17, 26, 20, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: seed.color,
                      boxShadow: `0 0 0 6px ${seed.color}22`,
                    }}
                  />
                  <span style={{ fontFamily: FONTS.SANS, fontSize: 27, fontWeight: 700, color: COLORS.INK }}>
                    {seed.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 16,
                    fontWeight: 600,
                    color: seed.color,
                    backgroundColor: `${seed.color}16`,
                    padding: "7px 14px",
                    borderRadius: 999,
                  }}
                >
                  {seed.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
