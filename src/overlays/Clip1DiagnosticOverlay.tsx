import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_LAND, FONT_SANS, SPRING_CRISP, SPRING_SILKY } from "../theme";
import { EditIcon, GlassPill } from "../components/GlassUI";

export const Clip1DiagnosticOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SILKY });
  const ringIn = spring({ frame: Math.max(0, frame - 46), fps, config: SPRING_CRISP });
  const lineDraw = interpolate(frame, [54, 82], [0, 1], { ...CLAMP, easing: EASE_LAND });
  const tagIn = spring({ frame: Math.max(0, frame - 68), fps, config: SPRING_CRISP });
  const exit = interpolate(frame, [306, 330], [0, 1], { ...CLAMP, easing: EASE_LAND });

  // Gentle radar pulse around the exact mealybug spot on the shoot (~x: 585, y: 685)
  const pulse = (frame % 70) / 70;
  const ringScale = 1 + pulse * 0.45;
  const ringPulseOp = (1 - pulse) * 0.6;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top Safe Area Editorial Hook Card (keeps center & bottom burned-in subtitle 100% clear) */}
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 52,
          right: 52,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GlassPill
          borderRadius={30}
          style={{
            width: "100%",
            padding: "26px 32px",
            opacity: headerIn * (1 - exit),
            transform: `translate3d(0, ${interpolate(headerIn, [0, 1], [-36, 0], CLAMP) - exit * 24}px, 0)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <EditIcon name="alert" size={24} color={COLORS.CORAL} />
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: COLORS.CORAL,
                textTransform: "uppercase",
              }}
            >
              DIAGNOSA HAMA · SEFLORNER
            </span>
          </div>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 46,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: COLORS.WHITE,
            }}
          >
            Jangan sepelekan bintik putih ini.
          </div>
        </GlassPill>
      </div>

      {/* Precision Optical Callout Ring & Leader Line pointing directly at the white mealybug! */}
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        fill="none"
        style={{ position: "absolute", inset: 0, opacity: (1 - exit) * ringIn }}
      >
        {/* Expanding radar halo */}
        <circle
          cx="585"
          cy="685"
          r={56 * ringScale}
          stroke={COLORS.CORAL}
          strokeWidth="2.5"
          opacity={ringPulseOp}
        />
        {/* Crisp focus ring */}
        <circle
          cx="585"
          cy="685"
          r={52 * interpolate(ringIn, [0, 1], [1.4, 1], CLAMP)}
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeDasharray="16 10"
        />
        <circle cx="585" cy="685" r="7" fill={COLORS.CORAL} />

        {/* Clean editorial leader line up-right */}
        <path
          d="M624 646 L708 560 H990"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="410"
          strokeDashoffset={410 * (1 - lineDraw)}
        />
      </svg>

      {/* Callout Tag Pill */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 472,
        }}
      >
        <GlassPill
          borderRadius={20}
          style={{
            padding: "14px 24px",
            opacity: tagIn * (1 - exit),
            transform: `translate3d(${interpolate(tagIn, [0, 1], [24, 0], CLAMP)}px, 0, 0)`,
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontSize: 28, fontWeight: 800, color: COLORS.WHITE }}>
            Kutu Putih
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 21, fontWeight: 600, color: COLORS.LIME_SOFT, marginTop: 2 }}>
            Menyerang pucuk muda
          </div>
        </GlassPill>
      </div>
    </AbsoluteFill>
  );
};
