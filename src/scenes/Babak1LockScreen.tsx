import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT, TIMING } from "../data/videoData";
import { CLAMP, EASE_IOS, IOS_COLORS, IOS_FONT, LAYOUT, SPRING_IOS } from "../theme";
import { GlassSurface, SfIcon } from "../components/LiquidGlassUI";

export const Babak1LockScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const notifSpring = spring({
    frame: Math.max(0, frame - TIMING.lockScreen.notifDrop),
    fps,
    config: SPRING_IOS,
  });

  // Unlock swipe up: Lock Screen slides cleanly upward revealing Babak 2 underneath (ZERO blank frames)
  const unlock = interpolate(
    frame,
    [TIMING.lockScreen.unlockStart, TIMING.lockScreen.unlockEnd],
    [0, 1],
    { ...CLAMP, easing: EASE_IOS }
  );

  const lockShiftY = interpolate(unlock, [0, 1], [0, -460], CLAMP);
  const lockOpacity = interpolate(unlock, [0, 0.85, 1], [1, 0.15, 0], CLAMP);

  const notifY = interpolate(notifSpring, [0, 1], [140, 0], CLAMP) + lockShiftY * 1.15;
  const notifScale = interpolate(notifSpring, [0, 1], [0.94, 1], CLAMP);
  const notifOpacity = interpolate(notifSpring, [0, 0.25, 1], [0, 0.9, 1], CLAMP) * lockOpacity;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Tanggal + Jam Raksasa Liquid Glass iOS 26 */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translate3d(0, ${lockShiftY}px, 0)`,
          opacity: lockOpacity,
        }}
      >
        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            color: "rgba(255, 255, 255, 0.86)",
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {CONTENT.lockDate}
        </div>

        {/* Jam Lock Screen Efek Kaca Bening iOS 26 */}
        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 224,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            marginTop: 8,
            fontVariantNumeric: "tabular-nums",
            color: "rgba(255, 255, 255, 0.78)",
            textShadow:
              "0 12px 44px rgba(0, 0, 0, 0.26), 0 0 2px rgba(255, 255, 255, 0.9)",
          }}
        >
          {CONTENT.statusTime}
        </div>
      </div>

      {/* iOS 26 Grouped Notification Banner (.clear Liquid Glass, simetris 44px, di atas y=1480) */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
        }}
      >
        <GlassSurface
          variant="clear"
          borderRadius={36}
          sheenStartFrame={TIMING.lockScreen.notifDrop + 10}
          style={{
            padding: "28px 30px",
            opacity: notifOpacity,
            transform: `translate3d(0, ${notifY}px, 0) scale(${notifScale})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* App Icon Squircle (Concentric radius: outer 36 - pad 28 -> 20px standard iOS squircle) */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background: "linear-gradient(145deg, #F43F5E 0%, #15803D 100%)",
                boxShadow:
                  "0 10px 24px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SfIcon name="leaf" size={44} color="#FFFFFF" />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 34,
                    fontWeight: 700,
                    color: IOS_COLORS.labelPrimary,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.22)",
                  }}
                >
                  {CONTENT.lockNotif.appName}
                </span>
                <span
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 28,
                    fontWeight: 400,
                    color: IOS_COLORS.labelSecondary,
                  }}
                >
                  {CONTENT.lockNotif.timeLabel}
                </span>
              </div>

              <div
                style={{
                  fontFamily: IOS_FONT,
                  fontSize: 38,
                  fontWeight: 600,
                  lineHeight: 1.24,
                  color: IOS_COLORS.labelPrimary,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.24)",
                }}
              >
                {CONTENT.lockNotif.headline}
              </div>

              <div
                style={{
                  fontFamily: IOS_FONT,
                  fontSize: 32,
                  fontWeight: 400,
                  lineHeight: 1.32,
                  color: "rgba(255, 255, 255, 0.86)",
                  marginTop: 6,
                }}
              >
                {CONTENT.lockNotif.body}
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </AbsoluteFill>
  );
};
