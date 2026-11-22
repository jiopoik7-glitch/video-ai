import React from "react";
import { Composition } from "remotion";
import { LyricVideo } from "./LyricVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1080x1080 (rasio video 15 detik) · 60fps · 31 detik (1860 frame).
          Ubah ke width={1080} height={1920} untuk 9:16, atau durationInFrames={2100} untuk 35 detik. */}
      <Composition
        id="LyricEmotion"
        component={LyricVideo}
        durationInFrames={1860}
        fps={60}
        width={1080}
        height={1080}
      />
    </>
  );
};
