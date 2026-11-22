import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACTS, COPY, MEDIA_CONFIG, TIMELINE } from "../data/videoData";
import {
  CLAMP,
  EASE_APPLE,
  FONT_SIZE,
  FONTS,
  PALETTE,
  SAFE,
  SPRING_SILKY,
  SPRING_TACTILE,
} from "../theme";
import {
  GlassSurface,
  Icon,
  TomatoPotSvg,
  TouchCursor,
} from "../components/LiquidGlassUI";

export const Act4Sheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = ACTS.act4.duration;

  const sheetIn = spring({
    frame: Math.max(0, frame - TIMELINE.act4.sheetStart),
    fps,
    config: SPRING_SILKY,
  });

  const exit = interpolate(
    frame,
    [TIMELINE.act4.exitStart, total - 1],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );

  const sheetY = interpolate(sheetIn, [0, 1], [720, 0], CLAMP) + exit * 120;
  const photoScale = interpolate(frame, [0, total - 1], [1.0, 1.06], CLAMP);

  // Interaksi tombol "Simpan Catatan" -> "Tersimpan" + ikon centang SVG
  const isSaved = frame >= TIMELINE.act4.buttonTap;
  const btnBounce = spring({
    frame: Math.max(0, frame - TIMELINE.act4.buttonTap),
    fps,
    config: SPRING_TACTILE,
  });
  const btnScale = isSaved ? interpolate(btnBounce, [0, 0.5, 1], [0.94, 1.03, 1], CLAMP) : 1;
  const checkDraw = interpolate(
    frame,
    [TIMELINE.act4.buttonTap, TIMELINE.act4.buttonTap + 12],
    [0, 1],
    CLAMP
  );

  // Kursor sentuh menuju tombol
  const cursorOpacity = interpolate(
    frame,
    [TIMELINE.act4.cursorAppear, TIMELINE.act4.cursorAppear + 12, TIMELINE.act4.cursorHide, TIMELINE.act4.cursorHide + 14],
    [0, 1, 1, 0],
    CLAMP
  );
  const move = interpolate(
    frame,
    [TIMELINE.act4.cursorAppear, TIMELINE.act4.buttonTap],
    [0, 1],
    { ...CLAMP, easing: EASE_APPLE }
  );
  const cursorX = interpolate(move, [0, 1], [540, 760], CLAMP);
  const cursorY = interpolate(move, [0, 1], [940, 560], CLAMP);
  const pressing = frame >= TIMELINE.act4.buttonTap - 4 && frame <= TIMELINE.act4.buttonTap + 10;

  // Kartu belakang meredup & mengecil (pengecualian resmi 2.3: bukan wrapper kaca lain)
  const bgScale = interpolate(sheetIn, [0, 1], [1, 0.94], CLAMP);
  const bgBlur = interpolate(sheetIn, [0, 1], [0, 6], CLAMP);

  return (
    <>
      {/* Kartu Belakang Kedalaman (tidak memakai backdropFilter & tidak membungkus elemen kaca lain) */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.left,
          right: SAFE.right,
          height: 180,
          borderRadius: 32,
          padding: "28px 32px",
          backgroundColor: "rgba(255, 255, 255, 0.52)",
          border: "1.5px solid rgba(255, 255, 255, 0.72)",
          opacity: 0.45 * (1 - exit),
          transform: `scale(${bgScale})`,
          filter: bgBlur > 0.2 ? `blur(${bgBlur}px)` : "none",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: FONT_SIZE.xs, fontWeight: 700, color: PALETTE.accent }}>
          {COPY.act3.tag}
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: FONT_SIZE.sm, fontWeight: 800, color: PALETTE.ink, marginTop: 8 }}>
          {COPY.act3.afterStatus}
        </div>
      </div>

      {/* Bottom Sheet menyentuh tepi bawah, SEMUA konten di atas y = 1440 (paddingBottom: SAFE.bottom) */}
      <GlassSurface
        variant="sheet"
        sheenStartFrame={12}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 24,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right,
          paddingBottom: SAFE.bottom + 24,
          opacity: 1 - exit,
          transform: `translate3d(0, ${sheetY}px, 0)`,
        }}
      >
        {/* Drag Handle Tipis */}
        <div
          style={{
            width: 72,
            height: 6,
            borderRadius: 999,
            backgroundColor: "rgba(15, 23, 20, 0.22)",
            margin: "0 auto 28px auto",
          }}
        />

        {/* Header Produk + Tombol Interaktif */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: FONT_SIZE.xs, fontWeight: 700, color: PALETTE.warm }}>
              {COPY.act4.tag}
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: FONT_SIZE.md,
                fontWeight: 800,
                color: PALETTE.ink,
                lineHeight: 1.12,
                marginTop: 4,
              }}
            >
              {COPY.act4.title}
            </div>
          </div>

          <div
            style={{
              transform: `scale(${btnScale})`,
              backgroundColor: isSaved ? PALETTE.accent : PALETTE.ink,
              color: PALETTE.white,
              borderRadius: 999,
              padding: "16px 26px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <Icon
              name={isSaved ? "check" : "bookmark"}
              size={30}
              color={PALETTE.white}
              drawProgress={isSaved ? checkDraw : 1}
            />
            <span style={{ fontFamily: FONTS.sans, fontSize: FONT_SIZE.xs, fontWeight: 700 }}>
              {isSaved ? COPY.act4.buttonDone : COPY.act4.buttonIdle}
            </span>
          </div>
        </div>

        {/* Bingkai Foto Produk (Img + staticFile jika enabled, placeholder kaca SVG jika false) */}
        <div
          style={{
            width: "100%",
            height: 440,
            borderRadius: 30,
            overflow: "hidden",
            backgroundColor: "rgba(255, 255, 255, 0.62)",
            border: "1.5px solid rgba(255, 255, 255, 0.90)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {MEDIA_CONFIG.produk1.enabled ? (
            <Img
              src={staticFile(MEDIA_CONFIG.produk1.file)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${photoScale})`,
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transform: `scale(${photoScale})`,
              }}
            >
              <TomatoPotSvg progress={1} size={300} />
              <div style={{ fontFamily: FONTS.sans, fontSize: FONT_SIZE.sm, fontWeight: 700, color: PALETTE.ink }}>
                {COPY.productName}
              </div>
            </div>
          )}
        </div>

        {/* Maksimal 2 Pil Spesifikasi Nyata (durasi < 22 detik) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
          {COPY.act4.specs.map((sp, idx) => {
            const st = idx === 0 ? TIMELINE.act4.pill1Start : TIMELINE.act4.pill2Start;
            const p = spring({ frame: Math.max(0, frame - st), fps, config: SPRING_SILKY });
            return (
              <div
                key={sp.tag}
                style={{
                  padding: "22px 24px",
                  borderRadius: 24,
                  backgroundColor: "rgba(255, 255, 255, 0.64)",
                  border: "1.5px solid rgba(255, 255, 255, 0.88)",
                  opacity: p,
                  transform: `translate3d(0, ${interpolate(p, [0, 1], [24, 0], CLAMP)}px, 0)`,
                }}
              >
                <div style={{ fontFamily: FONTS.mono, fontSize: FONT_SIZE.xs, fontWeight: 700, color: PALETTE.accent }}>
                  {sp.tag}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 700,
                    color: PALETTE.ink,
                    lineHeight: 1.25,
                    marginTop: 8,
                  }}
                >
                  {sp.label}
                </div>
              </div>
            );
          })}
        </div>
      </GlassSurface>

      <TouchCursor
        x={cursorX}
        y={cursorY}
        opacity={cursorOpacity * (1 - exit)}
        pressing={pressing}
      />
    </>
  );
};
