import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_LAND, FONT_SANS, SPRING_SILKY } from "../theme";
import { EditIcon, GlassPill } from "../components/GlassUI";

export const Clip3SprayOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SILKY });
  const exit = interpolate(frame, [286, 310], [0, 1], { ...CLAMP, easing: EASE_LAND });

  // Subtle glow pulse synced to spray action
  const shieldPulse = 1 + Math.sin(frame * 0.14) * 0.04;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 52,
          right: 52,
        }}
      >
        <GlassPill
          borderRadius={30}
          style={{
            padding: "24px 30px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: cardIn * (1 - exit),
            transform: `translate3d(0, ${interpolate(cardIn, [0, 1], [-34, 0], CLAMP) - exit * 24}px, 0)`,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "rgba(34, 197, 94, 0.22)",
              border: `1.5px solid ${COLORS.EMERALD}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transform: `scale(${shieldPulse})`,
            }}
          >
            <EditIcon name="spray" size={36} color={COLORS.LIME_SOFT} />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 21,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: COLORS.LIME_SOFT,
                textTransform: "uppercase",
              }}
            >
              SOLUSI PRAKTIS · INFARM
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: COLORS.WHITE,
                lineHeight: 1.18,
                marginTop: 4,
              }}
            >
              BIVI · Ready To Use
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 25,
                fontWeight: 500,
                color: COLORS.WHITE_MUTED,
                marginTop: 4,
              }}
            >
              Tinggal semprot, bantu jaga daun muda.
            </div>
          </div>
        </GlassPill>
      </div>
    </AbsoluteFill>
  );
};
