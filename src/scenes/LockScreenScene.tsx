import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DEVICE_METRICS } from "../config/deviceMetrics";
import { LOCK_SCREEN_DATA } from "../data/contentData";
import { FONT_FAMILY, TYPOGRAPHY } from "../design-system/typography";
import { runSpring } from "../motion/iosSpring";
import { IOSNotification } from "../components/ios/IOSNotification";

export const LockScreenScene: React.FC = () => {
  const frame = useCurrentFrame();

  const notifEnter = runSpring(frame, 55, "iosNotificationSpring");
  const notifY = interpolate(notifEnter, [0, 1], [-120, 0]);
  const notifOpacity = interpolate(notifEnter, [0, 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Unlock swipe up near end of scene (frame 425..479)
  const unlockProgress = runSpring(frame, 425, "iosSpring");
  const swipeY = interpolate(unlockProgress, [0, 1], [0, -1920]);
  const bgScale = interpolate(frame, [0, 480], [1.04, 1.1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 28% 22%, #1E4D33 0%, #0E261A 48%, #07120C 100%)",
        fontFamily: FONT_FAMILY,
        overflow: "hidden",
      }}
    >
      {/* Botanical depth light layers */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          transform: `scale(${bgScale})`,
          background:
            "radial-gradient(circle at 75% 65%, rgba(52, 199, 89, 0.22) 0%, transparent 52%), radial-gradient(circle at 20% 80%, rgba(34, 160, 107, 0.16) 0%, transparent 45%)",
        }}
      />

      {/* Swipeable Lock Screen Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${swipeY}px)`,
          padding: `220px ${DEVICE_METRICS.safeArea.horizontal}px 140px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.title3,
            color: "rgba(255,255,255,0.84)",
            fontWeight: 500,
            marginBottom: 10,
          }}
        >
          {LOCK_SCREEN_DATA.dateText}
        </div>

        <div
          style={{
            ...TYPOGRAPHY.lockClock,
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 12px 36px rgba(0, 0, 0, 0.35)",
            marginBottom: 88,
          }}
        >
          07:12
        </div>

        <div
          style={{
            width: "100%",
            transform: `translateY(${notifY}px)`,
            opacity: notifOpacity,
          }}
        >
          <IOSNotification
            appName={LOCK_SCREEN_DATA.notificationApp}
            timeText={LOCK_SCREEN_DATA.notificationTime}
            title={LOCK_SCREEN_DATA.notificationTitle}
            body={LOCK_SCREEN_DATA.notificationBody}
          />
        </div>

        {/* Bottom Lock Screen prompt */}
        <div
          style={{
            marginTop: "auto",
            color: "rgba(255,255,255,0.68)",
            ...TYPOGRAPHY.subheadline,
            letterSpacing: 0.4,
          }}
        >
          Geser ke atas untuk membuka
        </div>
      </div>
    </AbsoluteFill>
  );
};
