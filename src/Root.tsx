import React from "react";
import { Composition } from "remotion";
import { VIDEO_SPEC } from "./data/seflornerData";
import { VideoSeflornerStory } from "./VideoSeflornerStory";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO_SPEC.ID}
        component={VideoSeflornerStory}
        width={VIDEO_SPEC.WIDTH}
        height={VIDEO_SPEC.HEIGHT}
        fps={VIDEO_SPEC.FPS}
        durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}
      />
    </>
  );
};
