import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { START_SMALL_DATA } from "../data/contentData";
import { COLORS } from "../design-system/colors";
import { RADIUS } from "../design-system/radius";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { IOSNavigationBar } from "../components/ios/IOSNavigationBar";
import { IOSSegmentedControl } from "../components/ios/IOSSegmentedControl";
import { IOSTabBar } from "../components/ios/IOSTabBar";
import { LiquidGlass } from "../components/materials/LiquidGlass";

export const StartSmallScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = runSpring(frame, 0, "iosSpring");
  const segmentProgress = runSpring(frame, 440, "iosQuickSpring");
  const showSolutions = segmentProgress >= 0.5;
  const teaserEnter = runSpring(frame, 940, "iosSheetSpring");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPractical,
        backgroundImage:
          "radial-gradient(circle at 85% 20%, rgba(74,124,89,0.16) 0%, transparent 50%)",
        fontFamily: FONT_FAMILY,
        padding: `${DEVICE_METRICS.safeArea.top + 12}px ${DEVICE_METRICS.safeArea.horizontal}px 220px`,
        boxSizing: "border-box",
        opacity: enter,
      }}
    >
      <IOSNavigationBar
        title={START_SMALL_DATA.appTitle}
        dark={false}
        scrollProgress={0.15}
      />

      <div
        style={{
          ...TYPOGRAPHY.title3,
          color: COLORS.textSecondaryLight,
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        {START_SMALL_DATA.headline}
      </div>

      {/* Native Segmented Control */}
      <div style={{ marginBottom: 34 }}>
        <IOSSegmentedControl
          segments={START_SMALL_DATA.segments}
          progress={segmentProgress}
          dark={false}
        />
      </div>

      {/* Comparison Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {START_SMALL_DATA.items.map((item, idx) => (
          <div
            key={item.action}
            style={{
              backgroundColor: COLORS.surfaceGroupedLight,
              borderRadius: RADIUS.groupedSurface,
              padding: "28px 32px",
              border: `1px solid ${COLORS.separatorLight}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.caption,
                  color: showSolutions ? COLORS.accentEmerald : COLORS.accentAmber,
                  fontWeight: 700,
                  letterSpacing: 1.1,
                }}
              >
                {showSolutions ? item.action.toUpperCase() : `HAMBATAN 0${idx + 1}`}
              </span>
            </div>
            <div
              style={{
                ...TYPOGRAPHY.headline,
                color: COLORS.textPrimaryLight,
              }}
            >
              {showSolutions ? item.solution : item.barrier}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Next Teaser Card */}
      <div
        style={{
          marginTop: 34,
          transform: `translateY(${interpolate(teaserEnter, [0, 1], [80, 0])}px)`,
          opacity: teaserEnter,
        }}
      >
        <LiquidGlass variant="prominent" dark={false} borderRadius={36}>
          <div style={{ padding: "28px 32px" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption,
                color: COLORS.accentEmerald,
                fontWeight: 700,
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              {START_SMALL_DATA.teaserLabel}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.title2,
                color: COLORS.textPrimaryLight,
                marginBottom: 6,
              }}
            >
              {START_SMALL_DATA.teaserTitle}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.subheadline,
                color: COLORS.textSecondaryLight,
              }}
            >
              {START_SMALL_DATA.teaserSubtitle}
            </div>
          </div>
        </LiquidGlass>
      </div>

      <IOSTabBar activeIndex={2} dark={false} />
    </AbsoluteFill>
  );
};
