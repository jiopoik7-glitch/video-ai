import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENE_TIMELINE } from "./data/sceneTimeline";
import { IOSChrome } from "./components/system/IOSChrome";
import { AudioEngine } from "./components/audio/AudioEngine";
import { LockScreenScene } from "./scenes/LockScreenScene";
import { HomeScreenScene } from "./scenes/HomeScreenScene";
import { WhyGardenScene } from "./scenes/WhyGardenScene";
import { BenefitsScene } from "./scenes/BenefitsScene";
import { StartSmallScene } from "./scenes/StartSmallScene";
import { FinalMessageScene } from "./scenes/FinalMessageScene";

export const IOS26UnlockTheGardenApp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07120C" }}>
      <AudioEngine />

      <Sequence
        from={SCENE_TIMELINE.lockScreen.startFrame}
        durationInFrames={SCENE_TIMELINE.lockScreen.durationInFrames}
      >
        <LockScreenScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMELINE.homeScreen.startFrame}
        durationInFrames={SCENE_TIMELINE.homeScreen.durationInFrames}
      >
        <HomeScreenScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMELINE.whyGarden.startFrame}
        durationInFrames={SCENE_TIMELINE.whyGarden.durationInFrames}
      >
        <WhyGardenScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMELINE.theBenefits.startFrame}
        durationInFrames={SCENE_TIMELINE.theBenefits.durationInFrames}
      >
        <BenefitsScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMELINE.startSmall.startFrame}
        durationInFrames={SCENE_TIMELINE.startSmall.durationInFrames}
      >
        <StartSmallScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMELINE.finalMessage.startFrame}
        durationInFrames={SCENE_TIMELINE.finalMessage.durationInFrames}
      >
        <FinalMessageScene />
      </Sequence>

      {/* Persistent Global iOS 26 System Chrome */}
      <IOSChrome />
    </AbsoluteFill>
  );
};
