import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT, TIMING } from "../data/videoData";
import { CLAMP, IOS_COLORS, IOS_FONT, LAYOUT, SPRING_IOS, SPRING_TACTILE } from "../theme";
import { GlassSurface, SfIcon } from "../components/LiquidGlassUI";

export const Babak3SegmentedCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // iOS Navigation push-in from right
  const enter = spring({ frame, fps, config: SPRING_IOS });
  const enterX = interpolate(enter, [0, 1], [160, 0], CLAMP);
  const enterOpacity = interpolate(enter, [0, 0.35, 1], [0, 0.9, 1], CLAMP);

  // Authentic iOS 26 Segmented Control Morphing Glass Thumb (NO fake cursor!)
  const switchSpring = spring({
    frame: Math.max(0, frame - TIMING.compare.switchAt),
    fps,
    config: SPRING_TACTILE,
  });
  const isRightTab = frame >= TIMING.compare.switchAt;

  // Native iOS Modal Depth recession when Babak 4 Modal Sheet slides up
  const recede = spring({
    frame: Math.max(0, frame - TIMING.compare.sheetRecedeStart),
    fps,
    config: SPRING_IOS,
  });
  const depthScale = interpolate(recede, [0, 1], [1, 0.91], CLAMP);
  const depthY = interpolate(recede, [0, 1], [0, -34], CLAMP);
  const dimOpacity = interpolate(recede, [0, 1], [0, 0.48], CLAMP);
  const depthOpacity = enterOpacity * interpolate(recede, [0, 1], [1, 0.65], CLAMP);

  const activePoints = isRightTab ? CONTENT.compare.rightPoints : CONTENT.compare.leftPoints;
  const contentPop = isRightTab
    ? spring({ frame: Math.max(0, frame - TIMING.compare.switchAt), fps, config: SPRING_IOS })
    : enter;

  return (
    <AbsoluteFill>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: LAYOUT.topSafe,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
          opacity: depthOpacity,
          transform: `translate3d(${enterX}px, ${depthY}px, 0) scale(${depthScale})`,
          transformOrigin: "center top",
        }}
      >
        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 30,
            fontWeight: 600,
            color: isRightTab ? IOS_COLORS.iosGreen : IOS_COLORS.iosAmber,
            marginBottom: 10,
          }}
        >
          {CONTENT.compare.badge}
        </div>
        <div
          style={{
            fontFamily: IOS_FONT,
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            color: IOS_COLORS.labelPrimary,
          }}
        >
          {CONTENT.compare.largeTitle}
        </div>
      </div>

      {/* Authentic iOS 26 Segmented Glass Control (transform & opacity directly on GlassSurface -> true wallpaper lensing!) */}
      <div
        style={{
          position: "absolute",
          top: 368,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
        }}
      >
        <GlassSurface
          variant="clear"
          borderRadius={999}
          sheenStartFrame={10}
          style={{
            height: 100,
            padding: 8,
            display: "flex",
            alignItems: "center",
            opacity: depthOpacity,
            transform: `translate3d(${enterX}px, ${depthY}px, 0) scale(${depthScale})`,
            transformOrigin: "center top",
          }}
        >
          {/* Morphing Glass Thumb Pill (no backdropFilter nested) */}
          <div
            style={{
              position: "absolute",
              top: 8,
              bottom: 8,
              left: 8,
              width: "calc(50% - 8px)",
              borderRadius: 999,
              background: isRightTab
                ? "linear-gradient(180deg, rgba(48, 209, 88, 0.92) 0%, rgba(22, 163, 74, 0.92) 100%)"
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.16) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.48)",
              boxShadow: "0 8px 22px rgba(0, 0, 0, 0.24)",
              transform: `translateX(${switchSpring * 100}%)`,
            }}
          />

          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: IOS_FONT,
              fontSize: 34,
              fontWeight: isRightTab ? 500 : 700,
              color: isRightTab ? IOS_COLORS.labelSecondary : IOS_COLORS.labelPrimary,
              zIndex: 2,
            }}
          >
            {CONTENT.compare.tabLeft}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: IOS_FONT,
              fontSize: 34,
              fontWeight: isRightTab ? 700 : 500,
              color: isRightTab ? IOS_COLORS.labelPrimary : IOS_COLORS.labelSecondary,
              zIndex: 2,
            }}
          >
            {CONTENT.compare.tabRight}
          </div>
        </GlassSurface>
      </div>

      {/* Comparison Inset Grouped Card (.regular Liquid Glass) */}
      <div
        style={{
          position: "absolute",
          top: 504,
          left: LAYOUT.padX,
          right: LAYOUT.padX,
        }}
      >
        <GlassSurface
          variant="regular"
          borderRadius={38}
          sheenStartFrame={TIMING.compare.switchAt + 2}
          style={{
            padding: "8px 0",
            opacity: depthOpacity,
            transform: `translate3d(${enterX}px, ${depthY}px, 0) scale(${depthScale})`,
            transformOrigin: "center top",
          }}
        >
          {activePoints.map((pt) => (
            <div
              key={`${isRightTab ? "r" : "l"}-${pt.title}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
                padding: "38px 34px",
                borderBottom: `1px solid ${IOS_COLORS.separator}`,
                opacity: contentPop,
                transform: `translate3d(0, ${interpolate(contentPop, [0, 1], [18, 0], CLAMP)}px, 0)`,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  backgroundColor: isRightTab
                    ? "rgba(48, 209, 88, 0.20)"
                    : "rgba(255, 69, 58, 0.20)",
                  border: isRightTab
                    ? "1.5px solid rgba(48, 209, 88, 0.50)"
                    : "1.5px solid rgba(255, 69, 58, 0.50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                <SfIcon
                  name={isRightTab ? "check" : "xmark"}
                  size={30}
                  color={isRightTab ? IOS_COLORS.iosGreen : IOS_COLORS.iosRed}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 40,
                    fontWeight: 600,
                    color: IOS_COLORS.labelPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  {pt.title}
                </div>
                <div
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 32,
                    fontWeight: 400,
                    color: IOS_COLORS.labelSecondary,
                    lineHeight: 1.34,
                    marginTop: 10,
                  }}
                >
                  {pt.desc}
                </div>
              </div>
            </div>
          ))}

          {/* Concrete Daily Care Footer Strip */}
          <div
            style={{
              padding: "28px 34px",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <SfIcon name="drop" size={28} color={IOS_COLORS.iosGreen} />
            <span
              style={{
                fontFamily: IOS_FONT,
                fontSize: 30,
                fontWeight: 500,
                color: IOS_COLORS.labelSecondary,
                lineHeight: 1.32,
              }}
            >
              {CONTENT.compare.footerNote}
            </span>
          </div>
        </GlassSurface>
      </div>

      {/* Native iOS Modal Scrim Dimming Layer */}
      {dimOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(0, 0, 0, ${dimOpacity.toFixed(3)})`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
