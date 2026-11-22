import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import {
  AUDIO_EVENTS,
  MEDIA_CONFIG,
  VIDEO_SPECS,
} from "../data/sejarahData";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * Computes smooth BGM volume envelope at a given master frame (0..6299).
 * - 1.5s (45 frames) smooth fade-in
 * - 2.5s (75 frames) smooth fade-out to silence before frame 6299
 * - Contextual dynamics: 0.28 for intro / title punches / outro;
 *   0.13 auto-ducked when external voiceover or unmuted PiP video is active;
 *   0.20 balanced editorial bed when running in caption-first mode.
 */
function computeBgmVolume(frame: number, hasSpokenVoice: boolean): number {
  const total = VIDEO_SPECS.DURATION_IN_FRAMES;
  const fadeIn = interpolate(frame, [0, 45], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [total - 75, total - 1], [1, 0], CLAMP);

  const mainBed = hasSpokenVoice ? 0.13 : 0.2;
  const accentBed = 0.28;

  // Piecewise linear smooth envelope (every transition spans 18 frames, zero clicks)
  const target = interpolate(
    frame,
    [
      0, 420, 450,
      1032, 1050, 1152, 1170,
      2232, 2250, 2352, 2370,
      3432, 3450, 3552, 3570,
      4632, 4650, 4752, 4770,
      5832, 5850, 6299,
    ],
    [
      accentBed, accentBed, mainBed,
      mainBed, accentBed, accentBed, mainBed,
      mainBed, accentBed, accentBed, mainBed,
      mainBed, accentBed, accentBed, mainBed,
      mainBed, accentBed, accentBed, mainBed,
      mainBed, accentBed, accentBed,
    ],
    CLAMP
  );

  return target * fadeIn * fadeOut;
}

/**
 * AudioEngine: Placed strictly at master VideoPergerakanNasional level so audio is never duplicated.
 */
export const AudioEngine: React.FC = () => {
  const hasSpokenVoice =
    MEDIA_CONFIG.ENABLE_VOICEOVER_FILE ||
    (MEDIA_CONFIG.ENABLE_PIP_VIDEO && !MEDIA_CONFIG.PIP_VIDEO_MUTED);

  return (
    <>
      {MEDIA_CONFIG.ENABLE_PROCEDURAL_AUDIO && (
        <>
          {/* Master BGM Editorial Bed (215s WAV trimmed cleanly to 6300 frames) */}
          <Sequence from={0} durationInFrames={VIDEO_SPECS.DURATION_IN_FRAMES}>
            <Audio
              src={staticFile("audio/bgm-editorial-bed.wav")}
              volume={(f) => computeBgmVolume(f, hasSpokenVoice)}
            />
          </Sequence>

          {/* Timecoded SFX Registry */}
          {AUDIO_EVENTS.map((ev) => {
            const safeDur = Math.min(
              ev.durationInFrames,
              VIDEO_SPECS.DURATION_IN_FRAMES - ev.frame
            );
            if (safeDur <= 0) {
              return null;
            }
            return (
              <Sequence key={ev.id} from={ev.frame} durationInFrames={safeDur}>
                <Audio src={staticFile(ev.file)} volume={ev.volume} />
              </Sequence>
            );
          })}
        </>
      )}

      {/* Optional Voiceover File (strictly guarded by MEDIA_CONFIG) */}
      {MEDIA_CONFIG.ENABLE_VOICEOVER_FILE && (
        <Sequence from={0} durationInFrames={VIDEO_SPECS.DURATION_IN_FRAMES}>
          <Audio src={staticFile(MEDIA_CONFIG.VOICEOVER_FILE)} volume={1.0} />
        </Sequence>
      )}
    </>
  );
};
