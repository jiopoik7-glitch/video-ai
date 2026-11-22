import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 60;
export const VIDEO_DURATION_SECONDS = 27;
export const VIDEO_DURATION_FRAMES = VIDEO_DURATION_SECONDS * VIDEO_FPS;

const FONT_SIZE_PX = 52;
const LINE_HEIGHT_RATIO = 1.15;
const LINE_HEIGHT_PX = FONT_SIZE_PX * LINE_HEIGHT_RATIO;
const LEFT_ANCHOR = "28%";

const WORD_FADE_DURATION_SEC = 0.26;
const WORD_START_BLUR_PX = 3;
const GLIDE_DURATION_SEC = 0.35;
const EXIT_MAX_BLUR_PX = 2.5;

const FONT_FAMILY = '"Inter", "Helvetica Neue", Arial, sans-serif';
const TEXT_HALATION_SHADOW =
  "0 0 10px rgba(255, 255, 255, 0.45), 0 0 22px rgba(255, 255, 255, 0.18)";

interface LyricWord {
  readonly text: string;
  readonly startSec: number;
}

interface LyricLine {
  readonly words: readonly LyricWord[];
}

interface LyricStanza {
  readonly id: string;
  readonly lines: readonly LyricLine[];
  readonly exitStartSec: number;
  readonly exitEndSec: number;
}

const STANZAS: readonly LyricStanza[] = [
  {
    id: "stanza-1",
    lines: [
      {
        words: [
          { text: "isn't", startSec: 1.05 },
          { text: "it", startSec: 1.7 },
          { text: "strange", startSec: 2.15 },
        ],
      },
    ],
    exitStartSec: 6.15,
    exitEndSec: 6.55,
  },
  {
    id: "stanza-2",
    lines: [
      {
        words: [
          { text: "how", startSec: 7.25 },
          { text: "people", startSec: 7.8 },
        ],
      },
      {
        words: [
          { text: "can", startSec: 8.55 },
          { text: "change", startSec: 8.95 },
        ],
      },
    ],
    exitStartSec: 13.2,
    exitEndSec: 13.6,
  },
  {
    id: "stanza-3",
    lines: [
      {
        words: [
          { text: "from", startSec: 14.2 },
          { text: "strangers", startSec: 14.55 },
          { text: "to", startSec: 15.4 },
          { text: "friends", startSec: 15.85 },
        ],
      },
      {
        words: [
          { text: "friends", startSec: 17.85 },
          { text: "into", startSec: 18.45 },
          { text: "lovers", startSec: 19.25 },
        ],
      },
      {
        words: [
          { text: "and", startSec: 21.45 },
          { text: "strangers", startSec: 21.85 },
          { text: "again", startSec: 23.05 },
        ],
      },
    ],
    exitStartSec: 25.95,
    exitEndSec: 26.4,
  },
];

const waitForStylesheet = (el: HTMLLinkElement): Promise<void> =>
  new Promise((resolve) => {
    if (el.sheet) {
      resolve();
      return;
    }
    el.addEventListener("load", () => resolve(), { once: true });
    el.addEventListener("error", () => resolve(), { once: true });
  });

const useInterFont = (): void => {
  const [fontHandle] = useState<number>(() =>
    delayRender("Load Inter Google Fonts (400 & 500)")
  );

  useEffect(() => {
    let settled = false;
    const finish = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      continueRender(fontHandle);
    };

    const timeoutId = window.setTimeout(finish, 3000);

    const linkId = "inter-google-font-stylesheet";
    let linkEl = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.id = linkId;
      linkEl.rel = "stylesheet";
      linkEl.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap";
      document.head.appendChild(linkEl);
    }

    const loadFonts = async (): Promise<void> => {
      try {
        await waitForStylesheet(linkEl);
        if (document.fonts && typeof document.fonts.load === "function") {
          await Promise.all([
            document.fonts.load('400 52px "Inter"'),
            document.fonts.load('500 52px "Inter"'),
          ]);
          await document.fonts.ready;
        }
      } catch {
        // Fallback aman ke Helvetica Neue / Arial jika offline
      } finally {
        window.clearTimeout(timeoutId);
        finish();
      }
    };

    void loadFonts();

    return () => {
      window.clearTimeout(timeoutId);
      finish();
    };
  }, [fontHandle]);
};

interface StanzaBlockProps {
  readonly stanza: LyricStanza;
  readonly frame: number;
  readonly fps: number;
}

const StanzaBlock: React.FC<StanzaBlockProps> = ({ stanza, frame, fps }) => {
  const firstWordOfStanza = stanza.lines[0]?.words[0];
  if (!firstWordOfStanza) {
    return null;
  }

  const stanzaStartFrame = Math.round(firstWordOfStanza.startSec * fps);
  const exitStartFrame = Math.round(stanza.exitStartSec * fps);
  const exitEndFrame = Math.round(stanza.exitEndSec * fps);

  if (frame < stanzaStartFrame || frame > exitEndFrame) {
    return null;
  }

  const wordFadeFrames = Math.max(1, Math.round(WORD_FADE_DURATION_SEC * fps));
  const glideFrames = Math.max(1, Math.round(GLIDE_DURATION_SEC * fps));

  // Center-Glide: mulai dengan baris 1 tepat di tengah vertikal (-0.5 * lineHeight),
  // lalu naik halus 0.5 * lineHeight setiap kali baris berikutnya mulai timbul.
  let totalShiftLines = 0.5;
  for (let lineIdx = 1; lineIdx < stanza.lines.length; lineIdx++) {
    const lineFirstWord = stanza.lines[lineIdx]?.words[0];
    if (!lineFirstWord) {
      continue;
    }
    const lineStartFrame = Math.round(lineFirstWord.startSec * fps);
    const glideProgress = interpolate(
      frame,
      [lineStartFrame, lineStartFrame + glideFrames],
      [0, 1],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    totalShiftLines += 0.5 * glideProgress;
  }

  const translateYPx = -totalShiftLines * LINE_HEIGHT_PX;

  const exitOpacity = interpolate(
    frame,
    [exitStartFrame, exitEndFrame],
    [1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const exitBlurPx = interpolate(
    frame,
    [exitStartFrame, exitEndFrame],
    [0, EXIT_MAX_BLUR_PX],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const stanzaStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: LEFT_ANCHOR,
    transform: `translate3d(0, ${translateYPx.toFixed(2)}px, 0)`,
    opacity: exitOpacity,
    filter: exitBlurPx > 0.02 ? `blur(${exitBlurPx.toFixed(2)}px)` : undefined,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    fontFamily: FONT_FAMILY,
    fontSize: `${FONT_SIZE_PX}px`,
    fontWeight: 500,
    letterSpacing: "-0.03em",
    color: "#FFFFFF",
    textShadow: TEXT_HALATION_SHADOW,
    WebkitFontSmoothing: "antialiased",
  };

  return (
    <div style={stanzaStyle}>
      {stanza.lines.map((line, lineIdx) => {
        const lineStyle: React.CSSProperties = {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.27em",
          height: `${LINE_HEIGHT_PX}px`,
          lineHeight: `${LINE_HEIGHT_PX}px`,
          whiteSpace: "nowrap",
        };

        return (
          <div key={`${stanza.id}-line-${lineIdx}`} style={lineStyle}>
            {line.words.map((word, wordIdx) => {
              const wordStartFrame = Math.round(word.startSec * fps);
              const wordEndFrame = wordStartFrame + wordFadeFrames;

              const wordOpacity = interpolate(
                frame,
                [wordStartFrame, wordEndFrame],
                [0, 1],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const wordBlurPx = interpolate(
                frame,
                [wordStartFrame, wordEndFrame],
                [WORD_START_BLUR_PX, 0],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const wordStyle: React.CSSProperties = {
                display: "inline-block",
                opacity: wordOpacity,
                filter:
                  wordBlurPx > 0.02
                    ? `blur(${wordBlurPx.toFixed(2)}px)`
                    : undefined,
              };

              return (
                <span
                  key={`${stanza.id}-l${lineIdx}-w${wordIdx}`}
                  style={wordStyle}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const LyricVideo: React.FC = () => {
  useInterFont();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {STANZAS.map((stanza) => (
        <StanzaBlock
          key={stanza.id}
          stanza={stanza}
          frame={frame}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};
