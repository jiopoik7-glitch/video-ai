import React from "react";
import { Composition } from "remotion";
import { PlantEducationVideo } from "./PlantEducationVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={PlantEducationVideo}
        durationInFrames={1200}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
