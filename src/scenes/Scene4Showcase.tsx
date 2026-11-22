import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLLAGE_SPECS, MEDIA_CONFIG } from "../data/pocData";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SPRING_SILKY, SPRING_SNAPPY } from "../theme";
import { BlurWords, PocDropEmblem, SmoothCursor } from "../components/BotanicalUI";

export const Scene4Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sub A (0 - 186): Real Product Photo Showcase (Foto kebun nyata + kursor klik tombol)
  const showPhotoShowcase = frame <= 188;
  const vfIn = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SILKY });
  const vfExit = interpolate(frame, [156, 186], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const cursorOp = interpolate(frame, [52, 68, 146, 160], [0, 1, 1, 0], CLAMP);
  const cursorX = interpolate(frame, [52, 108], [620, 825], { ...CLAMP, easing: EASE_SMOOTH });
  const cursorY = interpolate(frame, [52, 108], [960, 326], { ...CLAMP, easing: EASE_SMOOTH });
  const clicking = frame >= 108 && frame <= 122;
  const confirmed = frame >= 112;
  const btnScale = interpolate(frame, [106, 112, 122], [1, 0.9, 1], CLAMP);
  const flash = interpolate(frame, [111, 115, 126], [0, 0.38, 0], CLAMP);
  const photoZoom = interpolate(frame, [0, 180], [1.0, 1.07], CLAMP);

  // Sub B (178 - 360): Studio Product Header + 2x2 Tilted Floating Spec Collage
  const showCollage = frame >= 176;
  const collageExit = interpolate(frame, [328, 360], [0, 1], { ...CLAMP, easing: EASE_APPLE });
  const studioIn = spring({ frame: Math.max(0, frame - 182), fps, config: SPRING_SILKY });

  return (
    <AbsoluteFill>
      {/* SUB A: REAL PRODUCT SHOWCASE WITH ACTUAL USER PHOTO */}
      {showPhotoShowcase && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "130px 64px 200px 64px",
            opacity: 1 - vfExit,
            transform: `scale(${1 + vfExit * 0.05})`,
            filter: vfExit > 0.02 ? `blur(${vfExit * 12}px)` : "none",
          }}
        >
          <div
            style={{
              width: "100%",
              backgroundColor: COLORS.WHITE,
              borderRadius: 40,
              border: `1.5px solid ${COLORS.BORDER}`,
              boxShadow: "0 40px 96px rgba(17, 26, 20, 0.13)",
              overflow: "hidden",
              opacity: vfIn,
              transform: `translateY(${interpolate(vfIn, [0, 1], [54, 0], CLAMP)}px) scale(${interpolate(
                vfIn,
                [0, 1],
                [0.95, 1],
                CLAMP
              )})`,
            }}
          >
            {/* Header Bar */}
            <div
              style={{
                padding: "28px 34px",
                borderBottom: `1px solid ${COLORS.BORDER}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <PocDropEmblem size={44} />
                <div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 28, fontWeight: 800, color: COLORS.INK }}>
                    Paket Infarm
                  </div>
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 16, color: COLORS.EMERALD, fontWeight: 700 }}>
                    POC 500ML + FRUIT EXPERT
                  </div>
                </div>
              </div>

              <div
                style={{
                  transform: `scale(${btnScale})`,
                  backgroundColor: confirmed ? COLORS.EMERALD : COLORS.INK,
                  color: "#FFFFFF",
                  fontFamily: FONTS.SANS,
                  fontSize: 22,
                  fontWeight: 700,
                  padding: "14px 26px",
                  borderRadius: 16,
                  boxShadow: confirmed ? "0 10px 24px rgba(21, 128, 61, 0.34)" : "none",
                }}
              >
                {confirmed ? "1x / Minggu ✓" : "Aplikasi Sore"}
              </div>
            </div>

            {/* Foto Asli Produk di Kebun Jeruk */}
            <div style={{ padding: 28 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 820,
                  borderRadius: 28,
                  overflow: "hidden",
                  border: `1px solid ${COLORS.BORDER}`,
                }}
              >
                <Img
                  src={staticFile(MEDIA_CONFIG.PHOTO_KEBUN)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${photoZoom})`,
                  }}
                />

                {/* Viewfinder Corners */}
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
                      width: 30,
                      height: 30,
                      borderTop: c.bt ? "3px solid #FFFFFF" : "none",
                      borderBottom: c.bb ? "3px solid #FFFFFF" : "none",
                      borderLeft: c.bl ? "3px solid #FFFFFF" : "none",
                      borderRight: c.br ? "3px solid #FFFFFF" : "none",
                    }}
                  />
                ))}

                {/* Bottom Glass Caption over Product Photo */}
                <div
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 24,
                    backgroundColor: "rgba(17, 26, 20, 0.78)",
                    borderRadius: 22,
                    padding: "22px 26px",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                  }}
                >
                  <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.MINT }}>
                    DUO NUTRISI LENGKAP UNTUK PEMULA
                  </div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 30, fontWeight: 700, color: "#FFFFFF", marginTop: 6, lineHeight: 1.3 }}>
                    Cukup semprot POC ke daun & kocor Fruit Expert ke media tanam.
                  </div>
                </div>

                {flash > 0.01 && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF", opacity: flash }} />
                )}
              </div>
            </div>
          </div>

          <SmoothCursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={clicking} />
        </AbsoluteFill>
      )}

      {/* SUB B: STUDIO PRODUCT BANNER + 2x2 FLOATING TILTED COLLAGE */}
      {showCollage && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "130px 64px 200px 64px",
            opacity: 1 - collageExit,
            filter: collageExit > 0.02 ? `blur(${collageExit * 14}px)` : "none",
          }}
        >
          <div style={{ width: "100%", textAlign: "center", marginBottom: 34 }}>
            <BlurWords
              start={180}
              stagger={6}
              fontSize={58}
              words={[
                { text: "Satu" },
                { text: "paket," },
                { text: "panen" },
                { text: "lebih" },
                { text: "lebat.", accent: true, italic: true },
              ]}
            />
          </div>

          {/* Kartu Studio Foto Produk Asli (produk-paket.jpg) */}
          <div
            style={{
              width: "100%",
              height: 410,
              borderRadius: 34,
              backgroundColor: COLORS.WHITE,
              border: `1.5px solid ${COLORS.BORDER}`,
              boxShadow: "0 24px 60px rgba(17, 26, 20, 0.09)",
              overflow: "hidden",
              marginBottom: 34,
              opacity: studioIn,
              transform: `translateY(${interpolate(studioIn, [0, 1], [42, 0], CLAMP)}px)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile(MEDIA_CONFIG.PHOTO_PAKET)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />
          </div>

          {/* 2x2 Tilted Floating Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: "100%" }}>
            {COLLAGE_SPECS.map((card, idx) => {
              const p = spring({ frame: Math.max(0, frame - card.start), fps, config: SPRING_SNAPPY });
              const bob = Math.sin(frame / 20 + idx * 1.4) * 6;
              return (
                <div
                  key={card.code}
                  style={{
                    backgroundColor: COLORS.WHITE,
                    borderRadius: 30,
                    padding: "28px 28px",
                    height: 270,
                    border: `1.5px solid ${COLORS.BORDER}`,
                    boxShadow: "0 22px 50px rgba(17, 26, 20, 0.09)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    opacity: p,
                    transform: `translateY(${
                      interpolate(p, [0, 1], [60, 0], CLAMP) + bob
                    }px) rotate(${card.rot}deg) scale(${interpolate(p, [0, 1], [0.9, 1], CLAMP)})`,
                  }}
                >
                  <div>
                    <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.EMERALD, marginBottom: 10 }}>
                      {card.code}
                    </div>
                    <div style={{ fontFamily: FONTS.SANS, fontSize: 32, fontWeight: 800, color: COLORS.INK, lineHeight: 1.15 }}>
                      {card.title}
                    </div>
                  </div>
                  <div style={{ fontFamily: FONTS.SANS, fontSize: 23, lineHeight: 1.38, color: COLORS.MUTED }}>
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
