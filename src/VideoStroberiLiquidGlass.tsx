import React, { useEffect } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ACT_TIMELINE, VIDEO_SPEC } from "./data/videoData";
import { CLAMP, loadLiquidFonts } from "./theme";
import { AudioEngine } from "./components/AudioEngine";
import { IosStatusBar, OrganicMeshCanvas } from "./components/LiquidGlassUI";
import { Act1NotificationHook } from "./scenes/Act1NotificationHook";
import { Act2NotesChecklist } from "./scenes/Act2NotesChecklist";
import { Act3InteractiveWidget } from "./scenes/Act3InteractiveWidget";
import { Act4BottomSheet } from "./scenes/Act4BottomSheet";
import { Act5ClosingCTA } from "./scenes/Act5ClosingCTA";

export const VideoStroberiLiquidGlass: React.FC = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    loadLiquidFonts();
  }, []);

  const progressPct = interpolate(
    frame,
    [0, VIDEO_SPEC.DURATION_IN_FRAMES - 1],
    [0, 100],
    CLAMP
  );

  return (
    <AbsoluteFill>
      <OrganicMeshCanvas />

      <Sequence from={ACT_TIMELINE.ACT1_HOOK.from} durationInFrames={ACT_TIMELINE.ACT1_HOOK.duration}>
        <Act1NotificationHook />
      </Sequence>

      <Sequence from={ACT_TIMELINE.ACT2_NOTES.from} durationInFrames={ACT_TIMELINE.ACT2_NOTES.duration}>
        <Act2NotesChecklist />
      </Sequence>

      <Sequence from={ACT_TIMELINE.ACT3_WIDGET.from} durationInFrames={ACT_TIMELINE.ACT3_WIDGET.duration}>
        <Act3InteractiveWidget />
      </Sequence>

      <Sequence from={ACT_TIMELINE.ACT4_SHEET.from} durationInFrames={ACT_TIMELINE.ACT4_SHEET.duration}>
        <Act4BottomSheet />
      </Sequence>

      <Sequence from={ACT_TIMELINE.ACT5_OUTRO.from} durationInFrames={ACT_TIMELINE.ACT5_OUTRO.duration}>
        <Act5ClosingCTA />
      </Sequence>

      <IosStatusBar progressPct={progressPct} />

      <AudioEngine />
    </AbsoluteFill>
  );
};
