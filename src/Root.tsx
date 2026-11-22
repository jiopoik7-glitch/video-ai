import React from "react";
import { Composition } from "remotion";
import { COMPOSITION_ID, DURATION_IN_FRAMES } from "./data/videoData";
import { FPS, H, W } from "./theme";
import { MasterVideo } from "./components/MasterVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={COMPOSITION_ID}
      component={MasterVideo}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={DURATION_IN_FRAMES}
    />
  );
};
