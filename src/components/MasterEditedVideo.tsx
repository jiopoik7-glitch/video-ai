import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  CUTS,
  DURATION_IN_FRAMES,
  FPS_VAL,
  RAW_VIDEO_PATH,
  SFX_EVENTS,
} from "../data/editData";
import { CLAMP, COLORS, EASE_LAND, loadEditFonts } from "../theme";
import { Clip1DiagnosticOverlay } from "../overlays/Clip1DiagnosticOverlay";
import { Clip2CauseChainOverlay } from "../overlays/Clip2CauseChainOverlay";
import { Clip3SprayOverlay } from "../overlays/Clip3SprayOverlay";
import { Clip4BottleCtaOverlay } from "../overlays/Clip4BottleCtaOverlay";

export const MasterEditedVideo: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadEditFonts();
  }, []);

  // Dynamic editorial camera zoom & smooth cut punch-ins synced directly to raw.mp4's 4 cuts
  const clip1Zoom = interpolate(frame, [0, CUTS.CLIP2_SOOTY_MOLD.from], [1.0, 1.065], CLAMP);

  const cut2Punch = interpolate(
    frame,
    [CUTS.CLIP2_SOOTY_MOLD.from, CUTS.CLIP2_SOOTY_MOLD.from + 20],
    [1.10, 1.015],
    { ...CLAMP, easing: EASE_LAND }
  );
  const clip2Drift = interpolate(
    frame,
    [CUTS.CLIP2_SOOTY_MOLD.from + 20, CUTS.CLIP3_SPRAYING.from],
    [1.015, 1.045],
    CLAMP
  );

  const cut3Punch = interpolate(
    frame,
    [CUTS.CLIP3_SPRAYING.from, CUTS.CLIP3_SPRAYING.from + 18],
    [1.09, 1.01],
    { ...CLAMP, easing: EASE_LAND }
  );
  // Subtle spray rhythm pulse during Clip 3
  const sprayBeat =
    frame >= CUTS.CLIP3_SPRAYING.from + 45 && frame < CUTS.CLIP4_BOTTLE.from - 20
      ? Math.sin((frame - CUTS.CLIP3_SPRAYING.from) * 0.08) * 0.012
      : 0;

  const cut4Punch = interpolate(
    frame,
    [CUTS.CLIP4_BOTTLE.from, CUTS.CLIP4_BOTTLE.from + 22],
    [1.08, 1.01],
    { ...CLAMP, easing: EASE_LAND }
  );

  const activeScale =
    frame < CUTS.CLIP2_SOOTY_MOLD.from
      ? clip1Zoom
      : frame < CUTS.CLIP2_SOOTY_MOLD.from + 20
      ? cut2Punch
      : frame < CUTS.CLIP3_SPRAYING.from
      ? clip2Drift
      : frame < CUTS.CLIP3_SPRAYING.from + 18
      ? cut3Punch
      : frame < CUTS.CLIP4_BOTTLE.from
      ? 1.02 + sprayBeat
      : cut4Punch;

  // Brief soft optical flash/blur at the 3 cut boundaries for silky continuity
  const cutBlur =
    interpolate(frame, [328, 332, 342], [0, 3.5, 0], CLAMP) +
    interpolate(frame, [692, 696, 706], [0, 3.5, 0], CLAMP) +
    interpolate(frame, [1004, 1008, 1018], [0, 3.5, 0], CLAMP);

  const progressPct = interpolate(frame, [0, DURATION_IN_FRAMES - 1], [0, 100], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* Raw Video Layer with Smooth Editorial Zoom + Subtle Botanical Color Polish */}
      <AbsoluteFill
        style={{
          transform: `scale(${activeScale.toFixed(4)})`,
          filter:
            cutBlur > 0.15
              ? `contrast(1.06) saturate(1.12) blur(${cutBlur.toFixed(1)}px)`
              : "contrast(1.06) saturate(1.12)",
        }}
      >
        <OffthreadVideo
          src={staticFile(RAW_VIDEO_PATH)}
          volume={1.0}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Subtle Top & Bottom Cinematic Vignette so glass overlays always pop cleanly */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6, 14, 9, 0.44) 0%, rgba(6, 14, 9, 0) 26%, rgba(6, 14, 9, 0) 74%, rgba(6, 14, 9, 0.48) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 4 Synchronized Commercial Finishing Overlays */}
      <Sequence from={CUTS.CLIP1_MEALYBUG.from} durationInFrames={CUTS.CLIP1_MEALYBUG.duration}>
        <Clip1DiagnosticOverlay />
      </Sequence>

      <Sequence from={CUTS.CLIP2_SOOTY_MOLD.from} durationInFrames={CUTS.CLIP2_SOOTY_MOLD.duration}>
        <Clip2CauseChainOverlay />
      </Sequence>

      <Sequence from={CUTS.CLIP3_SPRAYING.from} durationInFrames={CUTS.CLIP3_SPRAYING.duration}>
        <Clip3SprayOverlay />
      </Sequence>

      <Sequence from={CUTS.CLIP4_BOTTLE.from} durationInFrames={CUTS.CLIP4_BOTTLE.duration}>
        <Clip4BottleCtaOverlay />
      </Sequence>

      {/* Slim Emerald Progress Bar at Very Top Safe Edge */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 52,
          right: 52,
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.22)",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: COLORS.EMERALD,
          }}
        />
      </div>

      {/* 4 Tactile SFX Layers (no extra BGM, preserves raw.mp4 voice & music) */}
      {SFX_EVENTS.map((ev) => {
        const dur = Math.min(Math.ceil(ev.durationSec * FPS_VAL), DURATION_IN_FRAMES - ev.frame);
        if (ev.frame < 0 || dur <= 0) {
          return null;
        }
        return (
          <Sequence key={ev.id} from={ev.frame} durationInFrames={dur} layout="none">
            <Audio src={staticFile(ev.file)} volume={ev.volume} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
