import React from "react";
import { COLORS } from "../../design-system/colors";
import { FONT_FAMILY, TYPOGRAPHY } from "../../design-system/typography";
import { LiquidGlass } from "../materials/LiquidGlass";

export interface IOSNotificationProps {
  readonly appName: string;
  readonly timeText: string;
  readonly title: string;
  readonly body: string;
}

export const IOSNotification: React.FC<IOSNotificationProps> = ({
  appName,
  timeText,
  title,
  body,
}) => {
  return (
    <LiquidGlass variant="clear" dark={true} borderRadius={40}>
      <div
        style={{
          padding: "28px 32px",
          display: "flex",
          alignItems: "flex-start",
          gap: 22,
          fontFamily: FONT_FAMILY,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 18,
            background: "linear-gradient(145deg, #34C759 0%, #1B5E32 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21V11M12 11C12 6.5 16 4 20 4C20 8.5 17 12 12 11ZM12 13C12 9 8.5 7 5 7C5 11 7.5 13.5 12 13Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.caption,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
              }}
            >
              {appName}
            </span>
            <span
              style={{
                ...TYPOGRAPHY.caption,
                color: "rgba(255,255,255,0.52)",
              }}
            >
              {timeText}
            </span>
          </div>
          <div
            style={{
              ...TYPOGRAPHY.headline,
              color: COLORS.white,
              marginBottom: 6,
            }}
          >
            {title}
          </div>
          <div
            style={{
              ...TYPOGRAPHY.callout,
              color: "rgba(255,255,255,0.88)",
              fontWeight: 400,
            }}
          >
            {body}
          </div>
        </div>
      </div>
    </LiquidGlass>
  );
};
