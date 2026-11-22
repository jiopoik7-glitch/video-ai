import React from "react";
import { COLORS } from "../theme";

export type EditIconName = "alert" | "arrow" | "spray" | "shield" | "check" | "bag";

export const GlassPill: React.FC<{
  children: React.ReactNode;
  borderRadius?: number;
  style?: React.CSSProperties;
}> = ({ children, borderRadius = 26, style }) => {
  return (
    <div
      style={{
        borderRadius,
        background: COLORS.GLASS_DARK,
        backdropFilter: "blur(24px) saturate(170%)",
        WebkitBackdropFilter: "blur(24px) saturate(170%)",
        border: `1.5px solid ${COLORS.GLASS_BORDER}`,
        boxShadow:
          "0 18px 46px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const EditIcon: React.FC<{
  name: EditIconName;
  size?: number;
  color?: string;
}> = ({ name, size = 26, color = COLORS.WHITE }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "alert":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4.5" />
          <circle cx="12" cy="16" r="0.8" fill={color} stroke="none" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "spray":
      return (
        <svg {...common}>
          <path d="M6 12h7v8H6z" />
          <path d="M8 12V8h5" />
          <path d="M16 6l2-1M16 9h3M16 12l2 1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12.5L10 17.5L19 7" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
  }
};
