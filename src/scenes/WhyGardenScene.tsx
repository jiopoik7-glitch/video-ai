import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { WHY_GARDEN_DATA } from "../data/contentData";
import { COLORS } from "../design-system/colors";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { IOSNavigationBar } from "../components/ios/IOSNavigationBar";
import { IOSGroupedList } from "../components/ios/IOSGroupedList";
import { IOSTabBar } from "../components/ios/IOSTabBar";
import { LiquidGlass } from "../components/materials/LiquidGlass";

export const WhyGardenScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = runSpring(frame, 0, "iosSpring");
  const scrollProgress = interpolate(frame, [380, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statReveal = runSpring(frame, 420, "iosSoftSpring");

  const visiblePoints =
    frame < 240 ? 1 : frame < 680 ? 2 : 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgDocumentary,
        backgroundImage:
          "radial-gradient(circle at 80% 15%, rgba(52,199,89,0.14) 0%, transparent 46%)",
        fontFamily: FONT_FAMILY,
        padding: `${DEVICE_METRICS.safeArea.top + 12}px ${DEVICE_METRICS.safeArea.horizontal}px 220px`,
        boxSizing: "border-box",
        opacity: enter,
      }}
    >
      <IOSNavigationBar
        title={WHY_GARDEN_DATA.appTitle}
        dark={true}
        scrollProgress={scrollProgress}
      />

      <div
        style={{
          ...TYPOGRAPHY.title3,
          color: COLORS.textSecondaryDark,
          marginTop: 10,
          marginBottom: 34,
        }}
      >
        {WHY_GARDEN_DATA.headline}
      </div>

      {/* Bank Indonesia Data Highlight */}
      <div
        style={{
          marginBottom: 36,
          transform: `scale(${interpolate(statReveal, [0, 1], [0.95, 1])})`,
          opacity: interpolate(statReveal, [0, 1], [0.35, 1]),
        }}
      >
        <LiquidGlass variant="prominent" dark={true} borderRadius={38}>
          <div style={{ padding: "32px 34px" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption,
                color: COLORS.accentGreen,
                letterSpacing: 1.5,
                marginBottom: 8,
              }}
            >
              DATA PANGAN · OKTOBER 2026
            </div>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1.02,
                fontVariantNumeric: "tabular-nums",
                marginBottom: 10,
              }}
            >
              {WHY_GARDEN_DATA.statValue}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.headline,
                color: COLORS.white,
                marginBottom: 10,
              }}
            >
              {WHY_GARDEN_DATA.statLabel}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.footnote,
                color: COLORS.textSecondaryDark,
              }}
            >
              {WHY_GARDEN_DATA.statSource}
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Grouped List */}
      <IOSGroupedList
        sectionHeader="Mengapa Ini Penting"
        items={WHY_GARDEN_DATA.points}
        dark={true}
        visibleCount={visiblePoints}
      />

      <IOSTabBar activeIndex={0} dark={true} />
    </AbsoluteFill>
  );
};
