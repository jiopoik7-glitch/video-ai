import React from "react";

export type GlassVariant = "clear" | "regular" | "prominent";

export interface LiquidGlassProps {
  readonly variant?: GlassVariant;
  readonly dark?: boolean;
  readonly borderRadius?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  variant = "regular",
  dark = true,
  borderRadius = 36,
  style,
  children,
}) => {
  const bgMap: Record<GlassVariant, string> = dark
    ? {
        clear: "rgba(255, 255, 255, 0.11)",
        regular: "rgba(22, 30, 25, 0.64)",
        prominent: "rgba(52, 199, 89, 0.24)",
      }
    : {
        clear: "rgba(255, 255, 255, 0.56)",
        regular: "rgba(255, 255, 255, 0.78)",
        prominent: "rgba(34, 160, 107, 0.16)",
      };

  const borderColor = dark
    ? "rgba(255, 255, 255, 0.20)"
    : "rgba(18, 26, 20, 0.10)";

  const blurPx = variant === "clear" ? 26 : variant === "regular" ? 34 : 28;

  return (
    <div
      style={{
        position: "relative",
        borderRadius,
        backgroundColor: bgMap[variant],
        backdropFilter: `blur(${blurPx}px) saturate(165%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(165%)`,
        border: `1.5px solid ${borderColor}`,
        boxShadow: dark
          ? "0 20px 50px rgba(0, 0, 0, 0.38), inset 0 1.5px 0 rgba(255, 255, 255, 0.28)"
          : "0 14px 36px rgba(18, 26, 20, 0.10), inset 0 1.5px 0 rgba(255, 255, 255, 0.85)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Layer B: Subtle specular diagonal reflection */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: dark
            ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.06) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.20) 100%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
