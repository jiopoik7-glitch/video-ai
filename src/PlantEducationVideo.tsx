import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_MONO =
  '"SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// ==================================================
// 1. KOMPONEN TEKS BLUR-IN PER KATA (KHAS REFERENSI)
// ==================================================
const BlurWords: React.FC<{
  words: { text: string; accent?: boolean }[];
  frame: number;
  start: number;
  stagger?: number;
  fontSize?: number;
  lineHeight?: number;
}> = ({
  words,
  frame,
  start,
  stagger = 7,
  fontSize = 72,
  lineHeight = 1.22,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "18px",
        rowGap: "10px",
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        letterSpacing: "-2px",
        lineHeight,
      }}
    >
      {words.map((w, idx) => {
        const wStart = start + idx * stagger;
        const p = interpolate(frame, [wStart, wStart + 26], [0, 1], {
          ...CLAMP,
          easing: EASE_OUT,
        });
        const blur = interpolate(p, [0, 1], [16, 0]);
        const y = interpolate(p, [0, 1], [26, 0]);
        const scale = interpolate(p, [0, 1], [0.92, 1]);

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px) scale(${scale})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : "none",
              color: w.accent ? "#16A34A" : "#111827",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// ==================================================
// 2. MASKOT 3D "MOCHI TUNAS" (BERKEDIP & MEMANTUL)
// ==================================================
const MochiTunas: React.FC<{
  frame: number;
  size?: number;
  happy?: boolean;
}> = ({ frame, size = 140, happy = false }) => {
  const isBlink = frame % 145 > 137;
  const sproutWave = Math.sin(frame / 14) * 6;
  const floatY = Math.sin(frame / 18) * 5;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 1.18}px`,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        transform: `translateY(${floatY}px)`,
      }}
    >
      {/* Tunas daun mungil di atas kepala */}
      <svg
        width={size * 0.52}
        height={size * 0.42}
        viewBox="0 0 60 48"
        style={{
          position: "absolute",
          top: 0,
          transformOrigin: "bottom center",
          transform: `rotate(${sproutWave}deg)`,
          zIndex: 2,
        }}
      >
        <path
          d="M30 46 C30 30, 30 22, 30 16"
          stroke="#15803D"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M30 20 C16 20, 6 12, 8 4 C20 4, 28 10, 30 20 Z"
          fill="#22C55E"
        />
        <path
          d="M30 24 C44 24, 54 14, 52 6 C40 6, 32 13, 30 24 Z"
          fill="#4ADE80"
        />
      </svg>

      {/* Badan 3D Glossy Mochi */}
      <div
        style={{
          width: `${size * 0.88}px`,
          height: `${size * 0.96}px`,
          borderRadius: "50% 50% 47% 47% / 56% 56% 44% 44%",
          background:
            "radial-gradient(circle at 32% 26%, #FFFFFF 0%, #FFF7ED 32%, #FDE6CC 72%, #E5C29F 100%)",
          boxShadow:
            "0 18px 34px rgba(15, 23, 42, 0.16), inset -8px -12px 20px rgba(180, 120, 70, 0.22), inset 8px 10px 18px rgba(255, 255, 255, 0.9)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Mata & Pipi */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: `${size * 0.22}px`,
            marginTop: `${size * 0.08}px`,
          }}
        >
          <div
            style={{
              width: `${size * 0.095}px`,
              height: `${size * 0.11}px`,
              borderRadius: "999px",
              backgroundColor: "#1F2937",
              transform: `scaleY(${isBlink ? 0.12 : 1})`,
            }}
          />
          <div
            style={{
              width: `${size * 0.095}px`,
              height: `${size * 0.11}px`,
              borderRadius: "999px",
              backgroundColor: "#1F2937",
              transform: `scaleY(${isBlink ? 0.12 : 1})`,
            }}
          />
        </div>

        {/* Pipi merona */}
        <div
          style={{
            position: "absolute",
            width: `${size * 0.66}px`,
            display: "flex",
            justifyContent: "space-between",
            top: `${size * 0.56}px`,
          }}
        >
          <div
            style={{
              width: `${size * 0.14}px`,
              height: `${size * 0.08}px`,
              borderRadius: "999px",
              backgroundColor: "rgba(251, 113, 133, 0.42)",
              filter: "blur(2px)",
            }}
          />
          <div
            style={{
              width: `${size * 0.14}px`,
              height: `${size * 0.08}px`,
              borderRadius: "999px",
              backgroundColor: "rgba(251, 113, 133, 0.42)",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* Senyum mungil */}
        <svg
          width={size * 0.22}
          height={size * 0.14}
          viewBox="0 0 28 18"
          style={{ marginTop: `${size * 0.05}px` }}
        >
          <path
            d={happy ? "M4 4 Q14 16 24 4" : "M7 6 Q14 12 21 6"}
            stroke="#374151"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

// ==================================================
// 3. IKON PLAY-DAUN SEFLORNER (MIRIP BADGE REMOTION)
// ==================================================
const SeflornerBadge: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <path
      d="M28 24 C28 14, 39 9, 48 14 L98 44 C107 49, 107 63, 98 68 L48 98 C39 103, 28 98, 28 88 Z"
      fill="#86EFAC"
      opacity="0.4"
      transform="translate(-4, 4) scale(1.06)"
    />
    <path
      d="M32 28 C32 20, 41 16, 48 20 L92 46 C99 50, 99 61, 92 65 L48 91 C41 95, 32 91, 32 83 Z"
      fill="#4ADE80"
      opacity="0.65"
    />
    <path
      d="M36 33 C36 27, 43 24, 48 27 L84 48 C89 51, 89 59, 84 62 L48 83 C43 86, 36 83, 36 77 Z"
      fill="#16A34A"
    />
  </svg>
);

// ==================================================
// 4. KURSOR PANAH MOUSE ALA MACOS
// ==================================================
const MouseCursor: React.FC<{
  x: number;
  y: number;
  opacity: number;
  clicking?: boolean;
}> = ({ x, y, opacity, clicking = false }) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px) scale(${clicking ? 0.86 : 1})`,
        opacity,
        zIndex: 50,
        pointerEvents: "none",
        filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.22))",
      }}
    >
      <svg width="54" height="54" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 4L25 16.5L16 18.2L12.2 27L6 4Z"
          fill="#111827"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ==================================================
// KOMPONEN UTAMA VIDEO (22 DETIK @ 60FPS = 1320 FRAME)
// ==================================================
export const PlantEducationVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gerakan aura warna lembut di latar belakang putih
  const blob1X = interpolate(frame, [0, 1320], [-140, 160], CLAMP);
  const blob1Y = interpolate(frame, [0, 1320], [-120, 140], CLAMP);
  const blob2X = interpolate(frame, [0, 1320], [180, -160], CLAMP);
  const blob2Y = interpolate(frame, [0, 1320], [140, -120], CLAMP);

  // ==================================================
  // SCENE 1A: HOOK BLUR-IN (0 - 195 | 0.0s - 3.25s)
  // ==================================================
  const showS1A = frame <= 198;
  const s1aExit = interpolate(frame, [160, 195], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  // ==================================================
  // SCENE 1B: KENALIN SEFLORNER (185 - 335 | 3.1s - 5.6s)
  // ==================================================
  const showS1B = frame >= 184 && frame <= 340;
  const badgePop = spring({
    frame: Math.max(0, frame - 190),
    fps,
    config: { damping: 13, stiffness: 150 },
  });
  const textReveal = spring({
    frame: Math.max(0, frame - 208),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const s1bExit = interpolate(frame, [305, 335], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  // ==================================================
  // SCENE 2: TERMINAL TYPING + MASCOT + 3D TILT + PILLS
  // (325 - 645 | 5.4s - 10.75s)
  // ==================================================
  const showS2 = frame >= 325 && frame <= 650;
  const termIn = spring({
    frame: Math.max(0, frame - 330),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const s2Exit = interpolate(frame, [615, 645], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  const cmd1 = "$ cek-akar --media";
  const cmd1Count = Math.floor(
    interpolate(frame, [350, 385], [0, cmd1.length], CLAMP)
  );
  const showOut1 = frame >= 394;

  const cmd2 = "$ racik-booster --seflorner";
  const cmd2Count = Math.floor(
    interpolate(frame, [408, 448], [0, cmd2.length], CLAMP)
  );
  const showBar = frame >= 452;
  const barPct = interpolate(frame, [452, 496], [0, 100], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const showDone = frame >= 500;

  const peekPop = spring({
    frame: Math.max(0, frame - 442),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  const tiltProg = interpolate(frame, [515, 565], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const termRotY = interpolate(tiltProg, [0, 1], [0, 9]);
  const termRotX = interpolate(tiltProg, [0, 1], [0, 5]);
  const termShiftY = interpolate(tiltProg, [0, 1], [0, -185]);
  const termScale = interpolate(tiltProg, [0, 1], [1, 0.92]);

  const pills = [
    { pkg: "@chitosan", note: "Imunitas Alami", color: "#16A34A", start: 530 },
    { pkg: "@gliserin", note: "Penetrasi Merata", color: "#0D9488", start: 542 },
    { pkg: "@vitamin-b1", note: "Anti-Stres Akar", color: "#059669", start: 554 },
  ];

  // ==================================================
  // SCENE 3: INTERACTIVE STUDIO UI + CURSOR (635 - 935)
  // ==================================================
  const showS3 = frame >= 635 && frame <= 940;
  const s3CardIn = spring({
    frame: Math.max(0, frame - 658),
    fps,
    config: { damping: 16, stiffness: 125 },
  });
  const s3Exit = interpolate(frame, [905, 935], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  const dragProg = interpolate(frame, [725, 810], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const rootScore = Math.round(interpolate(dragProg, [0, 1], [38, 98]));
  const dosisVal = interpolate(dragProg, [0, 1], [0.5, 2.0]).toFixed(1);
  const sliderLeftPct = interpolate(dragProg, [0, 1], [18, 86]);

  const s3CursorOpacity = interpolate(
    frame,
    [690, 705, 885, 905],
    [0, 1, 1, 0],
    CLAMP
  );
  const s3CursorX = interpolate(
    frame,
    [690, 722, 810, 848],
    [760, 260, 795, 835],
    { ...CLAMP, easing: EASE_IN_OUT }
  );
  const s3CursorY = interpolate(
    frame,
    [690, 722, 810, 848],
    [1460, 1298, 1298, 702],
    { ...CLAMP, easing: EASE_IN_OUT }
  );
  const s3Clicking = frame >= 848 && frame <= 862;
  const s3Applied = frame >= 854;
  const s3BtnScale = interpolate(
    frame,
    [846, 852, 862],
    [1, 0.9, 1],
    CLAMP
  );

  // ==================================================
  // SCENE 4: MINI-CARD COLLAGE / BENTO SCATTER (925 - 1125)
  // ==================================================
  const showS4 = frame >= 925 && frame <= 1130;
  const s4Exit = interpolate(frame, [1095, 1125], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  // ==================================================
  // SCENE 5: PILL MORPH -> BRAND & MASCOT OUTRO (1115 - 1320)
  // ==================================================
  const showS5 = frame >= 1115;
  const pillIn = spring({
    frame: Math.max(0, frame - 1122),
    fps,
    config: { damping: 14, stiffness: 150 },
  });
  const pillCursorOp = interpolate(
    frame,
    [1144, 1156, 1192, 1206],
    [0, 1, 1, 0],
    CLAMP
  );
  const pillCursorX = interpolate(frame, [1144, 1174], [790, 620], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const pillCursorY = interpolate(frame, [1144, 1174], [1220, 975], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const pillClicking = frame >= 1175 && frame <= 1186;
  const pillPressScale = interpolate(
    frame,
    [1175, 1181, 1189],
    [1, 0.91, 1],
    CLAMP
  );
  const morphProg = interpolate(frame, [1186, 1210], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const pillVanish = interpolate(frame, [1206, 1222], [1, 0], CLAMP);
  const pillWidth = interpolate(morphProg, [0, 1], [540, 112]);

  const outroPop = spring({
    frame: Math.max(0, frame - 1218),
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAFBFD",
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      {/* Aura lembut bergerak khas referensi */}
      <div
        style={{
          position: "absolute",
          width: "960px",
          height: "960px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74, 222, 128, 0.24) 0%, rgba(74, 222, 128, 0) 68%)",
          top: "-260px",
          left: "-220px",
          transform: `translate(${blob1X}px, ${blob1Y}px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "1040px",
          height: "1040px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(52, 211, 153, 0.14) 36%, rgba(250, 251, 253, 0) 70%)",
          bottom: "-280px",
          right: "-240px",
          transform: `translate(${blob2X}px, ${blob2Y}px)`,
          pointerEvents: "none",
        }}
      />

      {/* ==================== SCENE 1A: HOOK ==================== */}
      {showS1A && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 90px",
            opacity: 1 - s1aExit,
            transform: `scale(${1 + s1aExit * 0.08})`,
            filter: s1aExit > 0.02 ? `blur(${s1aExit * 14}px)` : "none",
          }}
        >
          <BlurWords
            frame={frame}
            start={10}
            stagger={8}
            fontSize={74}
            words={[
              { text: "Pernah" },
              { text: "kepikiran" },
              { text: "kenapa" },
              { text: "tanaman" },
              { text: "bisa" },
              { text: "layu?", accent: true },
            ]}
          />
        </AbsoluteFill>
      )}

      {/* ==================== SCENE 1B: KENALIN ==================== */}
      {showS1B && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - s1bExit,
            transform: `scale(${1 + s1bExit * 0.08})`,
            filter: s1bExit > 0.02 ? `blur(${s1bExit * 14}px)` : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <span
              style={{
                fontSize: "74px",
                fontWeight: 700,
                letterSpacing: "-2.5px",
                color: "#111827",
                opacity: textReveal,
                transform: `translateX(${interpolate(textReveal, [0, 1], [40, 0])}px)`,
              }}
            >
              Kenalin
            </span>

            <div
              style={{
                transform: `scale(${badgePop})`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <SeflornerBadge size={104} />
            </div>

            <span
              style={{
                fontSize: "74px",
                fontWeight: 800,
                letterSpacing: "-2.5px",
                color: "#16A34A",
                opacity: textReveal,
                transform: `translateX(${interpolate(textReveal, [0, 1], [-40, 0])}px)`,
              }}
            >
              Seflorner
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== SCENE 2: TERMINAL + PILLS ==================== */}
      {showS2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 64px",
            opacity: 1 - s2Exit,
            filter: s2Exit > 0.02 ? `blur(${s2Exit * 14}px)` : "none",
          }}
        >
          {/* Container Terminal + Maskot Mengintip */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "940px",
              transform: `perspective(1200px) translateY(${
                interpolate(termIn, [0, 1], [100, 0]) + termShiftY
              }px) rotateY(${termRotY}deg) rotateX(${termRotX}deg) scale(${
                interpolate(termIn, [0, 1], [0.9, 1]) * termScale
              })`,
              opacity: termIn,
            }}
          >
            {/* Maskot mengintip di pojok kanan atas terminal */}
            <div
              style={{
                position: "absolute",
                top: "-116px",
                right: "42px",
                transform: `translateY(${interpolate(peekPop, [0, 1], [95, 0])}px) scale(${peekPop})`,
                opacity: peekPop,
                zIndex: 1,
              }}
            >
              <MochiTunas frame={frame} size={130} happy={showDone} />
            </div>

            {/* Jendela Terminal macOS */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                backgroundColor: "#0F172A",
                borderRadius: "36px",
                padding: "36px 40px 44px 40px",
                boxShadow:
                  "0 36px 80px rgba(15, 23, 42, 0.24), 0 4px 12px rgba(15, 23, 42, 0.1)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Top bar dots */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "34px",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                  }}
                />
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                  }}
                />
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#22C55E",
                  }}
                />
                <span
                  style={{
                    marginLeft: "14px",
                    fontFamily: FONT_MONO,
                    fontSize: "24px",
                    color: "#64748B",
                  }}
                >
                  seflorner/formula.ts
                </span>
              </div>

              {/* Isi Terminal */}
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "30px",
                  lineHeight: 1.75,
                  color: "#E2E8F0",
                  minHeight: "340px",
                }}
              >
                <div>
                  <span style={{ color: "#4ADE80" }}>
                    {cmd1.slice(0, cmd1Count)}
                  </span>
                  {frame >= 345 && frame < 394 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "14px",
                        height: "32px",
                        backgroundColor: "#4ADE80",
                        verticalAlign: "middle",
                        marginLeft: "6px",
                      }}
                    />
                  )}
                </div>

                {showOut1 && (
                  <div style={{ color: "#94A3B8" }}>
                    ✓ Akar stres & lembap terdeteksi
                  </div>
                )}

                {frame >= 406 && (
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ color: "#38BDF8" }}>
                      {cmd2.slice(0, cmd2Count)}
                    </span>
                    {frame >= 406 && frame < 452 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "14px",
                          height: "32px",
                          backgroundColor: "#38BDF8",
                          verticalAlign: "middle",
                          marginLeft: "6px",
                        }}
                      />
                    )}
                  </div>
                )}

                {showBar && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginTop: "18px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "24px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(148, 163, 184, 0.2)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barPct}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #4ADE80 0%, #22C55E 100%)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "26px",
                        color: "#CBD5E1",
                        fontVariantNumeric: "tabular-nums",
                        width: "110px",
                      }}
                    >
                      {Math.round(barPct)}%
                    </span>
                  </div>
                )}

                {showDone && (
                  <div style={{ color: "#4ADE80", marginTop: "16px" }}>
                    ✓ out/akar-sehat.booster siap
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating Pills muncul saat terminal miring */}
          <div
            style={{
              position: "absolute",
              bottom: "250px",
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {pills.map((item) => {
              const p = spring({
                frame: Math.max(0, frame - item.start),
                fps,
                config: { damping: 14, stiffness: 140 },
              });
              return (
                <div
                  key={item.pkg}
                  style={{
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(
                      p,
                      [0, 1],
                      [0.92, 1]
                    )})`,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "28px",
                    padding: "28px 38px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow:
                      "0 20px 44px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)",
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "34px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {item.pkg}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 600,
                      color: item.color,
                      backgroundColor: `${item.color}14`,
                      padding: "10px 22px",
                      borderRadius: "999px",
                    }}
                  >
                    {item.note}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== SCENE 3: STUDIO UI + KURSOR ==================== */}
      {showS3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 64px",
            opacity: 1 - s3Exit,
            filter: s3Exit > 0.02 ? `blur(${s3Exit * 14}px)` : "none",
          }}
        >
          {/* Judul atas */}
          <div style={{ marginBottom: "64px", width: "100%" }}>
            <BlurWords
              frame={frame}
              start={642}
              stagger={7}
              fontSize={66}
              words={[
                { text: "Tiap" },
                { text: "tetes" },
                { text: "=" },
                { text: "satu" },
                { text: "reaksi", accent: true },
              ]}
            />
          </div>

          {/* Kartu Aplikasi Seflorner Studio */}
          <div
            style={{
              width: "100%",
              maxWidth: "940px",
              backgroundColor: "#FFFFFF",
              borderRadius: "42px",
              boxShadow:
                "0 36px 88px rgba(15, 23, 42, 0.11), 0 4px 12px rgba(15, 23, 42, 0.04)",
              border: "1px solid rgba(15, 23, 42, 0.06)",
              overflow: "hidden",
              opacity: s3CardIn,
              transform: `translateY(${interpolate(s3CardIn, [0, 1], [70, 0])}px) scale(${interpolate(
                s3CardIn,
                [0, 1],
                [0.95, 1]
              )})`,
            }}
          >
            {/* Header Aplikasi */}
            <div
              style={{
                padding: "30px 38px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <SeflornerBadge size={42} />
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  Seflorner Studio
                </span>
              </div>

              {/* Tombol Terapkan yang diklik kursor */}
              <div
                style={{
                  transform: `scale(${s3BtnScale})`,
                  backgroundColor: s3Applied ? "#16A34A" : "#0F172A",
                  color: "#FFFFFF",
                  fontSize: "26px",
                  fontWeight: 700,
                  padding: "14px 32px",
                  borderRadius: "16px",
                  boxShadow: s3Applied
                    ? "0 10px 24px rgba(22, 163, 74, 0.35)"
                    : "0 8px 18px rgba(15, 23, 42, 0.18)",
                }}
              >
                {s3Applied ? "Selesai ✓" : "Terapkan"}
              </div>
            </div>

            {/* Body Aplikasi: Angka Serapan + Preview Maskot */}
            <div
              style={{
                padding: "48px 42px",
                display: "flex",
                flexDirection: "column",
                gap: "44px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "28px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "26px",
                      color: "#64748B",
                      marginBottom: "8px",
                    }}
                  >
                    serapanAkar()
                  </div>
                  <div
                    style={{
                      fontSize: "126px",
                      fontWeight: 800,
                      letterSpacing: "-5px",
                      color: "#0F172A",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {rootScore}
                    <span
                      style={{
                        fontSize: "58px",
                        color: "#16A34A",
                        letterSpacing: "-1px",
                      }}
                    >
                      %
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                      display: "inline-block",
                      backgroundColor: "#0F172A",
                      color: "#E2E8F0",
                      fontFamily: FONT_MONO,
                      fontSize: "24px",
                      padding: "12px 22px",
                      borderRadius: "14px",
                    }}
                  >
                    booster({dosisVal}ml) ={" "}
                    <span style={{ color: "#4ADE80" }}>optimal</span>
                  </div>
                </div>

                {/* Kotak Preview Maskot */}
                <div
                  style={{
                    width: "300px",
                    height: "280px",
                    borderRadius: "32px",
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${interpolate(dragProg, [0, 1], [0.85, 1.08])})`,
                    }}
                  >
                    <MochiTunas
                      frame={frame}
                      size={165}
                      happy={rootScore >= 75}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline / Slider Interaktif */}
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "24px",
                  padding: "30px 34px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#64748B",
                    marginBottom: "22px",
                  }}
                >
                  <span>Dosis Racikan Booster</span>
                  <span style={{ color: "#16A34A" }}>{dosisVal} ml / L</span>
                </div>

                <div
                  style={{
                    position: "relative",
                    height: "14px",
                    borderRadius: "999px",
                    backgroundColor: "#E2E8F0",
                  }}
                >
                  <div
                    style={{
                      width: `${sliderLeftPct}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(90deg, #4ADE80 0%, #16A34A 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${sliderLeftPct}%`,
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      border: "6px solid #16A34A",
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 6px 16px rgba(22, 163, 74, 0.3)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <MouseCursor
            x={s3CursorX}
            y={s3CursorY}
            opacity={s3CursorOpacity}
            clicking={s3Clicking}
          />
        </AbsoluteFill>
      )}

      {/* ==================== SCENE 4: MINI-CARD COLLAGE ==================== */}
      {showS4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 68px",
            opacity: 1 - s4Exit,
            filter: s4Exit > 0.02 ? `blur(${s4Exit * 14}px)` : "none",
          }}
        >
          <div style={{ marginBottom: "86px", width: "100%" }}>
            <BlurWords
              frame={frame}
              start={934}
              stagger={7}
              fontSize={66}
              words={[
                { text: "100%" },
                { text: "diracik" },
                { text: "untuk" },
                { text: "akar" },
                { text: "sehat", accent: true },
              ]}
            />
          </div>

          {/* Grid 2x2 Kartu Mini Miring Melayang */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            {[
              {
                rot: -4,
                start: 952,
                label: "Step 01",
                content: (
                  <div
                    style={{
                      fontSize: "30px",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.25,
                    }}
                  >
                    Cek kelembapan media dulu.
                  </div>
                ),
              },
              {
                rot: 3.5,
                start: 964,
                label: "Step 02",
                content: (
                  <div
                    style={{
                      backgroundColor: "#0F172A",
                      borderRadius: "16px",
                      padding: "16px 20px",
                      fontFamily: FONT_MONO,
                      fontSize: "22px",
                      color: "#4ADE80",
                    }}
                  >
                    $ racik-booster
                    <br />
                    <span style={{ color: "#94A3B8" }}>✓ 100% pas</span>
                  </div>
                ),
              },
              {
                rot: 3,
                start: 976,
                label: "Step 03",
                content: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "68px",
                        fontWeight: 800,
                        color: "#16A34A",
                        letterSpacing: "-3px",
                      }}
                    >
                      98%
                    </span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        color: "#64748B",
                      }}
                    >
                      serapan
                    </span>
                  </div>
                ),
              },
              {
                rot: -3.5,
                start: 988,
                label: "Step 04",
                content: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <SeflornerBadge size={54} />
                    <span
                      style={{
                        fontSize: "34px",
                        fontWeight: 800,
                        color: "#111827",
                        letterSpacing: "-1px",
                      }}
                    >
                      Seflorner
                    </span>
                  </div>
                ),
              },
            ].map((card, i) => {
              const pop = spring({
                frame: Math.max(0, frame - card.start),
                fps,
                config: { damping: 14, stiffness: 145 },
              });
              const bob = Math.sin(frame / 18 + i * 1.4) * 7;

              return (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "32px",
                    padding: "34px 32px",
                    height: "240px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow:
                      "0 24px 56px rgba(15, 23, 42, 0.09), 0 2px 6px rgba(15, 23, 42, 0.04)",
                    border: "1px solid rgba(15, 23, 42, 0.05)",
                    opacity: pop,
                    transform: `translateY(${
                      interpolate(pop, [0, 1], [65, 0]) + bob
                    }px) rotate(${card.rot}deg) scale(${interpolate(
                      pop,
                      [0, 1],
                      [0.9, 1]
                    )})`,
                  }}
                >
                  <div>{card.content}</div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "20px",
                      color: "#94A3B8",
                    }}
                  >
                    {card.label}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ==================== SCENE 5: PILL MORPH + OUTRO ==================== */}
      {showS5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Tombol Pil Interaktif yang mengecil jadi lingkaran */}
          {pillVanish > 0.01 && (
            <div
              style={{
                position: "absolute",
                width: `${pillWidth}px`,
                height: "112px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 26px 60px rgba(15, 23, 42, 0.14), 0 4px 12px rgba(15, 23, 42, 0.05)",
                border: "1px solid rgba(15, 23, 42, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: morphProg > 0.5 ? "center" : "space-between",
                padding: morphProg > 0.5 ? "0" : "0 16px 0 48px",
                opacity: pillIn * pillVanish,
                transform: `scale(${
                  pillIn *
                  pillPressScale *
                  interpolate(pillVanish, [0, 1], [1.25, 1])
                })`,
                overflow: "hidden",
              }}
            >
              {morphProg < 0.45 && (
                <span
                  style={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-1px",
                    whiteSpace: "nowrap",
                    opacity: interpolate(morphProg, [0, 0.35], [1, 0], CLAMP),
                  }}
                >
                  Coba Seflorner
                </span>
              )}

              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 10px 22px rgba(22, 163, 74, 0.35)",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}

          <MouseCursor
            x={pillCursorX}
            y={pillCursorY}
            opacity={pillCursorOp}
            clicking={pillClicking}
          />

          {/* Finale Lockup: Maskot + Brand + Tagline */}
          {frame >= 1216 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: outroPop,
                transform: `translateY(${interpolate(outroPop, [0, 1], [48, 0])}px) scale(${interpolate(
                  outroPop,
                  [0, 1],
                  [0.9, 1]
                )})`,
              }}
            >
              <MochiTunas frame={frame} size={220} happy={true} />

              <div
                style={{
                  marginTop: "28px",
                  fontSize: "88px",
                  fontWeight: 800,
                  letterSpacing: "-3.5px",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                Seflorner<span style={{ color: "#16A34A" }}>.</span>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  fontSize: "34px",
                  fontWeight: 600,
                  color: "#16A34A",
                }}
              >
                Rawat akarnya • Daun ikut sehat
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
