import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { DURATION_IN_FRAMES, SFX_CUES } from "../data/storyData";
import { CLAMP, FPS } from "../theme";

export const ENABLE_PROCEDURAL_AUDIO = true;
// Ubah ke true HANYA setelah public/media/voiceover.mp3 sudah disalin ke repo!
export const ENABLE_VOICEOVER_FILE = false;
const VOICEOVER_FILE = "media/voiceover.mp3";

function bgmVol(frame: number, hasVo: boolean): number {
  const fi = interpolate(frame, [0, Math.round(0.7 * FPS)], [0, 1], CLAMP);
  const fo = interpolate(
    frame,
    [DURATION_IN_FRAMES - Math.round(2.5 * FPS), DURATION_IN_FRAMES - 1],
    [1, 0],
    CLAMP
  );
  const base = hasVo ? 0.09 : 0.28;
  return base * fi * fo;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={DURATION_IN_FRAMES} layout="none">
            <Audio
              src={staticFile("audio/bgm-story.wav")}
              volume={(f) => bgmVol(f, ENABLE_VOICEOVER_FILE)}
            />
          </Sequence>

          {SFX_CUES.map((cue) => {
            const dur = Math.min(Math.ceil(cue.durationSec * FPS), DURATION_IN_FRAMES - cue.frame);
            if (cue.frame < 0 || dur <= 0) {
              return null;
            }
            return (
              <Sequence key={cue.id} from={cue.frame} durationInFrames={dur} layout="none">
                <Audio
                  src={staticFile(cue.file)}
                  volume={ENABLE_VOICEOVER_FILE ? cue.volumeWithVo : cue.volumeNoVo}
                />
              </Sequence>
            );
          })}
        </>
      )}

      {ENABLE_VOICEOVER_FILE && (
        <Sequence from={0} durationInFrames={DURATION_IN_FRAMES} layout="none">
          <Audio src={staticFile(VOICEOVER_FILE)} volume={0.85} />
        </Sequence>
      )}
    </>
  );
};
