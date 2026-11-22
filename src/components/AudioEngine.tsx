import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { AUDIO_EVENTS, MEDIA_CONFIG, VIDEO_SPEC } from "../data/videoData";
import { CLAMP } from "../theme";

function computeBgmVolume(frame: number, hasVoiceover: boolean): number {
  const total = VIDEO_SPEC.DURATION_IN_FRAMES;
  const fadeIn = interpolate(frame, [0, 42], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [total - 96, total - 1], [1, 0], CLAMP);
  const target = hasVoiceover ? 0.14 : 0.30;
  return target * fadeIn * fadeOut;
}

export const AudioEngine: React.FC = () => {
  return (
    <>
      {MEDIA_CONFIG.ENABLE_PROCEDURAL_AUDIO && (
        <>
          <Sequence from={0} durationInFrames={VIDEO_SPEC.DURATION_IN_FRAMES}>
            <Audio
              src={staticFile("audio/bgm-liquid-bed.wav")}
              volume={(f) => computeBgmVolume(f, MEDIA_CONFIG.ENABLE_VOICEOVER_FILE)}
            />
          </Sequence>

          {AUDIO_EVENTS.map((ev) => {
            const dur = Math.min(ev.durationInFrames, VIDEO_SPEC.DURATION_IN_FRAMES - ev.frame);
            if (dur <= 0) return null;
            return (
              <Sequence key={ev.id} from={ev.frame} durationInFrames={dur}>
                <Audio src={staticFile(ev.file)} volume={ev.volume} />
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
