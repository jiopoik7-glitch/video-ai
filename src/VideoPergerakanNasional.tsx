import React, { useEffect } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE } from "./data/sejarahData";
import { ensureEditorialFontsLoaded } from "./theme";
import { AudioEngine } from "./components/AudioEngine";
import { EditorialChrome, GraphPaperBackground } from "./components/LayoutChrome";
import { StudentPiP } from "./components/StudentPiP";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneOpening } from "./scenes/SceneOpening";
import { SceneBudiUtomo } from "./scenes/SceneBudiUtomo";
import { SceneIndischePartij } from "./scenes/SceneIndischePartij";
import { ScenePNI } from "./scenes/ScenePNI";
import { ScenePerhimpunanIndonesia } from "./scenes/ScenePerhimpunanIndonesia";
import { SceneOutro } from "./scenes/SceneOutro";

export const VideoPergerakanNasional: React.FC = () => {
  useEffect(() => {
    ensureEditorialFontsLoaded();
  }, []);

  return (
    <AbsoluteFill>
      {/* Master Background (Light Notebook / Dark Impact switching deterministically) */}
      <GraphPaperBackground />

      {/* Master 7-Scene Timeline (Exactly 6300 frames: 0..6299, zero overlap, zero gap) */}
      <Sequence from={TIMELINE.INTRO.from} durationInFrames={TIMELINE.INTRO.duration}>
        <SceneIntro />
      </Sequence>

      <Sequence from={TIMELINE.OPENING.from} durationInFrames={TIMELINE.OPENING.duration}>
        <SceneOpening />
      </Sequence>

      <Sequence from={TIMELINE.BUDI_UTOMO.from} durationInFrames={TIMELINE.BUDI_UTOMO.duration}>
        <SceneBudiUtomo />
      </Sequence>

      <Sequence from={TIMELINE.INDISCHE_PARTIJ.from} durationInFrames={TIMELINE.INDISCHE_PARTIJ.duration}>
        <SceneIndischePartij />
      </Sequence>

      <Sequence from={TIMELINE.PNI.from} durationInFrames={TIMELINE.PNI.duration}>
        <ScenePNI />
      </Sequence>

      <Sequence
        from={TIMELINE.PERHIMPUNAN_INDONESIA.from}
        durationInFrames={TIMELINE.PERHIMPUNAN_INDONESIA.duration}
      >
        <ScenePerhimpunanIndonesia />
      </Sequence>

      <Sequence from={TIMELINE.OUTRO.from} durationInFrames={TIMELINE.OUTRO.duration}>
        <SceneOutro />
      </Sequence>

      {/* Persistent Editorial HUD Chrome + Subtitles */}
      <EditorialChrome />

      {/* Persistent Student Picture-in-Picture (256x154, Safe Corner) */}
      <StudentPiP />

      {/* Master-Level Procedural Audio & Auto-Ducking Engine */}
      <AudioEngine />
    </AbsoluteFill>
  );
};
