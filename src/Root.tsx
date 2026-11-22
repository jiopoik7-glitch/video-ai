import React from "react";
import { Composition } from "remotion";
import { LyricVideo } from "./LyricVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LyricPlain"
        component={LyricVideo}
        durationInFrames={1620}
        fps={60}
        width={1080}
        height={1080}
      />
    </>
  );
};
