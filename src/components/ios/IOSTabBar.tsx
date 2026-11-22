import React from "react";
import { DEVICE_METRICS } from "../../config/deviceMetrics";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY } from "../../design-system/typography";
import { Z_INDEX } from "../../design-system/zIndex";
import { LiquidGlass } from "../materials/LiquidGlass";

export interface IOSTabBarProps {
  readonly activeIndex: 0 | 1 | 2;
  readonly dark?: boolean;
}

const TABS = [
  { id: "why", label: "Why" },
  { id: "benefits", label: "Benefits" },
  { id: "start", label: "Start Small" },
] as const;

export const IOSTabBar: React.FC<IOSTabBarProps> = ({
  activeIndex,
  dark = true,
}) => {
  const accent = dark ? COLORS.accentGreen : COLORS.accentEmerald;
  const muted = dark ? "rgba(255,255,255,0.52)" : "rgba(18,26,20,0.48)";

  return (
    <div
      style={{
        position: "absolute",
        left: DEVICE_METRICS.safeArea.horizontal,
        right: DEVICE_METRICS.safeArea.horizontal,
        bottom: 64,
        zIndex: Z_INDEX.tabBar,
        fontFamily: FONT_FAMILY,
      }}
    >
      <LiquidGlass variant="regular" dark={dark} borderRadius={44}>
        <div
          style={{
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 18px",
          }}
        >
          {TABS.map((tab, idx) => {
            const active = idx === activeIndex;
            const color = active ? accent : muted;
            return (
              <div
                key={tab.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: color,
                    opacity: active ? 1 : 0.45,
                  }}
                />
                <span
                  style={{
                    color,
                    fontSize: 22,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {tab.label}
                </span>
              </div>
            );
          })}
        </div>
      </LiquidGlass>
    </div>
  );
};
