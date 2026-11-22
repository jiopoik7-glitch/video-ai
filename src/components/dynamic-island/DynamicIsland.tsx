import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../../config/deviceMetrics";
import { getActiveIslandEvent } from "../../data/islandTimeline";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY } from "../../design-system/typography";
import { Z_INDEX } from "../../design-system/zIndex";
import { runSpring } from "../../motion/iosSpring";

export const DynamicIsland: React.FC = () => {
  const frame = useCurrentFrame();
  const active = getActiveIslandEvent(frame);
  const transition = runSpring(frame, active.startFrame, "iosIslandSpring");

  const { dynamicIsland } = DEVICE_METRICS;

  let targetWidth: number = dynamicIsland.idleWidth;
  let targetHeight: number = dynamicIsland.idleHeight;
  let targetRadius: number = dynamicIsland.radiusIdle;

  if (active.mode === "faceid") {
    targetWidth = 340;
    targetHeight = 96;
    targetRadius = 46;
  } else if (active.mode === "compact") {
    targetWidth = dynamicIsland.compactWidth;
    targetHeight = dynamicIsland.compactHeight;
    targetRadius = 41;
  } else if (active.mode === "expanded" || active.mode === "completed") {
    targetWidth = dynamicIsland.expandedWidth;
    targetHeight = dynamicIsland.expandedHeight;
    targetRadius = dynamicIsland.radiusExpanded;
  }

  const width = interpolate(
    transition,
    [0, 1],
    [dynamicIsland.idleWidth, targetWidth],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const height = interpolate(
    transition,
    [0, 1],
    [dynamicIsland.idleHeight, targetHeight],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const borderRadius = interpolate(
    transition,
    [0, 1],
    [dynamicIsland.radiusIdle, targetRadius],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const contentOpacity = interpolate(transition, [0.35, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: dynamicIsland.topY,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: Z_INDEX.dynamicIsland,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.islandBlack,
          boxShadow: "0 14px 34px rgba(0, 0, 0, 0.48)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: active.mode === "expanded" || active.mode === "completed" ? "26px 36px" : "0 26px",
          boxSizing: "border-box",
          overflow: "hidden",
          fontFamily: FONT_FAMILY,
        }}
      >
        {active.mode === "faceid" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              opacity: contentOpacity,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3H5a2 2 0 0 0-2 2v2m14-4h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"
                stroke={COLORS.accentGreen}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M9 12.5l2 2 4-4.5"
                stroke={COLORS.accentGreen}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ color: COLORS.white, fontSize: 26, fontWeight: 600 }}>
              Face ID
            </span>
          </div>
        )}

        {active.mode === "compact" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              opacity: contentOpacity,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: COLORS.accentGreen,
                }}
              />
              <span style={{ color: COLORS.white, fontSize: 24, fontWeight: 600 }}>
                {active.title}
              </span>
            </div>
            <span
              style={{
                color: COLORS.accentGreen,
                fontSize: 24,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {active.stepLabel}
            </span>
          </div>
        )}

        {(active.mode === "expanded" || active.mode === "completed") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              opacity: contentOpacity,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    background: "linear-gradient(145deg, #34C759 0%, #1F7A3E 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21V11M12 11C12 6.5 16 4 20 4C20 8.5 17 12 12 11ZM12 13C12 9 8.5 7 5 7C5 11 7.5 13.5 12 13Z"
                      stroke="#FFFFFF"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div style={{ color: COLORS.white, fontSize: 30, fontWeight: 700 }}>
                    {active.title}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 23,
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    {active.subtitle}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: COLORS.accentGreen,
                  fontSize: 30,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(active.progress * 100)}%
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: 12,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.16)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(active.progress * 100)}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: COLORS.accentGreen,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
