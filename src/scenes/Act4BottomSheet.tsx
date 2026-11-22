import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MEDIA_CONFIG, PRODUCT_SPECS } from "../data/videoData";
import { CLAMP, COLORS, EASE_APPLE, EASE_SMOOTH, FONTS, SAFE_ZONE, SPRING_SILKY } from "../theme";
import {
  IosTouchPointer,
  LiquidGlassCard,
  StrawberryEmblem,
  StrawberryPotArtwork,
} from "../components/LiquidGlassUI";

export const Act4BottomSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // iOS Modal Depth: kartu latar belakang sedikit mengecil & buram saat Bottom Sheet meluncur naik
  const sheetIn = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_SILKY });
  const sheetY = interpolate(sheetIn, [0, 1], [620, 0], CLAMP);
  const exit = interpolate(frame, [224, 250], [0, 1], { ...CLAMP, easing: EASE_APPLE });

  const photoZoom = interpolate(frame, [0, 240], [1.0, 1.07], CLAMP);

  // Micro-interaction tombol "Simpan Catatan" -> "Tersimpan ✓" di frame 145 (master 890)
  const pointerOp = interpolate(frame, [88, 102, 174, 192], [0, 1, 1, 0], CLAMP);
  const pointerX = interpolate(frame, [88, 138], [620, 815], { ...CLAMP, easing: EASE_SMOOTH });
  const pointerY = interpolate(frame, [88, 138], [940, 415], { ...CLAMP, easing: EASE_SMOOTH });
  const pressing = frame >= 140 && frame <= 154;
  const saved = frame >= 145;
  const btnScale = interpolate(frame, [138, 145, 156], [1, 0.9, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE.paddingTop,
        paddingBottom: SAFE_ZONE.paddingBottom,
        paddingLeft: SAFE_ZONE.paddingLeft,
        paddingRight: SAFE_ZONE.paddingRight,
        justifyContent: "flex-end",
        opacity: 1 - exit,
        filter: exit > 0.02 ? `blur(${exit * 10}px)` : "none",
      }}
    >
      {/* Kartu Belakang Meredup (iOS Modal Depth Layer) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop + 6,
          left: SAFE_ZONE.paddingLeft + 16,
          right: SAFE_ZONE.paddingRight + 16,
          height: 180,
          transform: `scale(${interpolate(sheetIn, [0, 1], [1, 0.94], CLAMP)})`,
          opacity: interpolate(sheetIn, [0, 1], [0.9, 0.45], CLAMP),
          filter: `blur(${interpolate(sheetIn, [0, 1], [0, 5], CLAMP)}px)`,
          pointerEvents: "none",
        }}
      >
        <LiquidGlassCard borderRadius={34} sheenStart={999} style={{ height: "100%", padding: "26px 32px" }}>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 18, color: COLORS.EMERALD, fontWeight: 700 }}>
            REKOMENDASI BIBIT PILIHAN · SEFLORNER
          </div>
          <div style={{ fontFamily: FONTS.SANS, fontSize: 32, fontWeight: 800, color: COLORS.INK, marginTop: 6 }}>
            Adaptasi Suhu Panas 94% Optimal
          </div>
        </LiquidGlassCard>
      </div>

      {/* iOS Liquid Glass Bottom Sheet (aman di atas paddingBottom 288px) */}
      <div
        style={{
          width: "100%",
          transform: `translateY(${sheetY}px)`,
        }}
      >
        <LiquidGlassCard borderRadius={42} sheenStart={14} style={{ padding: "24px 36px 36px 36px" }}>
          {/* iOS Sheet Drag Handle Bar */}
          <div
            style={{
              width: 96,
              height: 8,
              borderRadius: 999,
              backgroundColor: "rgba(17, 26, 20, 0.18)",
              margin: "0 auto 24px auto",
            }}
          />

          {/* Header Produk + Tombol Simpan Interaktif */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <StrawberryEmblem size={50} />
              <div>
                <div style={{ fontFamily: FONTS.MONO, fontSize: 17, fontWeight: 700, color: COLORS.BERRY }}>
                  BIBIT UNGGULAN
                </div>
                <div style={{ fontFamily: FONTS.SANS, fontSize: 34, fontWeight: 800, color: COLORS.INK }}>
                  Stroberi Dataran Rendah
                </div>
              </div>
            </div>

            <div
              style={{
                transform: `scale(${btnScale})`,
                backgroundColor: saved ? COLORS.EMERALD : COLORS.INK,
                color: COLORS.WHITE,
                fontFamily: FONTS.SANS,
                fontSize: 22,
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: 999,
                boxShadow: saved ? "0 10px 24px rgba(21, 128, 61, 0.3)" : "none",
              }}
            >
              {saved ? "Tersimpan ✓" : "Simpan Info"}
            </div>
          </div>

          {/* Bingkai Kaca Foto Produk Asli (dengan fallback SVG aman jika foto belum ditaruh) */}
          <div
            style={{
              width: "100%",
              height: 620,
              borderRadius: 30,
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              background: "linear-gradient(160deg, #FFF1F2 0%, #ECFDF5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {MEDIA_CONFIG.ENABLE_PRODUCT_PHOTO ? (
              <Img
                src={staticFile(MEDIA_CONFIG.PHOTO_PRIMARY)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${photoZoom})`,
                }}
              />
            ) : (
              <div style={{ transform: `scale(${photoZoom})` }}>
                <StrawberryPotArtwork progress={1} size={500} />
              </div>
            )}

            {/* Floating Glass Pill Tag di Atas Foto */}
            <div
              style={{
                position: "absolute",
                left: 20,
                bottom: 20,
                backgroundColor: "rgba(17, 26, 20, 0.76)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                color: COLORS.WHITE,
                borderRadius: 18,
                padding: "14px 22px",
                border: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            >
              <div style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: "#86EFAC" }}>
                TERBUKTI ADAPTIF DI POT TERAS
              </div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 25, fontWeight: 700, marginTop: 4 }}>
                Akar kuat, daun segar, cepat berbuah manis.
              </div>
            </div>
          </div>

          {/* 3 Pil Spesifikasi Nyata */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
            {PRODUCT_SPECS.map((sp) => (
              <div
                key={sp.label}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.62)",
                  border: "1.5px solid rgba(255, 255, 255, 0.88)",
                  borderRadius: 22,
                  padding: "18px 18px",
                }}
              >
                <div style={{ fontFamily: FONTS.MONO, fontSize: 15, fontWeight: 700, color: COLORS.BERRY }}>
                  {sp.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.SANS,
                    fontSize: 23,
                    fontWeight: 800,
                    color: COLORS.INK,
                    marginTop: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {sp.value}
                </div>
              </div>
            ))}
          </div>
        </LiquidGlassCard>
      </div>

      <IosTouchPointer x={pointerX} y={pointerY} opacity={pointerOp} pressing={pressing} />
    </AbsoluteFill>
  );
};
