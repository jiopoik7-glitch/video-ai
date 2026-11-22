import React from "react";
import { Composition } from "remotion";
import { COMPOSITION_ID, DURATION_IN_FRAMES } from "./data/editData";
import { FPS, H, W } from "./theme";
import { MasterEditedVideo } from "./components/MasterEditedVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={COMPOSITION_ID}
      component={MasterEditedVideo}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={DURATION_IN_FRAMES}
    />
  );
};
