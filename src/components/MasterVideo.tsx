import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ACTS, COPY, DURATION_IN_FRAMES } from "../data/videoData";
import { loadAppleEditorialFonts } from "../theme";
import { AudioEngine } from "./AudioEngine";
import { IosMicroChrome, OrganicMeshCanvas } from "./LiquidGlassUI";
import { Act1Hook } from "../scenes/Act1Hook";
import { Act2Checklist } from "../scenes/Act2Checklist";
import { Act3Widget } from "../scenes/Act3Widget";
import { Act4Sheet } from "../scenes/Act4Sheet";
import { Act5Cta } from "../scenes/Act5Cta";

export const MasterVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadAppleEditorialFonts();
  }, []);

  const progressRatio = frame / Math.max(1, DURATION_IN_FRAMES - 1);

  return (
    <AbsoluteFill>
      <OrganicMeshCanvas />

      <Sequence from={ACTS.act1.from} durationInFrames={ACTS.act1.duration}>
        <Act1Hook />
      </Sequence>

      <Sequence from={ACTS.act2.from} durationInFrames={ACTS.act2.duration}>
        <Act2Checklist />
      </Sequence>

      <Sequence from={ACTS.act3.from} durationInFrames={ACTS.act3.duration}>
        <Act3Widget />
      </Sequence>

      <Sequence from={ACTS.act4.from} durationInFrames={ACTS.act4.duration}>
        <Act4Sheet />
      </Sequence>

      <Sequence from={ACTS.act5.from} durationInFrames={ACTS.act5.duration}>
        <Act5Cta />
      </Sequence>

      <IosMicroChrome timeLabel={COPY.statusTime} progressRatio={progressRatio} />

      <AudioEngine />
    </AbsoluteFill>
  );
};
