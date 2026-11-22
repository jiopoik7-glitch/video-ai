import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { SCENE_MAP, VIDEO_SPEC } from "./data/seflornerData";
import { CLAMP, COLORS, loadSeflornerFonts } from "./theme";
import { AudioEngine } from "./components/AudioEngine";
import { BotanicalAmbientCanvas } from "./components/BotanicalPrimitives";
import { Scene1Origin } from "./scenes/Scene1Origin";
import { Scene2SavingsSeeds } from "./scenes/Scene2SavingsSeeds";
import { Scene3Growth } from "./scenes/Scene3Growth";
import { Scene4HarvestAesthetic } from "./scenes/Scene4HarvestAesthetic";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const VideoSeflornerStory: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadSeflornerFonts();
  }, []);

  const progressPct = interpolate(
    frame,
    [0, VIDEO_SPEC.DURATION_IN_FRAMES - 1],
    [0, 100],
    CLAMP
  );

  return (
    <AbsoluteFill>
      <BotanicalAmbientCanvas />

      <Sequence from={SCENE_MAP.ORIGIN.from} durationInFrames={SCENE_MAP.ORIGIN.duration}>
        <Scene1Origin />
      </Sequence>

      <Sequence from={SCENE_MAP.SAVINGS.from} durationInFrames={SCENE_MAP.SAVINGS.duration}>
        <Scene2SavingsSeeds />
      </Sequence>

      <Sequence from={SCENE_MAP.GROWTH.from} durationInFrames={SCENE_MAP.GROWTH.duration}>
        <Scene3Growth />
      </Sequence>

      <Sequence from={SCENE_MAP.HARVEST.from} durationInFrames={SCENE_MAP.HARVEST.duration}>
        <Scene4HarvestAesthetic />
      </Sequence>

      <Sequence from={SCENE_MAP.OUTRO.from} durationInFrames={SCENE_MAP.OUTRO.duration}>
        <Scene5Outro />
      </Sequence>

      {/* Progress bar ultra-halus di bagian bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: "rgba(17, 26, 20, 0.05)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${COLORS.LEAF} 0%, ${COLORS.EMERALD} 100%)`,
          }}
        />
      </div>

      <AudioEngine />
    </AbsoluteFill>
  );
};
