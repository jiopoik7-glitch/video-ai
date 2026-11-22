import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_APPLE, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, PocDropEmblem } from "../components/BotanicalUI";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part A (0 - 168): Research Gap Hook untuk ibu-ibu & petani pemula
  const showPartA = frame <= 170;
  const partAExit = interpolate(frame, [134, 168], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Part B (156 - 330): Titik kecil mekar -> Emblem Tetes POC + "Kenapa POC itu penting?"
  const showPartB = frame >= 154;
  const dotPop = spring({ frame: Math.max(0, frame - 158), fps, config: SPRING_SNAPPY });
  const emblemMorph = spring({ frame: Math.max(0, frame - 178), fps, config: SPRING_SILKY });
  const subIn = spring({ frame: Math.max(0, frame - 216), fps, config: SPRING_SILKY });
  const partBExit = interpolate(frame, [298, 330], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const dotScale = interpolate(emblemMorph, [0, 0.35], [1, 0], CLAMP) * dotPop;

  return (
    <AbsoluteFill>
      {showPartA && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 86px 120px 86px",
            opacity: 1 - partAExit,
            transform: `scale(${1 + partAExit * 0.06})`,
            filter: partAExit > 0.02 ? `blur(${partAExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, textAlign: "center" }}>
            <div
              style={{
                opacity: interpolate(frame, [4, 24], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [4, 24], [14, 0], CLAMP)}px)`,
                fontFamily: FONTS.MONO,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: COLORS.AMBER,
                backgroundColor: COLORS.AMBER_SOFT,
                border: "1.5px solid rgba(217, 119, 6, 0.25)",
                padding: "10px 26px",
                borderRadius: 999,
              }}
            >
              SERING DIALAMI PEMULA
            </div>

            <BlurWords
              start={12}
              stagger={7}
              fontSize={76}
              words={[
                { text: "Rajin" },
                { text: "disiram" },
                { text: "tiap" },
                { text: "hari," },
                { text: "tapi" },
                { text: "bunga" },
                { text: "tetap" },
                { text: "rontok?", amber: true, italic: true },
              ]}
            />

            <div
              style={{
                opacity: interpolate(frame, [74, 102], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [74, 102], [18, 0], CLAMP)}px)`,
                fontFamily: FONTS.SANS,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.45,
                color: COLORS.MUTED,
                maxWidth: 820,
              }}
            >
              Banyak pekebun pemula mengira air saja sudah cukup untuk membuat tanaman berbuah lebat.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {showPartB && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 84px 120px 84px",
            opacity: 1 - partBExit,
            transform: `scale(${1 + partBExit * 0.06})`,
            filter: partBExit > 0.02 ? `blur(${partBExit * 14}px)` : "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, textAlign: "center" }}>
            <div style={{ position: "relative", width: 148, height: 148, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {dotScale > 0.01 && (
                <div
                  style={{
                    position: "absolute",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: COLORS.INK,
                    transform: `scale(${dotScale})`,
                  }}
                />
              )}
              <div
                style={{
                  transform: `scale(${emblemMorph}) rotate(${interpolate(emblemMorph, [0, 1], [-16, 0], CLAMP)}deg)`,
                  opacity: emblemMorph,
                }}
              >
                <PocDropEmblem size={142} />
              </div>
            </div>

            <BlurWords
              start={184}
              stagger={7}
              fontSize={74}
              words={[
                { text: "Kenapa" },
                { text: "POC", accent: true },
                { text: "itu" },
                { text: "penting?", italic: true, accent: true },
              ]}
            />

            <div
              style={{
                opacity: subIn,
                transform: `translateY(${interpolate(subIn, [0, 1], [20, 0], CLAMP)}px)`,
                fontFamily: FONTS.SANS,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.45,
                color: COLORS.MUTED,
                maxWidth: 820,
              }}
            >
              Pupuk Organik Cair memberi nutrisi siap serap saat tanaman masuk fase berbunga dan berbuah.
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
