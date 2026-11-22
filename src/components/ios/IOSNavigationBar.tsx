import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY, TYPOGRAPHY } from "../../design-system/typography";

export interface IOSNavigationBarProps {
  readonly title: string;
  readonly backLabel?: string;
  readonly dark?: boolean;
  readonly scrollProgress?: number;
}

export const IOSNavigationBar: React.FC<IOSNavigationBarProps> = ({
  title,
  backLabel = "Beranda",
  dark = true,
  scrollProgress = 0,
}) => {
  const clamped = Math.max(0, Math.min(1, scrollProgress));
  const largeOpacity = interpolate(clamped, [0, 0.55], [1, 0], {
    extrapolateRight: "clamp",
  });
  const compactOpacity = interpolate(clamped, [0.45, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const largeHeight = interpolate(clamped, [0, 1], [104, 12]);

  const textColor = dark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
  const accentColor = dark ? COLORS.accentGreen : COLORS.accentEmerald;

  return (
    <div style={{ fontFamily: FONT_FAMILY, width: "100%" }}>
      {/* Top Bar */}
      <div
        style={{
          height: 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5L8 12L15 19"
              stroke={accentColor}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              color: accentColor,
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            {backLabel}
          </span>
        </div>

        {/* Compact Title */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            color: textColor,
            fontSize: 32,
            fontWeight: 600,
            opacity: compactOpacity,
            pointerEvents: "none",
          }}
        >
          {title}
        </div>
      </div>

      {/* Collapsible Large Title */}
      <div
        style={{
          height: largeHeight,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          opacity: largeOpacity,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.largeTitle,
            color: textColor,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};
