import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CHAPTERS,
  STUDENT_META,
  SUBTITLES,
  TOAST_SEGMENTS,
  VIDEO_SPECS,
  isDarkCanvasFrame,
} from "../data/sejarahData";
import {
  COLORS,
  FONTS,
  SHADOWS,
  SPRING_EDITORIAL,
  Z_INDEX,
} from "../theme";
import { IconBookQuill } from "./HistoricalIcons";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Lightweight pre-encoded SVG turbulence grain tile (cached once by Chromium, fast at 1080p)
const GRAIN_SVG_DATA_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

/**
 * GraphPaperBackground: 40px fine grid + 200px major grid + 0.025 organic SVG grain.
 */
export const GraphPaperBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const isDark = isDarkCanvasFrame(frame);

  const fineColor = isDark
    ? "rgba(246, 244, 236, 0.045)"
    : "rgba(20, 23, 21, 0.048)";
  const majorColor = isDark
    ? "rgba(246, 244, 236, 0.095)"
    : "rgba(20, 23, 21, 0.105)";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isDark ? COLORS.CHARCOAL : COLORS.PAPER,
        zIndex: Z_INDEX.BACKGROUND,
        pointerEvents: "none",
      }}
    >
      {/* Fine 40px + Major 200px graph-paper grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(to right, ${fineColor} 0px, ${fineColor} 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(to bottom, ${fineColor} 0px, ${fineColor} 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(to right, ${majorColor} 0px, ${majorColor} 1px, transparent 1px, transparent 200px),
            repeating-linear-gradient(to bottom, ${majorColor} 0px, ${majorColor} 1px, transparent 1px, transparent 200px)
          `,
          pointerEvents: "none",
        }}
      />
      {/* Organic paper grain (0.025 opacity) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN_SVG_DATA_URI,
          backgroundRepeat: "repeat",
          opacity: 0.025,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/** Helper to render highlighted keyword inside subtitle text without all-caps */
const renderHighlightedLine = (
  text: string,
  highlight: string | undefined,
  isDark: boolean
): React.ReactNode => {
  if (!highlight) {
    return text;
  }
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) {
    return text;
  }
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);

  return (
    <>
      {before}
      <span
        style={{
          color: isDark ? COLORS.LIME : COLORS.INK,
          backgroundColor: isDark ? "rgba(221, 252, 53, 0.16)" : COLORS.LIME,
          padding: "1px 7px",
          borderRadius: 4,
          fontWeight: 700,
        }}
      >
        {match}
      </span>
      {after}
    </>
  );
};

/**
 * EditorialChrome: Crop Marks, Top Left Bar, Top Right Chapter Stepper + 3px Progress Bar,
 * Bottom Left Caption Toast, and collision-free Subtitle Bar.
 */
export const EditorialChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = isDarkCanvasFrame(frame);

  // Intro crop marks line-drawing animation (0-35 frames)
  const cropDraw = spring({
    frame,
    fps,
    config: SPRING_EDITORIAL,
  });
  const cropSize = interpolate(cropDraw, [0, 1], [0, 20], CLAMP);
  const cropColor = isDark ? COLORS.CROP_DARK : COLORS.CROP_LIGHT;

  // Reading progress bar (0..1)
  const progressRatio = interpolate(
    frame,
    [0, VIDEO_SPECS.DURATION_IN_FRAMES - 1],
    [0, 1],
    CLAMP
  );

  // Active toast
  const currentToast =
    TOAST_SEGMENTS.find((t) => frame >= t.from && frame < t.to) ??
    TOAST_SEGMENTS[TOAST_SEGMENTS.length - 1];

  // Active subtitle cue
  const activeSubtitle = SUBTITLES.find(
    (s) => frame >= s.from && frame < s.from + s.duration
  );

  let subtitleOpacity = 0;
  if (activeSubtitle) {
    const local = frame - activeSubtitle.from;
    const fadeIn = interpolate(local, [0, 10], [0, 1], CLAMP);
    const fadeOut = interpolate(
      local,
      [Math.max(10, activeSubtitle.duration - 10), activeSubtitle.duration],
      [1, 0],
      CLAMP
    );
    subtitleOpacity = fadeIn * fadeOut;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: Z_INDEX.CHROME }}>
      {/* A. Four Corner Crop Marks (20px, 28px from edges) */}
      {/* Top-Left */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          width: cropSize,
          height: cropSize,
          borderTop: `1.5px solid ${cropColor}`,
          borderLeft: `1.5px solid ${cropColor}`,
        }}
      />
      {/* Top-Right */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          width: cropSize,
          height: cropSize,
          borderTop: `1.5px solid ${cropColor}`,
          borderRight: `1.5px solid ${cropColor}`,
        }}
      />
      {/* Bottom-Left */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 28,
          width: cropSize,
          height: cropSize,
          borderBottom: `1.5px solid ${cropColor}`,
          borderLeft: `1.5px solid ${cropColor}`,
        }}
      />
      {/* Bottom-Right */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          width: cropSize,
          height: cropSize,
          borderBottom: `1.5px solid ${cropColor}`,
          borderRight: `1.5px solid ${cropColor}`,
        }}
      />

      {/* B. Top Left Bar (top: 32, left: 64) */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 64,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <IconBookQuill
          size={28}
          color={isDark ? COLORS.DARK_TEXT : COLORS.INK}
        />
        <span
          style={{
            fontFamily: FONTS.MONO,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: isDark ? COLORS.DARK_TEXT : COLORS.INK,
          }}
        >
          {STUDENT_META.headerBadge}
        </span>
      </div>

      {/* C. Top Right Chapter Stepper (top: 30, right: 64) + 3px Reading Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 30,
          right: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {CHAPTERS.map((ch) => {
            const isActive = frame >= ch.from && frame < ch.to;
            return (
              <div
                key={ch.id}
                style={{
                  fontFamily: FONTS.MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "6px 12px",
                  borderRadius: 999,
                  backgroundColor: isActive
                    ? COLORS.LIME
                    : isDark
                    ? "rgba(246, 244, 236, 0.08)"
                    : "rgba(20, 23, 21, 0.06)",
                  color: isActive
                    ? COLORS.CHARCOAL
                    : isDark
                    ? COLORS.DARK_MUTED
                    : COLORS.SLATE,
                  border: isActive
                    ? `1px solid ${COLORS.CHARCOAL}`
                    : isDark
                    ? "1px solid rgba(246, 244, 236, 0.14)"
                    : "1px solid rgba(20, 23, 21, 0.12)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {ch.label}
              </div>
            );
          })}
        </div>

        {/* 3px smooth reading progress bar */}
        <div
          style={{
            width: "100%",
            height: 3,
            borderRadius: 999,
            backgroundColor: isDark
              ? "rgba(246, 244, 236, 0.16)"
              : "rgba(20, 23, 21, 0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressRatio * 100}%`,
              height: "100%",
              backgroundColor: isDark ? COLORS.LIME : COLORS.CRIMSON,
            }}
          />
        </div>
      </div>

      {/* Subtitle Overlay (2-line max, safely above bottom toast and 76px clear left of StudentPiP) */}
      {activeSubtitle && subtitleOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            bottom: 94,
            left: 64,
            maxWidth: 1460,
            opacity: subtitleOpacity,
            zIndex: Z_INDEX.SUBTITLE,
          }}
        >
          <div
            style={{
              display: "inline-block",
              backgroundColor: isDark
                ? "rgba(26, 30, 28, 0.88)"
                : "rgba(255, 255, 255, 0.9)",
              border: isDark
                ? "1px solid rgba(246, 244, 236, 0.16)"
                : "1px solid rgba(20, 23, 21, 0.12)",
              borderRadius: 12,
              padding: "11px 20px",
              boxShadow: SHADOWS.CARD_LIGHT,
              fontFamily: FONTS.SANS,
              fontSize: 22,
              fontWeight: 500,
              lineHeight: 1.38,
              color: isDark ? COLORS.DARK_TEXT : COLORS.INK,
            }}
          >
            <div>
              {renderHighlightedLine(
                activeSubtitle.line1,
                activeSubtitle.highlight,
                isDark
              )}
            </div>
            {activeSubtitle.line2 && (
              <div>
                {renderHighlightedLine(
                  activeSubtitle.line2,
                  activeSubtitle.highlight,
                  isDark
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* D. Bottom Left Caption Toast (bottom: 34, left: 64) */}
      <div
        style={{
          position: "absolute",
          bottom: 34,
          left: 64,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: COLORS.CHARCOAL,
          color: COLORS.DARK_TEXT,
          border: isDark
            ? "1px solid rgba(246, 244, 236, 0.22)"
            : "1px solid rgba(20, 23, 21, 0.2)",
          borderRadius: 999,
          padding: "9px 18px",
          boxShadow: SHADOWS.TOAST,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: COLORS.LIME,
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: FONTS.MONO,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          {currentToast.label}
        </span>
      </div>
    </AbsoluteFill>
  );
};
