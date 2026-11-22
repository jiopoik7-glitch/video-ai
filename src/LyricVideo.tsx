import React, { useEffect } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap";

let fontLoaded = false;

function ensureFont(): void {
  if (typeof document === "undefined" || fontLoaded) return;
  fontLoaded = true;
  const handle = delayRender("Loading lyric font");
  let done = false;
  const finish = () => {
    if (!done) {
      done = true;
      continueRender(handle);
    }
  };
  const timer = globalThis.setTimeout(finish, 3000);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  link.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          globalThis.clearTimeout(timer);
          finish();
        })
        .catch(() => {
          globalThis.clearTimeout(timer);
          finish();
        });
    } else {
      globalThis.clearTimeout(timer);
      finish();
    }
  };
  link.onerror = () => {
    globalThis.clearTimeout(timer);
    finish();
  };
  document.head.appendChild(link);
}

interface WordCue {
  readonly text: string;
  readonly startSec: number;
}

interface Stanza {
  readonly id: string;
  readonly startSec: number;
  readonly endSec: number;
  readonly lines: readonly (readonly WordCue[])[];
}

const STANZAS: readonly Stanza[] = [
  {
    id: "s1",
    startSec: 1.05,
    endSec: 6.5,
    lines: [
      [
        { text: "isn't", startSec: 1.05 },
        { text: "it", startSec: 1.75 },
      ],
      [{ text: "strange", startSec: 2.15 }],
    ],
  },
  {
    id: "s2",
    startSec: 7.3,
    endSec: 13.5,
    lines: [
      [
        { text: "how", startSec: 7.3 },
        { text: "people", startSec: 7.9 },
      ],
      [
        { text: "can", startSec: 8.65 },
        { text: "change", startSec: 9.05 },
      ],
    ],
  },
  {
    id: "s3",
    startSec: 14.2,
    endSec: 17.55,
    lines: [
      [
        { text: "from", startSec: 14.2 },
        { text: "strangers", startSec: 14.55 },
      ],
      [
        { text: "to", startSec: 15.4 },
        { text: "friends", startSec: 15.85 },
      ],
    ],
  },
  {
    id: "s4",
    startSec: 17.85,
    endSec: 21.1,
    lines: [
      [
        { text: "friends", startSec: 17.85 },
        { text: "into", startSec: 18.5 },
      ],
      [{ text: "lovers", startSec: 19.3 }],
    ],
  },
  {
    id: "s5",
    startSec: 21.35,
    endSec: 26.5,
    lines: [
      [
        { text: "and", startSec: 21.35 },
        { text: "strangers", startSec: 21.75 },
      ],
      [{ text: "again", startSec: 23.15 }],
    ],
  },
];

export const LyricVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  useEffect(() => {
    ensureFont();
  }, []);

  const timeSec = frame / fps;
  const activeStanza = STANZAS.find(
    (s) => timeSec >= s.startSec && timeSec < s.endSec
  );

  // Kunci proporsi condensed, posisi rata-kiri, & ukuran font persis referensi Jennie
  const ratio = width / height;
  const leftAnchor =
    ratio >= 1.6 ? "39%" : ratio >= 1.2 ? "37%" : ratio >= 0.9 ? "31%" : "24%";
  const fontSize =
    ratio < 0.9 ? Math.round(width * 0.082) : Math.round(height * 0.086);

  if (!activeStanza) {
    return <AbsoluteFill style={{ backgroundColor: "#000000" }} />;
  }

  // Render hanya baris yang kata pertamanya sudah muncul -> Instant Vertical Snap!
  const visibleLines = activeStanza.lines
    .map((line) => line.filter((w) => timeSec >= w.startSec))
    .filter((line) => line.length > 0);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: leftAnchor,
          top: "50%",
          transform: "translateY(-50%) scaleX(0.83)",
          transformOrigin: "left center",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize,
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
          textAlign: "left",
          whiteSpace: "nowrap",
          filter: "blur(0.45px)",
          textShadow:
            "0 0 8px rgba(255, 255, 255, 0.34), 0 0 18px rgba(255, 255, 255, 0.14)",
        }}
      >
        {visibleLines.map((words, idx) => (
          <div key={`${activeStanza.id}-line-${idx}`}>
            {words.map((w) => w.text).join(" ")}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
