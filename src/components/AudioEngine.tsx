import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { DURATION_IN_FRAMES, SFX_CUES } from "../data/videoData";
import { CLAMP, FPS } from "../theme";

export const ENABLE_PROCEDURAL_AUDIO = true;
// Ubah ke true HANYA setelah public/media/voiceover.mp3 sudah disalin!
export const ENABLE_VOICEOVER_FILE = false;
const VOICEOVER_FILE = "media/voiceover.mp3";
const VOICEOVER_VOLUME = 0.85;

function computeBgmVol(frame: number, hasVo: boolean): number {
  const fadeIn = interpolate(frame, [0, Math.round(0.8 * FPS)], [0, 1], CLAMP);
  const fadeOut = interpolate(
    frame,
    [DURATION_IN_FRAMES - Math.round(2.2 * FPS), DURATION_IN_FRAMES - 1],
    [1, 0],
    CLAMP
  );
  const base = hasVo ? 0.09 : 0.28;
  return base * fadeIn * fadeOut;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={DURATION_IN_FRAMES} layout="none">
            <Audio
              src={staticFile("audio/bgm-ios-ambient.wav")}
              volume={(f) => computeBgmVol(f, ENABLE_VOICEOVER_FILE)}
            />
          </Sequence>

          {SFX_CUES.map((cue) => {
            const rawDur = Math.ceil(cue.durationSec * FPS);
            const safeDur = Math.min(rawDur, DURATION_IN_FRAMES - cue.frame);
            if (cue.frame < 0 || safeDur <= 0) {
              return null;
            }
            return (
              <Sequence
                key={cue.id}
                from={cue.frame}
                durationInFrames={safeDur}
                layout="none"
              >
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
          <Audio src={staticFile(VOICEOVER_FILE)} volume={VOICEOVER_VOLUME} />
        </Sequence>
      )}
    </>
  );
};
