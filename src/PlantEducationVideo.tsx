import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const EASE_APPLE = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_PORTAL = Easing.bezier(0.83, 0, 0.17, 1);
const EASE_SMOOTH = Easing.bezier(0.25, 1, 0.5, 1);

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const MaskedLine: React.FC<{
  children: React.ReactNode;
  frame: number;
  start: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, frame, start, duration = 42, style }) => {
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const y = interpolate(progress, [0, 1], [110, 0]);
  const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1], CLAMP);

  return (
    <div style={{ overflow: "hidden", paddingBottom: "8px" }}>
      <div
        style={{
          transform: `translateY(${y}%)`,
          opacity,
          willChange: "transform, opacity",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface BentoItemProps {
  frame: number;
  start: number;
  activeStart: number;
  activeEnd: number;
  title: string;
  badge: string;
  desc: string;
  accent: string;
  icon: React.ReactNode;
}

const BentoCard: React.FC<BentoItemProps> = ({
  frame,
  start,
  activeStart,
  activeEnd,
  title,
  badge,
  desc,
  accent,
  icon,
}) => {
  const enter = interpolate(frame, [start, start + 48], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const y = interpolate(enter, [0, 1], [80, 0]);
  const scaleIn = interpolate(enter, [0, 1], [0.94, 1]);

  // Efek sorotan halus bergantian agar kartu terasa hidup
  const activeMid = (activeStart + activeEnd) / 2;
  const focus = interpolate(
    frame,
    [activeStart, activeMid, activeEnd],
    [0, 1, 0],
    { ...CLAMP, easing: EASE_SMOOTH }
  );
  const scaleFocus = 1 + focus * 0.025;
  const shadowAlpha = 0.05 + focus * 0.08;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${y}px) scale(${scaleIn * scaleFocus})`,
        backgroundColor: "#FFFFFF",
        borderRadius: "40px",
        padding: "42px 44px",
        display: "flex",
        alignItems: "center",
        gap: "34px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, ${shadowAlpha}), 0 2px 8px rgba(0, 0, 0, 0.03)`,
        border: `1.5px solid rgba(22, 163, 74, ${0.06 + focus * 0.35})`,
      }}
    >
      <div
        style={{
          width: "108px",
          height: "108px",
          borderRadius: "28px",
          backgroundColor: `${accent}16`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "#1D1D1F",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: accent,
              backgroundColor: `${accent}18`,
              padding: "6px 16px",
              borderRadius: "999px",
              letterSpacing: "0.2px",
            }}
          >
            {badge}
          </span>
        </div>
        <div
          style={{
            fontSize: "30px",
            lineHeight: 1.38,
            color: "#6E6E73",
            fontWeight: 400,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

export const PlantEducationVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // ==========================================
  // ACT 1: HOOK KINETIK (0.0s - 4.5s | 0 - 270)
  // ==========================================
  const showAct1 = frame <= 280;
  const act1Drift = interpolate(frame, [0, 275], [1, 1.07], CLAMP);
  const act1Exit = interpolate(frame, [228, 272], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const act1Opacity = 1 - act1Exit;
  const act1Scale = act1Drift + act1Exit * 0.14;
  const act1Blur = act1Exit * 18;
  const act1ShiftUp = interpolate(frame, [78, 128], [45, 0], {
    ...CLAMP,
    easing: EASE_APPLE,
  });

  // ==========================================
  // ACT 2: GLASS ROOT METER (4.3s - 9.6s | 255 - 575)
  // ==========================================
  const showAct2 = frame >= 250 && frame <= 585;
  const act2Enter = interpolate(frame, [258, 308], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const act2Exit = interpolate(frame, [535, 575], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const act2Opacity = act2Enter * (1 - act2Exit);
  const act2Scale =
    interpolate(act2Enter, [0, 1], [0.92, 1]) +
    interpolate(frame, [258, 575], [0, 0.035], CLAMP) -
    act2Exit * 0.06;
  const act2Blur = (1 - act2Enter) * 14 + act2Exit * 10;

  // Animasi angka & cincin kesehatan akar (38% -> 94%)
  const meterProgress = interpolate(frame, [345, 470], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const rootScore = Math.round(interpolate(meterProgress, [0, 1], [38, 94]));
  const ringColor = interpolateColors(
    meterProgress,
    [0, 0.45, 1],
    ["#F87171", "#FBBF24", "#34D399"]
  );
  const ringRadius = 155;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference * (1 - interpolate(meterProgress, [0, 1], [0.38, 0.94]));

  const stressOpacity = interpolate(meterProgress, [0, 0.38], [1, 0], CLAMP);
  const optimalOpacity = interpolate(meterProgress, [0.45, 0.85], [0, 1], CLAMP);

  // ==========================================
  // TRANSISI PORTAL PUTIH APPLE (542 - 600)
  // ==========================================
  const portalProgress = interpolate(frame, [542, 600], [0, 1], {
    ...CLAMP,
    easing: EASE_PORTAL,
  });
  const portalScale = interpolate(portalProgress, [0, 1], [0, 3.2]);

  // ==========================================
  // ACT 3: BENTO GRID BOOSTER (9.6s - 15.6s | 575 - 940)
  // ==========================================
  const showAct3 = frame >= 575 && frame <= 950;
  const act3Exit = interpolate(frame, [892, 940], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const act3Opacity = 1 - act3Exit;
  const act3ExitY = interpolate(act3Exit, [0, 1], [0, -70]);
  const act3Blur = act3Exit * 12;

  // ==========================================
  // ACT 4: APPLE FINALE LOCKUP (15.4s - 20.0s | 925 - 1200)
  // ==========================================
  const showAct4 = frame >= 920;
  const act4Drift = interpolate(frame, [925, 1200], [0.985, 1.035], CLAMP);
  const dividerWidth = interpolate(frame, [1032, 1085], [0, 140], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const brandPop = interpolate(frame, [1052, 1112], [0, 1], {
    ...CLAMP,
    easing: EASE_APPLE,
  });
  const brandY = interpolate(brandPop, [0, 1], [40, 0]);
  const sunBreath = interpolate(frame, [925, 1200], [0.9, 1.18], CLAMP);

  // Cahaya ambient kanvas gelap
  const darkOrbX = interpolate(frame, [0, 580], [-90, 110], CLAMP);
  const darkOrbY = interpolate(frame, [0, 580], [60, -80], CLAMP);

  // Progress bar ultra-tipis
  const topProgress = interpolate(frame, [0, 1200], [0, 100], CLAMP);
  const isLightMode = frame >= 572;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060907",
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      {/* Cahaya ambient lembut untuk Act 1 & 2 */}
      {frame < 605 && (
        <div
          style={{
            position: "absolute",
            width: "980px",
            height: "980px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.06) 42%, rgba(6,9,7,0) 72%)",
            top: "420px",
            left: "50px",
            transform: `translate(${darkOrbX}px, ${darkOrbY}px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ==================== ACT 1 ==================== */}
      {showAct1 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 84px",
            opacity: act1Opacity,
            transform: `scale(${act1Scale}) translateY(${act1ShiftUp}px)`,
            filter: act1Blur > 0.2 ? `blur(${act1Blur}px)` : "none",
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            <MaskedLine
              frame={frame}
              start={8}
              duration={44}
              style={{
                fontSize: "30px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#6EE7B7",
                marginBottom: "30px",
              }}
            >
              Seflorner
            </MaskedLine>

            <MaskedLine
              frame={frame}
              start={20}
              duration={48}
              style={{
                fontSize: "104px",
                fontWeight: 700,
                letterSpacing: "-3.5px",
                lineHeight: 1.06,
                color: "#F5F5F7",
              }}
            >
              Tanaman layu.
            </MaskedLine>

            <div style={{ height: "14px" }} />

            <MaskedLine
              frame={frame}
              start={84}
              duration={52}
              style={{
                fontSize: "92px",
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 1.08,
                background:
                  "linear-gradient(120deg, #A7F3D0 0%, #34D399 55%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bukan selalu kurang air.
            </MaskedLine>

            <div style={{ height: "42px" }} />

            <MaskedLine
              frame={frame}
              start={126}
              duration={48}
              style={{
                fontSize: "38px",
                fontWeight: 400,
                lineHeight: 1.42,
                color: "#A1A1AA",
                maxWidth: "820px",
                margin: "0 auto",
              }}
            >
              Media terlalu lembap bikin akar stres dan nutrisi gagal naik ke daun.
            </MaskedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== ACT 2 ==================== */}
      {showAct2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 72px",
            opacity: act2Opacity,
            transform: `scale(${act2Scale})`,
            filter: act2Blur > 0.2 ? `blur(${act2Blur}px)` : "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "62px",
            }}
          >
            <MaskedLine
              frame={frame}
              start={272}
              duration={44}
              style={{
                fontSize: "74px",
                fontWeight: 700,
                letterSpacing: "-2.2px",
                lineHeight: 1.1,
                color: "#F5F5F7",
              }}
            >
              Semuanya berawal
            </MaskedLine>
            <MaskedLine
              frame={frame}
              start={290}
              duration={44}
              style={{
                fontSize: "74px",
                fontWeight: 700,
                letterSpacing: "-2.2px",
                lineHeight: 1.1,
                color: "#86EFAC",
              }}
            >
              dari zona akar.
            </MaskedLine>
          </div>

          {/* Apple Glass Diagnostic Card */}
          <div
            style={{
              width: "100%",
              maxWidth: "840px",
              borderRadius: "52px",
              padding: "64px 56px",
              background:
                "linear-gradient(155deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1.5px solid rgba(255,255,255,0.14)",
              boxShadow: "0 40px 90px rgba(0, 0, 0, 0.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#A1A1AA",
                marginBottom: "36px",
              }}
            >
              Indeks Serapan Akar
            </div>

            {/* SVG Animated Ring */}
            <div
              style={{
                position: "relative",
                width: "360px",
                height: "360px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="360" height="360" viewBox="0 0 360 360">
                <circle
                  cx="180"
                  cy="180"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.09)"
                  strokeWidth="22"
                />
                <circle
                  cx="180"
                  cy="180"
                  r={ringRadius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 180 180)"
                />
              </svg>

              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "106px",
                    fontWeight: 700,
                    letterSpacing: "-4px",
                    color: "#FFFFFF",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {rootScore}%
                </span>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 500,
                    color: ringColor,
                    marginTop: "10px",
                  }}
                >
                  Oksigenasi
                </span>
              </div>
            </div>

            {/* Crossfade status pill */}
            <div
              style={{
                position: "relative",
                height: "66px",
                width: "100%",
                marginTop: "42px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  opacity: stressOpacity,
                  padding: "14px 34px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(248, 113, 113, 0.16)",
                  border: "1px solid rgba(248, 113, 113, 0.45)",
                  color: "#FCA5A5",
                  fontSize: "30px",
                  fontWeight: 600,
                }}
              >
                Akar Stres & Terlalu Basah
              </div>

              <div
                style={{
                  position: "absolute",
                  opacity: optimalOpacity,
                  padding: "14px 34px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(52, 211, 153, 0.16)",
                  border: "1px solid rgba(52, 211, 153, 0.45)",
                  color: "#6EE7B7",
                  fontSize: "30px",
                  fontWeight: 600,
                }}
              >
                Sirkulasi Optimal & Siap Nutrisi
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== PORTAL PUTIH APPLE ==================== */}
      {portalProgress > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "900px",
            height: "900px",
            marginLeft: "-450px",
            marginTop: "-450px",
            borderRadius: "50%",
            backgroundColor: "#F5F5F7",
            transform: `scale(${portalScale})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ==================== ACT 3: BENTO GRID ==================== */}
      {showAct3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            padding: "0 68px",
            opacity: act3Opacity,
            transform: `translateY(${act3ExitY}px)`,
            filter: act3Blur > 0.2 ? `blur(${act3Blur}px)` : "none",
          }}
        >
          <div style={{ marginBottom: "58px", paddingLeft: "8px" }}>
            <MaskedLine
              frame={frame}
              start={584}
              duration={42}
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#16A34A",
                marginBottom: "14px",
              }}
            >
              Formula Pendukung
            </MaskedLine>

            <MaskedLine
              frame={frame}
              start={596}
              duration={46}
              style={{
                fontSize: "84px",
                fontWeight: 700,
                letterSpacing: "-2.8px",
                lineHeight: 1.06,
                color: "#1D1D1F",
              }}
            >
              Tiga elemen.
            </MaskedLine>

            <MaskedLine
              frame={frame}
              start={614}
              duration={46}
              style={{
                fontSize: "84px",
                fontWeight: 700,
                letterSpacing: "-2.8px",
                lineHeight: 1.06,
                color: "#86868B",
              }}
            >
              Satu pemulihan.
            </MaskedLine>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <BentoCard
              frame={frame}
              start={635}
              activeStart={705}
              activeEnd={775}
              title="Chitosan"
              badge="Imunitas"
              desc="Merangsang pertahanan alami sel agar tanaman lebih tangguh."
              accent="#16A34A"
              icon={
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3L4 6.5V12C4 16.8 7.4 20.9 12 22C16.6 20.9 20 16.8 20 12V6.5L12 3Z"
                    stroke="#16A34A"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12.2L11.2 14.4L15.5 9.8"
                    stroke="#16A34A"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            <BentoCard
              frame={frame}
              start={662}
              activeStart={770}
              activeEnd={835}
              title="Gliserin"
              badge="Penetrasi"
              desc="Mengikat kelembapan sehingga larutan menempel dan meresap rata."
              accent="#0D9488"
              icon={
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2.8C12 2.8 5.5 10.1 5.5 14.5C5.5 18.1 8.4 21 12 21C15.6 21 18.5 18.1 18.5 14.5C18.5 10.1 12 2.8 12 2.8Z"
                    stroke="#0D9488"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            <BentoCard
              frame={frame}
              start={688}
              activeStart={830}
              activeEnd={895}
              title="Vitamin B1"
              badge="Anti-Stres"
              desc="Mempercepat adaptasi akar baru setelah pindah tanam atau layu."
              accent="#059669"
              icon={
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z"
                    stroke="#059669"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== ACT 4: FINALE LOCKUP ==================== */}
      {showAct4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
            transform: `scale(${act4Drift})`,
          }}
        >
          {/* Sinar matahari botani halus */}
          <div
            style={{
              position: "absolute",
              width: "1000px",
              height: "1000px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(134,239,172,0.32) 0%, rgba(254,240,138,0.16) 40%, rgba(245,245,247,0) 70%)",
              top: "-220px",
              right: "-220px",
              transform: `scale(${sunBreath})`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <MaskedLine
              frame={frame}
              start={938}
              duration={48}
              style={{
                fontSize: "88px",
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 1.08,
                color: "#1D1D1F",
              }}
            >
              Rawat akarnya.
            </MaskedLine>

            <MaskedLine
              frame={frame}
              start={974}
              duration={50}
              style={{
                fontSize: "88px",
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 1.08,
                background:
                  "linear-gradient(120deg, #15803D 0%, #16A34A 50%, #0D9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daun akan mengikuti.
            </MaskedLine>

            {/* Garis tipis penyeimbang */}
            <div
              style={{
                width: `${dividerWidth}px`,
                height: "4px",
                borderRadius: "999px",
                backgroundColor: "#D2D2D7",
                margin: "68px 0 56px 0",
              }}
            />

            {/* Brand Lockup */}
            <div
              style={{
                opacity: brandPop,
                transform: `translateY(${brandY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "96px",
                  fontWeight: 800,
                  letterSpacing: "-4px",
                  color: "#1D1D1F",
                  lineHeight: 1,
                }}
              >
                Seflorner<span style={{ color: "#16A34A" }}>.</span>
              </div>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 500,
                  color: "#6E6E73",
                  letterSpacing: "0.3px",
                }}
              >
                Takaran pas. Tumbuh konsisten.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Progress bar ultra-tipis ala Apple Story */}
      <div
        style={{
          position: "absolute",
          top: "52px",
          left: "64px",
          right: "64px",
          height: "6px",
          borderRadius: "999px",
          backgroundColor: isLightMode
            ? "rgba(0, 0, 0, 0.08)"
            : "rgba(255, 255, 255, 0.14)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: `${topProgress}%`,
            height: "100%",
            borderRadius: "999px",
            backgroundColor: isLightMode ? "#16A34A" : "#34D399",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
