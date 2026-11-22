import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HARVEST_CARDS } from "../data/seflornerData";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, GrowingGardenPlant, SeflornerLeafEmblem, SmoothCursor } from "../components/BotanicalPrimitives";

export const Scene4HarvestAesthetic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sub A (0 - 184): Golden Hour Aesthetic Camera Viewfinder
  const showViewfinder = frame <= 188;
  const vfIn = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SILKY });
  const vfExit = interpolate(frame, [156, 186], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  // Kursor mengeklik tombol "Abadikan" di pojok kanan atas viewfinder pada frame 112
  const cursorOp = interpolate(frame, [52, 68, 146, 160], [0, 1, 1, 0], CLAMP);
  const cursorX = interpolate(frame, [52, 108], [1160, 1495], { ...CLAMP, easing: EASE_SMOOTH });
  const cursorY = interpolate(frame, [52, 108], [680, 266], { ...CLAMP, easing: EASE_SMOOTH });
  const clicking = frame >= 108 && frame <= 122;
  const saved = frame >= 112;
  const btnScale = interpolate(frame, [106, 112, 122], [1, 0.9, 1], CLAMP);
  const shutterFlash = interpolate(frame, [111, 115, 126], [0, 0.45, 0], CLAMP);

  // Sub B (178 - 360): Floating Collage Cards "Video Aesthetic & Panen dari Kebun Sendiri"
  const showCollage = frame >= 176;
  const collageExit = interpolate(frame, [328, 360], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  return (
    <AbsoluteFill>
      {/* SUB A: AESTHETIC VIDEO CREATOR VIEWFINDER */}
      {showViewfinder && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 130px",
            opacity: 1 - vfExit,
            transform: `scale(${1 + vfExit * 0.05})`,
            filter: vfExit > 0.02 ? `blur(${vfExit * 12}px)` : "none",
          }}
        >
          <div
            style={{
              width: 1420,
              height: 720,
              backgroundColor: COLORS.WHITE,
              borderRadius: 34,
              border: `1.5px solid ${COLORS.BORDER}`,
              boxShadow: "0 40px 96px rgba(17, 26, 20, 0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              opacity: vfIn,
              transform: `translateY(${interpolate(vfIn, [0, 1], [54, 0], CLAMP)}px) scale(${interpolate(
                vfIn,
                [0, 1],
                [0.95, 1],
                CLAMP
              )})`,
            }}
          >
            {/* Top Creator Bar */}
            <div
              style={{
                padding: "24px 36px",
                borderBottom: `1px solid ${COLORS.BORDER}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <SeflornerLeafEmblem size={38} />
                <span style={{ fontFamily: FONTS.SANS, fontSize: 24, fontWeight: 800, color: COLORS.INK }}>
                  Seflorner · Studio Video Aesthetic
                </span>
                <span
                  style={{
                    fontFamily: FONTS.MONO,
                    fontSize: 15,
                    fontWeight: 700,
                    color: COLORS.TOMATO,
                    backgroundColor: "rgba(225, 29, 72, 0.1)",
                    padding: "6px 14px",
                    borderRadius: 999,
                    marginLeft: 10,
                  }}
                >
                  ● GOLDEN HOUR · 4K 60FPS
                </span>
              </div>

              <div
                style={{
                  transform: `scale(${btnScale})`,
                  backgroundColor: saved ? COLORS.EMERALD : COLORS.INK,
                  color: "#FFFFFF",
                  fontFamily: FONTS.SANS,
                  fontSize: 22,
                  fontWeight: 700,
                  padding: "13px 30px",
                  borderRadius: 16,
                  boxShadow: saved ? "0 10px 24px rgba(21, 128, 61, 0.34)" : "none",
                }}
              >
                {saved ? "Tersimpan ✓" : "Abadikan Momen"}
              </div>
            </div>

            {/* Body Viewfinder: Left Clip Storyboard + Right Golden Hour Preview */}
            <div style={{ display: "grid", gridTemplateColumns: "330px 1fr", flex: 1 }}>
              {/* Sidebar Clips */}
              <div
                style={{
                  borderRight: `1px solid ${COLORS.BORDER}`,
                  padding: "26px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  backgroundColor: COLORS.CANVAS,
                }}
              >
                <div style={{ fontFamily: FONTS.MONO, fontSize: 14, fontWeight: 700, color: COLORS.SUBTLE, marginBottom: 6 }}>
                  MOMEN KEBUN
                </div>
                {[
                  { title: "Siram Pagi", active: false },
                  { title: "Tunas Baru Mekar", active: false },
                  { title: "Panen Tomat Ceri", active: true },
                  { title: "Meja Panen Segar", active: false },
                ].map((clip) => (
                  <div
                    key={clip.title}
                    style={{
                      padding: "15px 18px",
                      borderRadius: 14,
                      backgroundColor: clip.active ? COLORS.EMERALD : "transparent",
                      color: clip.active ? "#FFFFFF" : COLORS.MUTED,
                      fontFamily: FONTS.SANS,
                      fontSize: 21,
                      fontWeight: clip.active ? 700 : 600,
                    }}
                  >
                    {clip.title}
                  </div>
                ))}
              </div>

              {/* Camera Preview Frame */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 36,
                  backgroundColor: "#F6F8F5",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    background:
                      "linear-gradient(135deg, #FFFBEB 0%, #ECFDF5 58%, #DCFCE7 100%)",
                    border: `1.5px solid ${COLORS.BORDER}`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: "0 48px",
                    overflow: "hidden",
                  }}
                >
                  {/* Sudut Viewfinder Kamera */}
                  {[
                    { top: 22, left: 22, bt: true, bl: true },
                    { top: 22, right: 22, bt: true, br: true },
                    { bottom: 22, left: 22, bb: true, bl: true },
                    { bottom: 22, right: 22, bb: true, br: true },
                  ].map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        top: c.top,
                        bottom: c.bottom,
                        left: c.left,
                        right: c.right,
                        width: 28,
                        height: 28,
                        borderTop: c.bt ? `2.5px solid ${COLORS.EMERALD}` : "none",
                        borderBottom: c.bb ? `2.5px solid ${COLORS.EMERALD}` : "none",
                        borderLeft: c.bl ? `2.5px solid ${COLORS.EMERALD}` : "none",
                        borderRight: c.br ? `2.5px solid ${COLORS.EMERALD}` : "none",
                      }}
                    />
                  ))}

                  <GrowingGardenPlant progress={1} size={350} />

                  <div style={{ maxWidth: 420 }}>
                    <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.EMERALD, marginBottom: 10 }}>
                      HASIL PANEN SENDIRI
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 44,
                        fontWeight: 800,
                        lineHeight: 1.12,
                        letterSpacing: "-0.03em",
                        color: COLORS.INK,
                      }}
                    >
                      Estetik di lensa,{" "}
                      <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontWeight: 400, color: COLORS.EMERALD }}>
                        segar di meja.
                      </span>
                    </div>
                    <div style={{ fontFamily: FONTS.SANS, fontSize: 22, color: COLORS.MUTED, marginTop: 14, lineHeight: 1.45 }}>
                      Kesenangan sederhana yang cuma bisa dirasakan saat memetik dari kebun sendiri.
                    </div>
                  </div>

                  {/* Efek Kilat Shutter Halus */}
                  {shutterFlash > 0.01 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#FFFFFF",
                        opacity: shutterFlash,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={clicking} />
        </AbsoluteFill>
      )}

      {/* SUB B: FLOATING COLLAGE CARDS (DNA Referensi frame 0:35) */}
      {showCollage && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 110px",
            opacity: 1 - collageExit,
            filter: collageExit > 0.02 ? `blur(${collageExit * 14}px)` : "none",
          }}
        >
          <div style={{ marginBottom: 78, textAlign: "center" }}>
            <BlurWords
              start={180}
              stagger={6}
              fontSize={64}
              words={[
                { text: "Video" },
                { text: "aesthetic,", italic: true, accent: true },
                { text: "panen" },
                { text: "dari" },
                { text: "kebun" },
                { text: "sendiri.", accent: true },
              ]}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 30,
              width: "100%",
              maxWidth: 1640,
            }}
          >
            {HARVEST_CARDS.map((card, idx) => {
              const p = spring({ frame: Math.max(0, frame - card.start), fps, config: SPRING_SNAPPY });
              const bob = Math.sin(frame / 20 + idx * 1.5) * 7;
              return (
                <div
                  key={card.code}
                  style={{
                    backgroundColor: COLORS.WHITE,
                    borderRadius: 28,
                    padding: "32px 30px",
                    height: 290,
                    border: `1.5px solid ${COLORS.BORDER}`,
                    boxShadow: "0 24px 56px rgba(17, 26, 20, 0.09)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    opacity: p,
                    transform: `translateY(${
                      interpolate(p, [0, 1], [65, 0], CLAMP) + bob
                    }px) rotate(${card.rot}deg) scale(${interpolate(p, [0, 1], [0.9, 1], CLAMP)})`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: FONTS.MONO,
                        fontSize: 15,
                        fontWeight: 700,
                        color: COLORS.EMERALD,
                        marginBottom: 14,
                      }}
                    >
                      {card.code}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.SANS,
                        fontSize: 34,
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        color: COLORS.INK,
                        lineHeight: 1.15,
                      }}
                    >
                      {card.title}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.SANS,
                      fontSize: 22,
                      lineHeight: 1.4,
                      color: COLORS.MUTED,
                    }}
                  >
                    {card.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
