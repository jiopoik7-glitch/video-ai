import React from "react";
import { Composition } from "remotion";
import { VIDEO_SPECS } from "./data/sejarahData";
import { VideoPergerakanNasional } from "./VideoPergerakanNasional";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO_SPECS.COMPOSITION_ID}
        component={VideoPergerakanNasional}
        width={VIDEO_SPECS.WIDTH}
        height={VIDEO_SPECS.HEIGHT}
        fps={VIDEO_SPECS.FPS}
        durationInFrames={VIDEO_SPECS.DURATION_IN_FRAMES}
      />
    </>
  );
};
