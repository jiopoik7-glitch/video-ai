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
import { CONTENT, MEDIA_CONFIG, TIMING } from "../data/videoData";
import { CLAMP, IOS_COLORS, IOS_FONT, LAYOUT, SPRING_IOS } from "../theme";
import { GlassSurface, SfIcon } from "../components/LiquidGlassUI";

export const Babak4ModalSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sheetIn = spring({
    frame,
    fps,
    config: SPRING_IOS,
  });

  const sheetY = interpolate(sheetIn, [0, 1], [1260, 0], CLAMP);
  const photoScale = interpolate(frame, [0, TIMING.modalSheet.duration - 1], [1.0, 1.05], CLAMP);

  // Subtle iOS Haptic Pulse on Prominent CTA button
  const ctaPulse = interpolate(
    frame,
    [
      TIMING.modalSheet.ctaPulseAt,
      TIMING.modalSheet.ctaPulseAt + 6,
      TIMING.modalSheet.ctaPulseAt + 14,
      TIMING.modalSheet.ctaPulseAt + 22,
    ],
    [1, 0.95, 1.02, 1],
    CLAMP
  );

  // Container-Concentric Corner Radius: Sheet outer 44px - padding 20px = inner visual 24px!
  const outerRadius = 44;
  const innerPad = 20;
  const concentricInnerRadius = outerRadius - innerPad; // 24px

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <GlassSurface
        variant="regular"
        borderRadius={`${outerRadius}px ${outerRadius}px 0px 0px`}
        sheenStartFrame={12}
        style={{
          width: "100%",
          paddingTop: 18,
          paddingLeft: LAYOUT.padX,
          paddingRight: LAYOUT.padX,
          // Seluruh konten penting berhenti di atas y = 1480 (bottomSafe = 440px)
          paddingBottom: LAYOUT.bottomSafe,
          transform: `translate3d(0, ${sheetY}px, 0)`,
        }}
      >
        {/* Authentic iOS Grabber Bar */}
        <div
          style={{
            width: 84,
            height: 10,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.34)",
            margin: "0 auto 28px auto",
          }}
        />

        {/* Eyebrow + Product Title */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: IOS_FONT,
              fontSize: 28,
              fontWeight: 600,
              color: IOS_COLORS.iosGreen,
            }}
          >
            {CONTENT.sheet.eyebrow}
          </div>
          <div
            style={{
              fontFamily: IOS_FONT,
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              color: IOS_COLORS.labelPrimary,
              marginTop: 6,
            }}
          >
            {CONTENT.sheet.title}
          </div>
        </div>

        {/* Concentric Visual Showcase Frame (Foto Realistis jika enabled, atau Apple Editorial Spec Card — ZERO kartun!) */}
        <div
          style={{
            width: "100%",
            height: 460,
            borderRadius: concentricInnerRadius,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            background:
              "radial-gradient(circle at 25% 20%, rgba(225, 29, 72, 0.38) 0%, rgba(21, 128, 61, 0.34) 48%, rgba(10, 20, 15, 0.94) 100%)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: MEDIA_CONFIG.produk1.enabled ? 0 : 34,
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
            <>
              {/* Apple Editorial Product Spec Card (Fallback elegan tanpa kartun SVG) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 18,
                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SfIcon name="leaf" size={34} color={IOS_COLORS.iosGreen} />
                </div>
                <span
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 26,
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.72)",
                    padding: "10px 20px",
                    borderRadius: 999,
                    backgroundColor: "rgba(255, 255, 255, 0.10)",
                  }}
                >
                  Dataran Rendah
                </span>
              </div>

              <div style={{ transform: `scale(${photoScale})`, transformOrigin: "left bottom" }}>
                <div
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 56,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.08,
                    color: "#FFFFFF",
                  }}
                >
                  Siap Tanam di Teras Rumah
                </div>
                <div
                  style={{
                    fontFamily: IOS_FONT,
                    fontSize: 30,
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.78)",
                    marginTop: 14,
                    lineHeight: 1.35,
                  }}
                >
                  Cocok untuk pot, media poros sekam bakar, dan perawatan pemula.
                </div>
              </div>
            </>
          )}
        </div>

        {/* 2 Spec Pills (Concentric Pill Row) */}
        <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
          {CONTENT.sheet.pills.map((pill) => (
            <div
              key={pill}
              style={{
                flex: 1,
                padding: "18px 20px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.09)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <SfIcon name="check" size={24} color={IOS_COLORS.iosGreen} />
              <span
                style={{
                  fontFamily: IOS_FONT,
                  fontSize: 28,
                  fontWeight: 600,
                  color: IOS_COLORS.labelPrimary,
                }}
              >
                {pill}
              </span>
            </div>
          ))}
        </div>

        {/* Authentic iOS 26 .glassProminent Primary CTA Button */}
        <div style={{ marginTop: 26, transform: `scale(${ctaPulse})` }}>
          <GlassSurface
            variant="glassProminent"
            borderRadius={999}
            sheenStartFrame={TIMING.modalSheet.ctaPulseAt - 6}
            style={{
              height: 112,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
            }}
          >
            <SfIcon name="bag" size={34} color="#FFFFFF" />
            <span
              style={{
                fontFamily: IOS_FONT,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                color: "#FFFFFF",
              }}
            >
              {CONTENT.sheet.ctaText}
            </span>
          </GlassSurface>
        </div>

        {/* Brand Signature */}
        <div
          style={{
            textAlign: "center",
            fontFamily: IOS_FONT,
            fontSize: 28,
            fontWeight: 500,
            color: IOS_COLORS.labelTertiary,
            marginTop: 20,
          }}
        >
          {CONTENT.sheet.brandFooter}
        </div>
      </GlassSurface>
    </AbsoluteFill>
  );
};
