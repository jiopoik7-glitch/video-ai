import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONTS,
  SAFE_ZONE,
  SPRING_BOUNCY_MICRO,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
} from "../theme";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * A. MaskedReveal: overflow hidden, translateY 115% -> 0%, skewY 2deg -> 0deg, spring editorial.
 */
export const MaskedReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_EDITORIAL,
  });

  const y = interpolate(prog, [0, 1], [115, 0], CLAMP);
  const skew = interpolate(prog, [0, 1], [2, 0], CLAMP);
  const opacity = interpolate(prog, [0, 0.35, 1], [0, 0.9, 1], CLAMP);

  return (
    <div style={{ overflow: "hidden", display: "block", ...style }}>
      <div
        style={{
          transform: `translateY(${y}%) skewY(${skew}deg)`,
          opacity,
          transformOrigin: "left bottom",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * B. StabiloHighlight: lime highlight layer behind text, skew -1.5deg, scaleX 0 -> 1, starts 8 frames after word.
 */
export const StabiloHighlight: React.FC<{
  children: React.ReactNode;
  wordStartFrame: number;
  color?: string;
  textColor?: string;
  paddingHorizontal?: number;
}> = ({
  children,
  wordStartFrame,
  color = COLORS.LIME,
  textColor,
  paddingHorizontal = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const highlightStart = wordStartFrame + 8;

  const swipe = spring({
    frame: Math.max(0, frame - highlightStart),
    fps,
    config: SPRING_SNAPPY,
  });

  const scaleX = interpolate(swipe, [0, 1], [0, 1], CLAMP);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        paddingLeft: paddingHorizontal,
        paddingRight: paddingHorizontal,
        color: textColor,
        zIndex: 1,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "8%",
          height: "76%",
          backgroundColor: color,
          transform: `skewX(-1.5deg) scaleX(${scaleX})`,
          transformOrigin: "left center",
          borderRadius: 4,
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};

/**
 * C. RollingYear: vertical digit strip with crop mask, sequential stagger, spring precision.
 * Supports: 1908, 1912, 1922, 1925, 1927, 1930, 1931, 1935.
 */
export const RollingYear: React.FC<{
  year: string;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ year, delay = 10, fontSize = 152, color = COLORS.LIME }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const digits = year.split("");
  const cellHeight = Math.round(fontSize * 1.08);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: FONTS.MONO,
        fontSize,
        fontWeight: 700,
        lineHeight: `${cellHeight}px`,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-4px",
      }}
    >
      {digits.map((ch, idx) => {
        const numeric = Number.parseInt(ch, 10);
        if (Number.isNaN(numeric)) {
          return (
            <span key={`${ch}-${idx}`} style={{ padding: "0 4px" }}>
              {ch}
            </span>
          );
        }

        // Deterministic rolling strip ending cleanly on the target digit
        const startDigit = (numeric + 7) % 10;
        const steps = 3;
        const strip: number[] = [];
        for (let s = 0; s <= steps; s++) {
          strip.push((startDigit + s) % 10);
        }

        const prog = spring({
          frame: Math.max(0, frame - (delay + idx * 5)),
          fps,
          config: SPRING_EDITORIAL,
        });

        const translateY = interpolate(
          prog,
          [0, 1],
          [0, -steps * cellHeight],
          CLAMP
        );
        const opacity = interpolate(prog, [0, 0.25, 1], [0, 1, 1], CLAMP);

        return (
          <div
            key={`${year}-${idx}`}
            style={{
              height: cellHeight,
              overflow: "hidden",
              display: "inline-block",
              opacity,
            }}
          >
            <div style={{ transform: `translateY(${translateY}px)` }}>
              {strip.map((digit, dIdx) => (
                <div
                  key={`${idx}-${dIdx}`}
                  style={{
                    height: cellHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * D. SceneTransitionWrapper: directional whip / slide / scale / micro-skew transitions.
 */
export const SceneTransitionWrapper: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  direction?: "horizontal" | "vertical" | "left" | "up";
  exitFrames?: number;
}> = ({
  children,
  durationInFrames,
  direction = "horizontal",
  exitFrames = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProg = spring({
    frame,
    fps,
    config: SPRING_SNAPPY,
  });

  const safeExitStart = Math.max(1, durationInFrames - exitFrames);
  const exitProg = interpolate(
    frame,
    [safeExitStart, durationInFrames],
    [0, 1],
    CLAMP
  );

  let translateX = 0;
  let translateY = 0;
  let skewX = 0;

  if (direction === "horizontal" || direction === "left") {
    translateX =
      interpolate(enterProg, [0, 1], [54, 0], CLAMP) +
      interpolate(exitProg, [0, 1], [0, -48], CLAMP);
    skewX =
      interpolate(enterProg, [0, 1], [-1.2, 0], CLAMP) +
      interpolate(exitProg, [0, 1], [0, 0.9], CLAMP);
  } else {
    translateY =
      interpolate(enterProg, [0, 1], [44, 0], CLAMP) +
      interpolate(exitProg, [0, 1], [0, -40], CLAMP);
  }

  const scale =
    interpolate(enterProg, [0, 1], [0.985, 1], CLAMP) -
    interpolate(exitProg, [0, 1], [0, 0.015], CLAMP);
  const opacity =
    interpolate(enterProg, [0, 0.45], [0, 1], CLAMP) *
    interpolate(exitProg, [0, 1], [1, 0], CLAMP);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) skewX(${skewX}deg)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

/**
 * E. LivingParallax: subtle vertical drift (+/- 4px) & slow micro scale (1.0 -> 1.015).
 */
export const LivingParallax: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  style?: React.CSSProperties;
}> = ({ children, durationInFrames, style }) => {
  const frame = useCurrentFrame();
  const safeDur = Math.max(1, durationInFrames);
  const driftY = interpolate(frame, [0, safeDur], [3.5, -3.5], CLAMP);
  const scale = interpolate(frame, [0, safeDur], [1.0, 1.015], CLAMP);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `translateY(${driftY}px) scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * F. CardStagger: staggered card entrance (5-8 frames apart).
 */
export const CardStagger: React.FC<{
  children: React.ReactNode;
  index: number;
  baseDelay?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}> = ({ children, index, baseDelay = 12, staggerFrames = 7, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prog = spring({
    frame: Math.max(0, frame - (baseDelay + index * staggerFrames)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const y = interpolate(prog, [0, 1], [26, 0], CLAMP);
  const opacity = interpolate(prog, [0, 0.4, 1], [0, 0.9, 1], CLAMP);

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * G. TimelineRevealLine: horizontal scaleX bar + SPRING_BOUNCY_MICRO node dot.
 */
export const TimelineNodeDot: React.FC<{
  delay: number;
  color?: string;
  size?: number;
}> = ({ delay, color = COLORS.CRIMSON, size = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_BOUNCY_MICRO,
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        border: `3px solid ${COLORS.PAPER}`,
        boxShadow: `0 0 0 2px ${color}`,
        transform: `scale(${scale})`,
      }}
    />
  );
};

/**
 * SafeSceneContainer: enforces identical editorial safe margins so no headline or card collides with HUD / StudentPiP.
 */
export const SafeSceneContainer: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      paddingTop: SAFE_ZONE.paddingTop,
      paddingBottom: SAFE_ZONE.paddingBottom,
      paddingLeft: SAFE_ZONE.paddingLeft,
      paddingRight: SAFE_ZONE.paddingRight,
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    {children}
  </div>
);
