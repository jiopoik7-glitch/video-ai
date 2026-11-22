import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { AUDIO_SFX_EVENTS, BGM_FILE } from "../../data/audioTimeline";

export const AudioEngine: React.FC = () => {
  return (
    <>
      <Audio src={staticFile(BGM_FILE)} volume={0.34} />
      {AUDIO_SFX_EVENTS.map((ev) => (
        <Sequence key={ev.id} from={ev.startFrame} durationInFrames={180}>
          <Audio src={staticFile(ev.file)} volume={ev.volume} />
        </Sequence>
      ))}
    </>
  );
};
