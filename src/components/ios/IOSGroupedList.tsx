import React from "react";
import { COLORS } from "../../design-system/colors";
import { RADIUS } from "../../design-system/radius";
import { FONT_FAMILY, TYPOGRAPHY } from "../../design-system/typography";
import { GroupedPoint } from "../../data/contentData";

export interface IOSGroupedListProps {
  readonly sectionHeader: string;
  readonly items: readonly GroupedPoint[];
  readonly dark?: boolean;
  readonly visibleCount?: number;
  readonly footer?: string;
}

export const IOSGroupedList: React.FC<IOSGroupedListProps> = ({
  sectionHeader,
  items,
  dark = true,
  visibleCount = items.length,
  footer,
}) => {
  const surfaceBg = dark ? COLORS.surfaceGroupedDark : COLORS.surfaceGroupedLight;
  const primaryText = dark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
  const secondaryText = dark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
  const sepColor = dark ? COLORS.separatorDark : COLORS.separatorLight;
  const accent = dark ? COLORS.accentGreen : COLORS.accentEmerald;

  return (
    <div style={{ fontFamily: FONT_FAMILY, width: "100%" }}>
      <div
        style={{
          ...TYPOGRAPHY.caption,
          color: secondaryText,
          textTransform: "uppercase",
          letterSpacing: 1.4,
          paddingLeft: 24,
          marginBottom: 14,
        }}
      >
        {sectionHeader}
      </div>

      <div
        style={{
          backgroundColor: surfaceBg,
          borderRadius: RADIUS.groupedSurface,
          overflow: "hidden",
          border: `1px solid ${sepColor}`,
        }}
      >
        {items.map((item, idx) => {
          const isVisible = idx < visibleCount;
          return (
            <div
              key={item.id}
              style={{
                padding: "28px 30px",
                borderBottom:
                  idx < items.length - 1 ? `1px solid ${sepColor}` : "none",
                opacity: isVisible ? 1 : 0.14,
                display: "flex",
                alignItems: "flex-start",
                gap: 22,
              }}
            >
              <div
                style={{
                  minWidth: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: dark
                    ? "rgba(52, 199, 89, 0.18)"
                    : "rgba(34, 160, 107, 0.14)",
                  color: accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {item.tag.length <= 2 ? item.tag : `${idx + 1}`}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...TYPOGRAPHY.headline,
                    color: primaryText,
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.subheadline,
                    color: secondaryText,
                    fontWeight: 400,
                  }}
                >
                  {item.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {footer && (
        <div
          style={{
            ...TYPOGRAPHY.footnote,
            color: secondaryText,
            padding: "16px 24px 0",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
