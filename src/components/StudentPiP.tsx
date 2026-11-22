import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { MEDIA_CONFIG, STUDENT_META, isDarkCanvasFrame } from "../data/sejarahData";
import { COLORS, FONTS, SHADOWS, Z_INDEX } from "../theme";

/**
 * StudentPiP: Fixed 256x154 frame at bottom: 34, right: 64, borderRadius: 16.
 * Priority:
 * 1. ENABLE_PIP_VIDEO -> OffthreadVideo (auto-muted if ENABLE_VOICEOVER_FILE is true)
 * 2. ENABLE_PIP_PHOTO -> Img with objectFit: "cover", objectPosition: "center 20%"
 * 3. Safe Editorial Silhouette Fallback
 */
export const StudentPiP: React.FC = () => {
  const frame = useCurrentFrame();
  const isDark = isDarkCanvasFrame(frame);

  const shouldMuteVideo =
    MEDIA_CONFIG.ENABLE_VOICEOVER_FILE || MEDIA_CONFIG.PIP_VIDEO_MUTED;

  const borderColor = isDark
    ? "rgba(246, 244, 236, 0.26)"
    : "rgba(20, 23, 21, 0.22)";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 34,
        right: 64,
        width: 256,
        height: 154,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: COLORS.INK,
        border: `1.5px solid ${borderColor}`,
        boxShadow: SHADOWS.PIP,
        zIndex: Z_INDEX.PIP,
      }}
    >
      {MEDIA_CONFIG.ENABLE_PIP_VIDEO ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <OffthreadVideo
            src={staticFile(MEDIA_CONFIG.PIP_VIDEO_FILE)}
            muted={shouldMuteVideo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 36,
              background:
                "linear-gradient(to top, rgba(17, 19, 18, 0.86) 0%, rgba(17, 19, 18, 0) 100%)",
              display: "flex",
              alignItems: "flex-end",
              padding: "0 12px 7px 12px",
            }}
          >
            <span
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.DARK_TEXT,
                letterSpacing: "0.02em",
              }}
            >
              {STUDENT_META.studentName} · {STUDENT_META.className}
            </span>
          </div>
        </div>
      ) : MEDIA_CONFIG.ENABLE_PIP_PHOTO ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Img
            src={staticFile(MEDIA_CONFIG.PIP_PHOTO_FILE)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
          {/* Ultra-thin dark gradient strip (~36px) so student label stays crisp without covering face */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 36,
              background:
                "linear-gradient(to top, rgba(17, 19, 18, 0.88) 0%, rgba(17, 19, 18, 0) 100%)",
              display: "flex",
              alignItems: "flex-end",
              padding: "0 12px 7px 12px",
            }}
          >
            <span
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.DARK_TEXT,
                letterSpacing: "0.02em",
              }}
            >
              {STUDENT_META.studentName} · {STUDENT_META.className}
            </span>
          </div>
        </div>
      ) : (
        /* Editorial Geometric Silhouette Fallback */
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.INK,
            padding: "14px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Top live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
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
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: COLORS.LIME,
                }}
              >
                PRESENTASI
              </span>
            </div>

            {/* Minimal geometric student bust SVG */}
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <circle
                cx="20"
                cy="14"
                r="6.5"
                stroke={COLORS.DARK_MUTED}
                strokeWidth="1.6"
              />
              <path
                d="M9 34C9 27.6 13.8 23.5 20 23.5C26.2 23.5 31 27.6 31 34"
                stroke={COLORS.DARK_MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Student academic identity */}
          <div>
            <div
              style={{
                fontFamily: FONTS.SANS,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.DARK_TEXT,
                lineHeight: 1.2,
              }}
            >
              {STUDENT_META.studentName}
            </div>
            <div
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 11,
                fontWeight: 500,
                color: COLORS.DARK_MUTED,
                marginTop: 4,
              }}
            >
              {STUDENT_META.className} · {STUDENT_META.schoolName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
