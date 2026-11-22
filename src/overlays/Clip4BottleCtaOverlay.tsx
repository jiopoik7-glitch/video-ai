import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BOTTLE_SPECS } from "../data/editData";
import { CLAMP, COLORS, FONT_SANS, SPRING_CRISP, SPRING_SILKY } from "../theme";
import { EditIcon, GlassPill } from "../components/GlassUI";

export const Clip4BottleCtaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaIn = spring({ frame: Math.max(0, frame - 72), fps, config: SPRING_SILKY });
  // Haptic press pulse at local frame 118 (global frame 1126 = 18.76s, right as voice says "cek di keranjang kuning")
  const ctaPulse = interpolate(frame, [116, 122, 130, 138], [1, 0.94, 1.03, 1], CLAMP);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top Safe Area: 3 Compact Spec Pills (leaving the real BIVI INFARM bottle center 100% clear!) */}
      <div
        style={{
          position: "absolute",
          top: 184,
          left: 44,
          right: 44,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {BOTTLE_SPECS.map((sp) => {
          const p = spring({
            frame: Math.max(0, frame - sp.appearLocal),
            fps,
            config: SPRING_CRISP,
          });
          return (
            <GlassPill
              key={sp.label}
              borderRadius={999}
              style={{
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: p,
                transform: `translate3d(0, ${interpolate(p, [0, 1], [-22, 0], CLAMP)}px, 0) scale(${interpolate(
                  p,
                  [0, 1],
                  [0.9, 1],
                  CLAMP
                )})`,
              }}
            >
              <EditIcon name="check" size={22} color={COLORS.EMERALD} />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 25,
                  fontWeight: 700,
                  color: COLORS.WHITE,
                  whiteSpace: "nowrap",
                }}
              >
                {sp.label}
              </span>
            </GlassPill>
          );
        })}
      </div>

      {/* Bottom Safe CTA Pill: positioned at bottom 250px (y = 1566..1670) -> BELOW burned-in subtitle (~y 1440) and ABOVE TikTok Yellow Basket! */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          left: 56,
          right: 56,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 104,
            borderRadius: 999,
            background: "linear-gradient(180deg, rgba(34, 197, 94, 0.94) 0%, rgba(21, 128, 61, 0.94) 100%)",
            border: "1.5px solid rgba(255, 255, 255, 0.45)",
            boxShadow:
              "0 20px 48px rgba(0, 0, 0, 0.36), inset 0 1.5px 1px rgba(255, 255, 255, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: ctaIn,
            transform: `translate3d(0, ${interpolate(ctaIn, [0, 1], [36, 0], CLAMP)}px, 0) scale(${ctaPulse})`,
          }}
        >
          <EditIcon name="bag" size={32} color="#FFFFFF" />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.015em",
              color: COLORS.WHITE,
            }}
          >
            Cek Keranjang Kuning
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
