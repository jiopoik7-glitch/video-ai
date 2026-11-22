import React from "react";
import { Composition } from "remotion";
import { VIDEO_CONFIG } from "./config/videoConfig";
import { IOS26UnlockTheGardenApp } from "./App";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={VIDEO_CONFIG.id}
      component={IOS26UnlockTheGardenApp}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
  );
};
