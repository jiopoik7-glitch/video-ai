import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { DURATION_IN_FRAMES, SFX_CUES, toGlobalFrame } from "../data/videoData";
import { CLAMP, FPS } from "../theme";

export const ENABLE_PROCEDURAL_AUDIO = true;
// PERINGATAN: Hanya ubah ke true SETELAH file public/media/voiceover.mp3 benar-benar ada!
// Jika file belum ada, render GitHub Actions akan gagal.
export const ENABLE_VOICEOVER_FILE = false;
const VOICEOVER_FILE = "media/voiceover.mp3";
const VOICEOVER_VOLUME = 0.85;

// Auto-ducking BGM & SFX untuk menjamin estimasi puncak worst-case <= 0.98 (zero clipping):
// Peak file BGM/SFX = -3 dBFS (0.708).
// Tanpa VO: BGM (0.708 * 0.30 = 0.212) + SFX (0.708 * 0.34 = 0.241) = 0.453 <= 0.98
// Dengan VO: VO (0.850) + BGM (0.708 * 0.08 = 0.057) + SFX (0.708 * 0.10 = 0.071) = 0.978 <= 0.98
function computeBgmVolume(frame: number, voiceoverActive: boolean): number {
  const fadeIn = interpolate(frame, [0, FPS], [0, 1], CLAMP);
  const fadeOut = interpolate(
    frame,
    [DURATION_IN_FRAMES - Math.round(2.5 * FPS), DURATION_IN_FRAMES - 1],
    [1, 0],
    CLAMP
  );
  const duckCurve = voiceoverActive
    ? interpolate(frame, [0, 18, DURATION_IN_FRAMES - 24, DURATION_IN_FRAMES - 1], [0.14, 0.08, 0.08, 0.14], CLAMP)
    : 0.30;

  return duckCurve * fadeIn * fadeOut;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={DURATION_IN_FRAMES} layout="none">
            <Audio
              src={staticFile("audio/bgm-liquid-bed.wav")}
              volume={(f) => computeBgmVolume(f, ENABLE_VOICEOVER_FILE)}
            />
          </Sequence>

          {SFX_CUES.map((cue) => {
            const globalStart = toGlobalFrame(cue.act, cue.localFrame);
            const rawDuration = Math.ceil(cue.durationSec * FPS);
            const safeDuration = Math.min(rawDuration, DURATION_IN_FRAMES - globalStart);
            if (globalStart < 0 || safeDuration <= 0) {
              return null;
            }
            const vol = ENABLE_VOICEOVER_FILE ? cue.volumeWithVo : cue.volumeNoVo;
            return (
              <Sequence
                key={cue.id}
                from={globalStart}
                durationInFrames={safeDuration}
                layout="none"
              >
                <Audio src={staticFile(cue.file)} volume={vol} />
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
