import React from "react";
import { Composition } from "remotion";
import { PlantEducationVideo } from "./PlantEducationVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={PlantEducationVideo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
