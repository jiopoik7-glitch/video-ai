import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { DURATION_IN_FRAMES, SCENES } from "../data/storyData";
import { CLAMP, COLORS, loadStoryFonts } from "../theme";
import { AudioEngine } from "./AudioEngine";
import { Act1Hook } from "../scenes/Act1Hook";
import { Act2WhyTired } from "../scenes/Act2WhyTired";
import { Act3Tracking } from "../scenes/Act3Tracking";
import { Act4Complete } from "../scenes/Act4Complete";
import { Act5Closing } from "../scenes/Act5Closing";

export const MasterVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadStoryFonts();
  }, []);

  const pct = interpolate(frame, [0, DURATION_IN_FRAMES - 1], [0, 100], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.CREAM }}>
      {/* Act 2 mounts slightly before Act 1 whip-exit completes -> ZERO blank frames */}
      <Sequence from={SCENES.ACT2_WHY_TIRED.from} durationInFrames={SCENES.ACT2_WHY_TIRED.duration}>
        <Act2WhyTired />
      </Sequence>

      <Sequence from={SCENES.ACT1_HOOK.from} durationInFrames={SCENES.ACT1_HOOK.duration}>
        <Act1Hook />
      </Sequence>

      <Sequence from={SCENES.ACT3_TRACKING.from} durationInFrames={SCENES.ACT3_TRACKING.duration}>
        <Act3Tracking />
      </Sequence>

      <Sequence from={SCENES.ACT4_COMPLETE.from} durationInFrames={SCENES.ACT4_COMPLETE.duration}>
        <Act4Complete />
      </Sequence>

      <Sequence from={SCENES.ACT5_CLOSING.from} durationInFrames={SCENES.ACT5_CLOSING.duration}>
        <Act5Closing />
      </Sequence>

      {/* Ultra-subtle progress hairline */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "rgba(13, 25, 18, 0.08)",
          pointerEvents: "none",
          zIndex: 95,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: COLORS.EMERALD,
          }}
        />
      </div>

      <AudioEngine />
    </AbsoluteFill>
  );
};
