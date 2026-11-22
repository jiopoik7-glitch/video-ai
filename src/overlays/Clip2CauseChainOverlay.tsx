import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CHAIN_STEPS } from "../data/editData";
import { CLAMP, COLORS, EASE_LAND, FONT_SANS, SPRING_CRISP, SPRING_SILKY } from "../theme";
import { EditIcon, GlassPill } from "../components/GlassUI";

export const Clip2CauseChainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barIn = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [338, 362], [0, 1], { ...CLAMP, easing: EASE_LAND });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 44,
          right: 44,
        }}
      >
        <GlassPill
          borderRadius={30}
          style={{
            padding: "26px 26px",
            opacity: barIn * (1 - exit),
            transform: `translate3d(0, ${interpolate(barIn, [0, 1], [-36, 0], CLAMP) - exit * 24}px, 0)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 21,
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: COLORS.AMBER,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            KENAPA DAUN JADI HITAM?
          </div>

          {/* 3-Step Sequential Cause-Effect Chain */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            {CHAIN_STEPS.map((step, idx) => {
              const active = frame >= step.activateAtLocal;
              const pop = spring({
                frame: Math.max(0, frame - step.activateAtLocal),
                fps,
                config: SPRING_CRISP,
              });
              const isLast = idx === CHAIN_STEPS.length - 1;
              const pillColor =
                idx === 2 ? COLORS.CORAL : idx === 1 ? COLORS.AMBER : COLORS.LIME_SOFT;

              return (
                <React.Fragment key={step.id}>
                  <div
                    style={{
                      flex: 1,
                      padding: "16px 12px",
                      borderRadius: 18,
                      textAlign: "center",
                      backgroundColor: active
                        ? "rgba(255, 255, 255, 0.16)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: active
                        ? `1.5px solid ${pillColor}`
                        : "1px solid rgba(255, 255, 255, 0.14)",
                      transform: `scale(${active ? interpolate(pop, [0, 0.6, 1], [0.92, 1.04, 1], CLAMP) : 0.96})`,
                      opacity: active ? 1 : 0.45,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 27,
                        fontWeight: 800,
                        color: active ? COLORS.WHITE : COLORS.WHITE_MUTED,
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                  {!isLast && (
                    <div style={{ opacity: active ? 0.95 : 0.35, flexShrink: 0 }}>
                      <EditIcon name="arrow" size={24} color={COLORS.WHITE} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 25,
              fontWeight: 500,
              color: COLORS.WHITE_MUTED,
              marginTop: 16,
              opacity: interpolate(frame, [210, 240], [0, 1], CLAMP),
            }}
          >
            Jelaga hitam menutup permukaan daun dan bikin pertumbuhan terhambat.
          </div>
        </GlassPill>
      </div>
    </AbsoluteFill>
  );
};
