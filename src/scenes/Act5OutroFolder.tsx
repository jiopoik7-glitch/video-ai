import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CLAMP,
  COLORS,
  EASE_WHIP,
  FONT_SANS,
  SPRING_BOUNCE,
  SPRING_PUNCH,
  SPRING_SILKY,
} from "../theme";
import {
  BotanicalIcon,
  OrganicLimeBlob,
  SeflornerCircleEmblem,
} from "../components/KineticPrimitives";

export const Act5OutroFolder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0..124): "Satu pot kecil untuk" + 3 overlapping glossy circular icons (00:24–00:25 homage!)
  const showPhaseA = frame < 130;
  const textWhip = interpolate(frame, [4, 30], [0, 1], { ...CLAMP, easing: EASE_WHIP });
  const phaseAExit = interpolate(frame, [104, 126], [0, 1], { ...CLAMP, easing: EASE_WHIP });

  const b1 = spring({ frame: Math.max(0, frame - 42), fps, config: SPRING_BOUNCE });
  const b2 = spring({ frame: Math.max(0, frame - 54), fps, config: SPRING_BOUNCE });
  const b3 = spring({ frame: Math.max(0, frame - 66), fps, config: SPRING_BOUNCE });

  // Phase B (122..312): Clean Finale "Tenangkan Pikiranmu" + Rising Translucent Botanical Folder (00:26–00:29 homage!)
  const showFinale = frame >= 120;
  const word1 = spring({ frame: Math.max(0, frame - 124), fps, config: SPRING_PUNCH });
  const word2 = spring({ frame: Math.max(0, frame - 146), fps, config: SPRING_PUNCH });
  const folderRise = spring({ frame: Math.max(0, frame - 158), fps, config: SPRING_SILKY });
  const calmZoom = interpolate(frame, [180, 311], [1.0, 1.025], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.LIGHT_BG, overflow: "hidden" }}>
      {/* PHASE A: WHIP TEXT + 3 OVERLAPPING SENSORY ORBS (00:24–00:25!) */}
      {showPhaseA && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - phaseAExit,
            transform: `translate3d(${-phaseAExit * 340}px, 0, 0)`,
          }}
        >
          <OrganicLimeBlob size={720} x={1480 - frame * 3} y={760} blurPx={28} opacity={0.78} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 44,
              transform: `translate3d(${interpolate(textWhip, [0, 1], [320, 0], CLAMP)}px, 0, 0)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 92,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: COLORS.INK,
              }}
            >
              Satu pot kecil untuk
            </div>

            {/* 3 Glossy Overlapping Circular Badges */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {[
                { p: b1, bg: "linear-gradient(145deg, #22C55E 0%, #15803D 100%)", icon: "leaf" as const },
                { p: b2, bg: "linear-gradient(145deg, #F59E0B 0%, #D97706 100%)", icon: "sun" as const },
                { p: b3, bg: "linear-gradient(145deg, #A3E600 0%, #65A30D 100%)", icon: "sprout" as const },
              ].map((orb, idx) => (
                <div
                  key={orb.icon}
                  style={{
                    width: 126,
                    height: 126,
                    borderRadius: "50%",
                    background: orb.bg,
                    border: "5px solid #FFFFFF",
                    boxShadow: "0 18px 40px rgba(12, 18, 11, 0.22)",
                    marginLeft: idx === 0 ? 0 : -28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${orb.p}) translateY(${interpolate(orb.p, [0, 1], [50, 0], CLAMP)}px)`,
                    zIndex: 3 - idx,
                  }}
                >
                  <BotanicalIcon name={orb.icon} size={56} color="#FFFFFF" />
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE B: CLEAN FINALE + RISING FROSTED BOTANICAL FOLDER (00:26–00:29 homage!) */}
      {showFinale && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 225,
            transform: `scale(${calmZoom})`,
          }}
        >
          {/* Crisp Headline Lockup */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 28,
              fontFamily: FONT_SANS,
              fontSize: 108,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            <span
              style={{
                color: COLORS.INK,
                opacity: word1,
                transform: `translate3d(0, ${interpolate(word1, [0, 1], [34, 0], CLAMP)}px, 0)`,
              }}
            >
              Tenangkan
            </span>
            <span
              style={{
                color: COLORS.EMERALD,
                opacity: word2,
                transform: `translate3d(${interpolate(word2, [0, 1], [44, 0], CLAMP)}px, 0, 0)`,
              }}
            >
              Pikiranmu.
            </span>
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 32,
              fontWeight: 600,
              color: COLORS.INK_MUTED,
              marginTop: 18,
              opacity: interpolate(frame, [162, 188], [0, 1], CLAMP),
            }}
          >
            Tutup tab di kepala, mulai satu siklus yang tuntas.
          </div>

          {/* Rising Sleek Botanical Folder / Glass Folio from Bottom Edge (00:28–00:29!) */}
          <div
            style={{
              position: "absolute",
              bottom: -48,
              width: 980,
              height: 520,
              transform: `translate3d(0, ${interpolate(folderRise, [0, 1], [580, 0], CLAMP)}px, 0)`,
            }}
          >
            {/* Folder Tab */}
            <div
              style={{
                width: 310,
                height: 68,
                borderRadius: "30px 30px 0 0",
                background: "linear-gradient(180deg, #14532D 0%, #15803D 100%)",
                marginLeft: 28,
                display: "flex",
                alignItems: "center",
                paddingLeft: 32,
                fontFamily: FONT_SANS,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.LIME,
                letterSpacing: "0.06em",
              }}
            >
              RUANG TENANG
            </div>

            {/* Folder Body with Soft Translucent Emerald-Lime Sheen */}
            <div
              style={{
                width: "100%",
                height: 452,
                borderRadius: "0 44px 0 0",
                background:
                  "linear-gradient(145deg, #15803D 0%, #0F5132 45%, #0B2E1B 100%)",
                border: "2px solid rgba(163, 230, 0, 0.35)",
                boxShadow: "0 -26px 80px rgba(15, 81, 50, 0.30)",
                padding: "56px 64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Soft internal radial sheen */}
              <div
                style={{
                  position: "absolute",
                  top: -120,
                  right: -80,
                  width: 520,
                  height: 520,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(163, 230, 0, 0.35) 0%, rgba(163, 230, 0, 0) 68%)",
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 36, zIndex: 2 }}>
                <SeflornerCircleEmblem size={126} />
                <div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 74,
                      fontWeight: 800,
                      letterSpacing: "-0.035em",
                      color: COLORS.WHITE,
                      lineHeight: 1.02,
                    }}
                  >
                    Seflorner<span style={{ color: COLORS.LIME }}>.</span>
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 28,
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.78)",
                      marginTop: 10,
                    }}
                  >
                    Let&apos;s start your own garden.
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: COLORS.LIME,
                  color: COLORS.DARK_BG,
                  fontFamily: FONT_SANS,
                  fontSize: 26,
                  fontWeight: 800,
                  padding: "18px 34px",
                  borderRadius: 999,
                  zIndex: 2,
                }}
              >
                Mulai Hari Ini
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
