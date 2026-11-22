import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface SceneProps {
  startFrame: number;
  endFrame: number;
  tag: string;
  headline: string;
  subtext: string;
  accentColor: string;
}

const SceneCard: React.FC<SceneProps> = ({
  startFrame,
  endFrame,
  tag,
  headline,
  subtext,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const localFrame = frame - startFrame;

  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.9 },
  });

  const subPop = spring({
    frame: Math.max(0, localFrame - 12),
    fps,
    config: { damping: 18, stiffness: 110 },
  });

  const fadeOut = interpolate(
    frame,
    [endFrame - 12, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(pop, [0, 1], [55, 0]);
  const subTranslateY = interpolate(subPop, [0, 1], [35, 0]);

  return (
    <div
      style={{
        opacity: fadeOut,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 76px",
        height: "100%",
        zIndex: 2,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity: pop,
          alignSelf: "flex-start",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          border: `1.5px solid ${accentColor}`,
          color: accentColor,
          padding: "12px 26px",
          borderRadius: "999px",
          fontSize: "30px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "38px",
        }}
      >
        {tag}
      </div>

      <div
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "stretch",
          marginBottom: "42px",
        }}
      >
        <div
          style={{
            width: "8px",
            borderRadius: "999px",
            backgroundColor: accentColor,
            transform: `scaleY(${pop})`,
            transformOrigin: "top",
          }}
        />
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            opacity: pop,
            fontSize: "74px",
            lineHeight: 1.15,
            fontWeight: 800,
            color: "#F4F6F0",
            letterSpacing: "-1px",
          }}
        >
          {headline}
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${subTranslateY}px)`,
          opacity: subPop,
          fontSize: "40px",
          lineHeight: 1.45,
          color: "#C6D1C5",
          fontWeight: 400,
          maxWidth: "900px",
        }}
      >
        {subtext}
      </div>
    </div>
  );
};

export const PlantEducationVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const glowDriftX = interpolate(frame, [0, durationInFrames], [-120, 140]);
  const glowDriftY = interpolate(frame, [0, durationInFrames], [-80, 100]);
  const progressWidth = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0E1511",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "820px",
          height: "820px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(116,184,114,0.22) 0%, rgba(116,184,114,0) 70%)",
          top: "240px",
          left: "130px",
          transform: `translate(${glowDriftX}px, ${glowDriftY}px)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "96px",
          left: "76px",
          right: "76px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#8EA393",
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "1px",
          zIndex: 3,
        }}
      >
        <span>SEFLORNER • EDUKASI TANAMAN</span>
        <span>
          00:{String(Math.min(20, Math.floor(frame / 30))).padStart(2, "0")} / 00:20
        </span>
      </div>

      <SceneCard
        startFrame={0}
        endFrame={150}
        tag="01 • Fakta Cepat"
        headline="Tanaman Layu Bukan Selalu Kurang Air"
        subtext="Media terlalu lembap atau akar stres justru bikin air dan nutrisi gagal naik ke daun."
        accentColor="#8CE08A"
      />

      <SceneCard
        startFrame={150}
        endFrame={300}
        tag="02 • Cek Akar"
        headline="Akar Sehat = Daun Bertahan"
        subtext="Perhatikan sirkulasi udara di zona akar sebelum menyiram ulang secara berlebihan."
        accentColor="#A3E68E"
      />

      <SceneCard
        startFrame={300}
        endFrame={450}
        tag="03 • Racikan Booster"
        headline="Chitosan, Gliserin & Vitamin B1"
        subtext="Kombinasi bahan pendukung ini membantu merangsang ketahanan dan pemulihan tanaman saat masa adaptasi."
        accentColor="#7FD8BE"
      />

      <SceneCard
        startFrame={450}
        endFrame={600}
        tag="04 • Catatan Penting"
        headline="Rawat Akarnya, Baru Kejar Rimbun"
        subtext="Takaran pas dan konsistensi jauh lebih efektif daripada dosis besar sekaligus."
        accentColor="#A8E689"
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: `${progressWidth}%`,
            height: "100%",
            backgroundColor: "#8CE08A",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
