import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { BENEFITS_DATA } from "../data/contentData";
import { COLORS } from "../design-system/colors";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { IOSNavigationBar } from "../components/ios/IOSNavigationBar";
import { IOSGroupedList } from "../components/ios/IOSGroupedList";
import { IOSTabBar } from "../components/ios/IOSTabBar";
import { LiquidGlass } from "../components/materials/LiquidGlass";

export const BenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = runSpring(frame, 0, "iosSpring");
  const scrollProgress = interpolate(frame, [300, 600], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const visibleCount =
    frame < 220
      ? 1
      : frame < 440
      ? 2
      : frame < 660
      ? 3
      : frame < 880
      ? 4
      : 5;

  const questionProgress = runSpring(frame, 1280, "iosSheetSpring");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgLifestyle,
        backgroundImage:
          "radial-gradient(circle at 18% 12%, rgba(52,199,89,0.14) 0%, transparent 48%)",
        fontFamily: FONT_FAMILY,
        padding: `${DEVICE_METRICS.safeArea.top + 12}px ${DEVICE_METRICS.safeArea.horizontal}px 220px`,
        boxSizing: "border-box",
        opacity: enter,
      }}
    >
      <IOSNavigationBar
        title={BENEFITS_DATA.appTitle}
        dark={false}
        scrollProgress={scrollProgress}
      />

      <div
        style={{
          ...TYPOGRAPHY.title3,
          color: COLORS.textSecondaryLight,
          marginTop: 8,
          marginBottom: 22,
        }}
      >
        {BENEFITS_DATA.headline}
      </div>

      {/* Scientific review badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 22px",
          borderRadius: 999,
          backgroundColor: "rgba(34, 160, 107, 0.12)",
          color: COLORS.accentEmerald,
          fontSize: 23,
          fontWeight: 600,
          marginBottom: 28,
          alignSelf: "flex-start",
        }}
      >
        <span>{BENEFITS_DATA.studyBadge}</span>
      </div>

      <IOSGroupedList
        sectionHeader="5 Manfaat Berkebun"
        items={BENEFITS_DATA.benefits}
        dark={false}
        visibleCount={visibleCount}
      />

      {/* Closing transition prompt */}
      {frame >= 1260 && (
        <div
          style={{
            position: "absolute",
            left: DEVICE_METRICS.safeArea.horizontal,
            right: DEVICE_METRICS.safeArea.horizontal,
            bottom: 200,
            transform: `translateY(${interpolate(questionProgress, [0, 1], [120, 0])}px)`,
            opacity: questionProgress,
          }}
        >
          <LiquidGlass variant="regular" dark={false} borderRadius={36}>
            <div style={{ padding: "28px 34px", textAlign: "center" }}>
              <div
                style={{
                  ...TYPOGRAPHY.title2,
                  color: COLORS.textPrimaryLight,
                }}
              >
                {BENEFITS_DATA.closingQuestion}
              </div>
            </div>
          </LiquidGlass>
        </div>
      )}

      <IOSTabBar activeIndex={1} dark={false} />
    </AbsoluteFill>
  );
};
