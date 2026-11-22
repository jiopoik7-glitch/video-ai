import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ACTS, DURATION_IN_FRAMES } from "../data/videoData";
import { CLAMP, COLORS, loadKineticFonts } from "../theme";
import { AudioEngine } from "./AudioEngine";
import { Act1HookBlob } from "../scenes/Act1HookBlob";
import { Act2MindPrompt } from "../scenes/Act2MindPrompt";
import { Act3SensoryGrid } from "../scenes/Act3SensoryGrid";
import { Act4ClosureList } from "../scenes/Act4ClosureList";
import { Act5OutroFolder } from "../scenes/Act5OutroFolder";

export const MasterVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadKineticFonts();
  }, []);

  const pct = interpolate(frame, [0, DURATION_IN_FRAMES - 1], [0, 100], CLAMP);

  return (
    <AbsoluteFill>
      <Sequence from={ACTS.ACT1_HOOK_BLOB.from} durationInFrames={ACTS.ACT1_HOOK_BLOB.duration}>
        <Act1HookBlob />
      </Sequence>

      <Sequence from={ACTS.ACT2_MIND_PROMPT.from} durationInFrames={ACTS.ACT2_MIND_PROMPT.duration}>
        <Act2MindPrompt />
      </Sequence>

      <Sequence from={ACTS.ACT3_SENSORY_GRID.from} durationInFrames={ACTS.ACT3_SENSORY_GRID.duration}>
        <Act3SensoryGrid />
      </Sequence>

      <Sequence from={ACTS.ACT4_CLOSURE_LIST.from} durationInFrames={ACTS.ACT4_CLOSURE_LIST.duration}>
        <Act4ClosureList />
      </Sequence>

      <Sequence from={ACTS.ACT5_OUTRO_FOLDER.from} durationInFrames={ACTS.ACT5_OUTRO_FOLDER.duration}>
        <Act5OutroFolder />
      </Sequence>

      {/* Ultra-slim kinetic progress line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: "rgba(12, 18, 11, 0.12)",
          pointerEvents: "none",
          zIndex: 95,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: COLORS.LIME,
          }}
        />
      </div>

      <AudioEngine />
    </AbsoluteFill>
  );
};
