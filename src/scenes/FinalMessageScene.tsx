import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { FINAL_MESSAGE_DATA } from "../data/contentData";
import { COLORS } from "../design-system/colors";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { LiquidGlass } from "../components/materials/LiquidGlass";

export const FinalMessageScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleEnter = runSpring(frame, 20, "iosSoftSpring");
  const ctaEnter = runSpring(frame, 220, "iosSpring");

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #1E5634 0%, #0E291A 52%, #07120C 100%)",
        fontFamily: FONT_FAMILY,
        padding: `320px ${DEVICE_METRICS.safeArea.horizontal}px 160px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(titleEnter, [0, 1], [60, 0])}px)`,
          opacity: titleEnter,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.caption,
            color: COLORS.accentGreen,
            letterSpacing: 2.6,
            marginBottom: 24,
          }}
        >
          {FINAL_MESSAGE_DATA.kicker}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.04,
            letterSpacing: -2.6,
            whiteSpace: "pre-line",
            marginBottom: 24,
          }}
        >
          {FINAL_MESSAGE_DATA.headline}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.title2,
            color: COLORS.accentGreen,
            marginBottom: 36,
          }}
        >
          {FINAL_MESSAGE_DATA.subheadline}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body,
            color: COLORS.textSecondaryDark,
            maxWidth: 880,
          }}
        >
          {FINAL_MESSAGE_DATA.quote}
        </div>
      </div>

      {/* Soft Community CTA */}
      <div
        style={{
          transform: `translateY(${interpolate(ctaEnter, [0, 1], [50, 0])}px)`,
          opacity: ctaEnter,
        }}
      >
        <LiquidGlass variant="clear" dark={true} borderRadius={38}>
          <div style={{ padding: "32px 36px" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption,
                color: COLORS.accentGreen,
                letterSpacing: 1.4,
                marginBottom: 10,
              }}
            >
              DISKUSI DI KOMENTAR
            </div>
            <div
              style={{
                ...TYPOGRAPHY.title3,
                color: COLORS.white,
              }}
            >
              {FINAL_MESSAGE_DATA.ctaPrompt}
            </div>
          </div>
        </LiquidGlass>
      </div>
    </AbsoluteFill>
  );
};
