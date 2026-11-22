import React from "react";
import { Composition } from "remotion";
import {
  LyricVideo,
  VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./LyricVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LyricPlain"
        component={LyricVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
