import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { HOME_APPS } from "../data/contentData";
import { COLORS } from "../design-system/colors";
import { RADIUS } from "../design-system/radius";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { LiquidGlass } from "../components/materials/LiquidGlass";

export const HomeScreenScene: React.FC = () => {
  const frame = useCurrentFrame();

  const entrance = runSpring(frame, 0, "iosSpring");
  const gridScale = interpolate(entrance, [0, 1], [1.14, 1]);
  const gridOpacity = interpolate(entrance, [0, 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tap feedback on App 01 at frame 235..265, then launch zoom 265..299
  const press = runSpring(frame, 235, "iosPressSpring");
  const launch = runSpring(frame, 265, "iosQuickSpring");
  const app1Scale =
    frame < 265
      ? interpolate(press, [0, 1], [1, 0.92])
      : interpolate(launch, [0, 1], [0.92, 1.35]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 28% 22%, #1E4D33 0%, #0E261A 48%, #07120C 100%)",
        fontFamily: FONT_FAMILY,
        padding: `220px ${DEVICE_METRICS.safeArea.horizontal}px 120px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          transform: `scale(${gridScale})`,
          opacity: gridOpacity,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.caption,
            color: COLORS.accentGreen,
            letterSpacing: 2,
            marginBottom: 14,
          }}
        >
          UNLOCK THE GARDEN
        </div>
        <div
          style={{
            ...TYPOGRAPHY.title1,
            color: COLORS.white,
            marginBottom: 56,
          }}
        >
          Tiga cara baru melihat berkebun.
        </div>

        {/* 3 App Cards / Icons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {HOME_APPS.map((app, idx) => {
            const itemEnter = runSpring(frame, 18 + idx * 14, "iosSpring");
            const itemY = interpolate(itemEnter, [0, 1], [60, 0]);
            const scale = idx === 0 ? app1Scale : 1;

            return (
              <div
                key={app.id}
                style={{
                  transform: `translateY(${itemY}px) scale(${scale})`,
                  opacity: itemEnter,
                }}
              >
                <LiquidGlass variant="regular" dark={true} borderRadius={40}>
                  <div
                    style={{
                      padding: "32px 34px",
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                    }}
                  >
                    <div
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: RADIUS.iconSquircle,
                        background: app.bgGradient,
                        border: "1.5px solid rgba(255,255,255,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: app.accent,
                        fontSize: 40,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      0{idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          ...TYPOGRAPHY.title2,
                          color: COLORS.white,
                          marginBottom: 6,
                        }}
                      >
                        {app.name}
                      </div>
                      <div
                        style={{
                          ...TYPOGRAPHY.callout,
                          color: COLORS.textSecondaryDark,
                        }}
                      >
                        {app.subtitle}
                      </div>
                    </div>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </LiquidGlass>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
