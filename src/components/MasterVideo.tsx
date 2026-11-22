import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { CONTENT, DURATION_IN_FRAMES, TIMING } from "../data/videoData";
import { loadIosFonts } from "../theme";
import { AudioEngine } from "./AudioEngine";
import { DeepBotanicalWallpaper, IosSystemChrome } from "./LiquidGlassUI";
import { Babak1LockScreen } from "../scenes/Babak1LockScreen";
import { Babak2InsetGuide } from "../scenes/Babak2InsetGuide";
import { Babak3SegmentedCompare } from "../scenes/Babak3SegmentedCompare";
import { Babak4ModalSheet } from "../scenes/Babak4ModalSheet";

export const MasterVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadIosFonts();
  }, []);

  const progressRatio = frame / Math.max(1, DURATION_IN_FRAMES - 1);
  // Dynamic Island widens slightly into Live Activity after Lock Screen unlocks
  const liveActive = frame >= TIMING.lockScreen.unlockStart;

  return (
    <AbsoluteFill>
      <DeepBotanicalWallpaper />

      {/* Babak 2 mounts underneath as Babak 1 Lock Screen unlocks -> ZERO blank frames */}
      <Sequence from={TIMING.guide.from} durationInFrames={TIMING.guide.duration}>
        <Babak2InsetGuide />
      </Sequence>

      <Sequence from={TIMING.lockScreen.from} durationInFrames={TIMING.lockScreen.duration}>
        <Babak1LockScreen />
      </Sequence>

      {/* Babak 3 stays mounted and recedes into iOS Modal Depth as Babak 4 Sheet slides up */}
      <Sequence from={TIMING.compare.from} durationInFrames={TIMING.compare.duration}>
        <Babak3SegmentedCompare />
      </Sequence>

      <Sequence from={TIMING.modalSheet.from} durationInFrames={TIMING.modalSheet.duration}>
        <Babak4ModalSheet />
      </Sequence>

      <IosSystemChrome
        timeLabel={CONTENT.statusTime}
        progressRatio={progressRatio}
        liveActive={liveActive}
      />

      <AudioEngine />
    </AbsoluteFill>
  );
};
