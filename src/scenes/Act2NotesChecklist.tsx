import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CHECKLIST_ITEMS } from "../data/videoData";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SAFE_ZONE, SPRING_SILKY, SPRING_TACTILE } from "../theme";
import { LiquidGlassCard, StrawberryEmblem } from "../components/LiquidGlassUI";

export const Act2NotesChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [258, 285], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const checkedCount = CHECKLIST_ITEMS.filter((item) => frame >= item.checkAt).length;
  const barPct = interpolate(frame, [45, 200], [0, 100], { ...CLAMP, easing: EASE_APPLE });

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE.paddingTop,
        paddingBottom: SAFE_ZONE.paddingBottom,
        paddingLeft: SAFE_ZONE.paddingLeft,
        paddingRight: SAFE_ZONE.paddingRight,
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `translateY(${interpolate(exit, [0, 1], [0, -34], CLAMP)}px) scale(${1 - exit * 0.03})`,
        filter: exit > 0.02 ? `blur(${exit * 10}px)` : "none",
      }}
    >
      <div
        style={{
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [68, 0], CLAMP)}px) scale(${interpolate(
            cardIn,
            [0, 1],
            [0.94, 1],
            CLAMP
          )})`,
        }}
      >
        <LiquidGlassCard borderRadius={40} sheenStart={10} style={{ padding: "44px 42px" }}>
          {/* Apple Notes / Reminders Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 28,
              borderBottom: "1.5px solid rgba(17, 26, 20, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <StrawberryEmblem size={54} />
              <div>
                <div
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLORS.BERRY,
                    letterSpacing: "0.08em",
                  }}
                >
                  CATATAN TANAM · SIMPAN
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    color: COLORS.INK,
                    marginTop: 2,
                  }}
                >
                  Cara Tanam Dataran Rendah
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.EMERALD,
                backgroundColor: COLORS.EMERALD_SOFT,
                padding: "10px 20px",
                borderRadius: 999,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {checkedCount}/4
            </div>
          </div>

          {/* 4 Checklist Rows with iOS Tactile Droplet Check */}
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 32 }}>
            {CHECKLIST_ITEMS.map((item, idx) => {
              const rowIn = spring({ frame: Math.max(0, frame - (14 + idx * 14)), fps, config: SPRING_SILKY });
              const isChecked = frame >= item.checkAt;
              const checkSpring = spring({
                frame: Math.max(0, frame - item.checkAt),
                fps,
                config: SPRING_TACTILE,
              });

              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 22,
                    opacity: rowIn,
                    transform: `translateY(${interpolate(rowIn, [0, 1], [22, 0], CLAMP)}px)`,
                    backgroundColor: isChecked
                      ? "rgba(255, 255, 255, 0.52)"
                      : "rgba(255, 255, 255, 0.24)",
                    borderRadius: 24,
                    padding: "22px 24px",
                    border: isChecked
                      ? "1.5px solid rgba(21, 128, 61, 0.25)"
                      : "1.5px solid rgba(255, 255, 255, 0.65)",
                  }}
                >
                  {/* iOS Circular Checkbox */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      backgroundColor: isChecked ? COLORS.EMERALD : "rgba(255, 255, 255, 0.7)",
                      border: isChecked
                        ? `2px solid ${COLORS.EMERALD}`
                        : "2.5px solid rgba(17, 26, 20, 0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 4,
                      transform: `scale(${isChecked ? interpolate(checkSpring, [0, 1], [0.65, 1], CLAMP) : 1})`,
                      boxShadow: isChecked ? "0 8px 18px rgba(21, 128, 61, 0.28)" : "none",
                    }}
                  >
                    {isChecked && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12.5L10 17.5L19 7.5"
                          stroke="#FFFFFF"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 31,
                        fontWeight: 800,
                        color: COLORS.INK,
                        lineHeight: 1.24,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 24,
                        fontWeight: 500,
                        color: COLORS.MUTED,
                        marginTop: 6,
                        lineHeight: 1.36,
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Footer Care Note + Progress Strip */}
          <div
            style={{
              marginTop: 32,
              backgroundColor: "rgba(255, 255, 255, 0.56)",
              borderRadius: 22,
              padding: "20px 24px",
              border: "1px solid rgba(255, 255, 255, 0.85)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.MONO,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.EMERALD,
                marginBottom: 12,
              }}
            >
              <span>TIPS: POTONG SULUR AWAL AGAR CEPAT BERBUAH</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(barPct)}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, backgroundColor: "rgba(17, 26, 20, 0.08)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${barPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.BERRY} 0%, ${COLORS.EMERALD} 100%)`,
                }}
              />
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </AbsoluteFill>
  );
};
