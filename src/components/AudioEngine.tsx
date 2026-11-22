import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { AUDIO_CUES, MEDIA_CONFIG, VIDEO_SPEC } from "../data/pocData";
import { CLAMP } from "../theme";

function bgmEnvelope(frame: number, hasVoiceover: boolean): number {
  const total = VIDEO_SPEC.DURATION_IN_FRAMES;
  const fadeIn = interpolate(frame, [0, 48], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [total - 110, total - 1], [1, 0], CLAMP);
  const base = hasVoiceover ? 0.15 : 0.32;
  const lift = interpolate(frame, [1450, 1520, total - 110], [base, hasVoiceover ? 0.18 : 0.36, base], CLAMP);
  return lift * fadeIn * fadeOut;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {MEDIA_CONFIG.ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}>
            <Audio
              src={staticFile("audio/bgm-poc.wav")}
              volume={(f) => bgmEnvelope(f, MEDIA_CONFIG.ENABLE_VOICEOVER_FILE)}
            />
          </Sequence>

          {AUDIO_CUES.map((cue) => {
            const dur = Math.min(cue.durationInFrames, VIDEO_SPEC.DURATION_IN_FRAMES - cue.frame);
            if (dur <= 0) return null;
            return (
              <Sequence key={cue.id} from={cue.frame} durationInFrames={dur}>
                <Audio src={staticFile(cue.file)} volume={cue.volume} />
              </Sequence>
            );
          })}
        </>
      )}

      {MEDIA_CONFIG.ENABLE_VOICEOVER_FILE && (
        <Sequence from={0} durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}>
          <Audio src={staticFile(MEDIA_CONFIG.VOICEOVER_FILE)} volume={1.0} />
        </Sequence>
      )}
    </>
  );
};
