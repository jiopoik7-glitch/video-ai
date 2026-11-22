import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY } from "../../design-system/typography";

export interface IOSSegmentedControlProps {
  readonly segments: readonly [string, string];
  readonly progress: number; // 0 = left, 1 = right
  readonly dark?: boolean;
}

export const IOSSegmentedControl: React.FC<IOSSegmentedControlProps> = ({
  segments,
  progress,
  dark = false,
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const thumbLeftPercent = interpolate(clamped, [0, 1], [0.8, 50.2]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 84,
        borderRadius: 24,
        backgroundColor: dark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(18, 26, 20, 0.08)",
        padding: 6,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Animated Thumb */}
      <div
        style={{
          position: "absolute",
          top: 6,
          bottom: 6,
          left: `${thumbLeftPercent}%`,
          width: "49%",
          borderRadius: 20,
          backgroundColor: dark ? "rgba(255,255,255,0.22)" : COLORS.white,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
        }}
      />

      {segments.map((label, idx) => {
        const isActive = idx === 0 ? clamped < 0.5 : clamped >= 0.5;
        return (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              fontSize: 28,
              fontWeight: isActive ? 600 : 500,
              color: dark
                ? COLORS.white
                : isActive
                ? COLORS.textPrimaryLight
                : COLORS.textSecondaryLight,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};
