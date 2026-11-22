import React from "react";
import { useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../../config/deviceMetrics";
import { SCENE_TIMELINE } from "../../data/sceneTimeline";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY } from "../../design-system/typography";
import { Z_INDEX } from "../../design-system/zIndex";
import { DynamicIsland } from "../dynamic-island/DynamicIsland";

export const IOSChrome: React.FC = () => {
  const frame = useCurrentFrame();

  const scenes = [
    SCENE_TIMELINE.lockScreen,
    SCENE_TIMELINE.homeScreen,
    SCENE_TIMELINE.whyGarden,
    SCENE_TIMELINE.theBenefits,
    SCENE_TIMELINE.startSmall,
    SCENE_TIMELINE.finalMessage,
  ];

  const currentScene =
    scenes.find((s) => frame >= s.startFrame && frame <= s.endFrame) ??
    SCENE_TIMELINE.lockScreen;

  const isDark = currentScene.theme === "dark";
  const fgColor = isDark ? COLORS.white : COLORS.textPrimaryLight;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: Z_INDEX.systemChrome,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          position: "absolute",
          top: DEVICE_METRICS.statusBar.topOffset,
          left: DEVICE_METRICS.statusBar.clockLeft,
          right: DEVICE_METRICS.statusBar.indicatorsRight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Clock */}
        <span
          style={{
            color: fgColor,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: -0.5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {currentScene.clockText}
        </span>

        {/* Cellular, Wi-Fi, Battery SVG indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Cellular */}
          <svg width="36" height="24" viewBox="0 0 24 16" fill="none">
            <rect x="1" y="10" width="3.5" height="5" rx="1" fill={fgColor} />
            <rect x="6.5" y="7" width="3.5" height="8" rx="1" fill={fgColor} />
            <rect x="12" y="4" width="3.5" height="11" rx="1" fill={fgColor} />
            <rect x="17.5" y="1" width="3.5" height="14" rx="1" fill={fgColor} />
          </svg>
          {/* Wi-Fi */}
          <svg width="32" height="24" viewBox="0 0 24 18" fill="none">
            <path
              d="M2 6.5C7.5 1.5 16.5 1.5 22 6.5"
              stroke={fgColor}
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <path
              d="M5.8 10.5C9.3 7.2 14.7 7.2 18.2 10.5"
              stroke={fgColor}
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <circle cx="12" cy="14.8" r="2" fill={fgColor} />
          </svg>
          {/* Battery */}
          <svg width="52" height="24" viewBox="0 0 32 16" fill="none">
            <rect
              x="1"
              y="1.5"
              width="25"
              height="13"
              rx="4"
              stroke={fgColor}
              strokeWidth="1.8"
            />
            <rect x="3.5" y="4" width="18" height="8" rx="2" fill={fgColor} />
            <path
              d="M28 5.5v5"
              stroke={fgColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Persistent Dynamic Island */}
      <DynamicIsland />

      {/* Persistent Home Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: DEVICE_METRICS.homeIndicator.bottomOffset,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: DEVICE_METRICS.homeIndicator.width,
            height: DEVICE_METRICS.homeIndicator.height,
            borderRadius: DEVICE_METRICS.homeIndicator.radius,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(18, 26, 20, 0.75)",
          }}
        />
      </div>
    </div>
  );
};
