import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { SCENE_MAP, VIDEO_SPEC } from "./data/pocData";
import { CLAMP, COLORS, loadFonts } from "./theme";
import { AudioEngine } from "./components/AudioEngine";
import { AmbientCanvas } from "./components/BotanicalUI";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2WhyPoc } from "./scenes/Scene2WhyPoc";
import { Scene3Simulation } from "./scenes/Scene3Simulation";
import { Scene4Showcase } from "./scenes/Scene4Showcase";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const VideoPocAffiliate: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadFonts();
  }, []);

  const progressPct = interpolate(
    frame,
    [0, VIDEO_SPEC.DURATION_IN_FRAMES - 1],
    [0, 100],
    CLAMP
  );

  return (
    <AbsoluteFill>
      <AmbientCanvas />

      <Sequence from={SCENE_MAP.HOOK.from} durationInFrames={SCENE_MAP.HOOK.duration}>
        <Scene1Hook />
      </Sequence>

      <Sequence from={SCENE_MAP.WHY_POC.from} durationInFrames={SCENE_MAP.WHY_POC.duration}>
        <Scene2WhyPoc />
      </Sequence>

      <Sequence from={SCENE_MAP.SIMULATION.from} durationInFrames={SCENE_MAP.SIMULATION.duration}>
        <Scene3Simulation />
      </Sequence>

      <Sequence from={SCENE_MAP.SHOWCASE.from} durationInFrames={SCENE_MAP.SHOWCASE.duration}>
        <Scene4Showcase />
      </Sequence>

      <Sequence from={SCENE_MAP.OUTRO.from} durationInFrames={SCENE_MAP.OUTRO.duration}>
        <Scene5Outro />
      </Sequence>

      {/* Progress bar ultra-tipis di atas (aman dari caption & keranjang kuning TikTok di bawah) */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 64,
          right: 64,
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(17, 26, 20, 0.08)",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.AMBER} 0%, ${COLORS.EMERALD} 100%)`,
          }}
        />
      </div>

      <AudioEngine />
    </AbsoluteFill>
  );
};
