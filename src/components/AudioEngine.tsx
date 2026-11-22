import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { AUDIO_CUES, MEDIA_SWITCH, VIDEO_SPEC } from "../data/seflornerData";
import { CLAMP } from "../theme";

function bgmEnvelope(frame: number, hasVoiceover: boolean): number {
  const total = VIDEO_SPEC.DURATION_IN_FRAMES;
  const fadeIn = interpolate(frame, [0, 48], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [total - 110, total - 1], [1, 0], CLAMP);
  const base = hasVoiceover ? 0.15 : 0.32;
  const finaleLift = interpolate(frame, [1450, 1520, total - 110], [base, hasVoiceover ? 0.19 : 0.36, base], CLAMP);
  return finaleLift * fadeIn * fadeOut;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {MEDIA_SWITCH.ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}>
            <Audio
              src={staticFile("audio/seflorner-bgm.wav")}
              volume={(f) => bgmEnvelope(f, MEDIA_SWITCH.ENABLE_VOICEOVER_FILE)}
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

      {MEDIA_SWITCH.ENABLE_VOICEOVER_FILE && (
        <Sequence from={0} durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}>
          <Audio src={staticFile(MEDIA_SWITCH.VOICEOVER_FILE)} volume={1.0} />
        </Sequence>
      )}
    </>
  );
};
