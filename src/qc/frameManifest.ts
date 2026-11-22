export interface QCFrameCheck {
  readonly frame: number;
  readonly label: string;
  readonly category: "device" | "lock" | "island" | "app" | "motion";
}

export const QC_FRAME_MANIFEST: readonly QCFrameCheck[] = [
  { frame: 0, label: "Lock Screen Opening & Status Bar", category: "device" },
  { frame: 120, label: "Lock Screen Notification Banner", category: "lock" },
  { frame: 315, label: "Dynamic Island Face ID Verification", category: "island" },
  { frame: 540, label: "Home Screen 3-App Grid", category: "app" },
  { frame: 900, label: "App 01 WHY GARDEN? + Expanded Island", category: "island" },
  { frame: 1320, label: "App 01 BI 5.81% Metric + Compact Nav", category: "app" },
  { frame: 2340, label: "App 02 THE BENEFITS + 66% Progress", category: "app" },
  { frame: 3540, label: "App 02 Closing Question Overlay", category: "motion" },
  { frame: 3960, label: "App 03 START SMALL Barriers View", category: "app" },
  { frame: 4380, label: "App 03 Segmented Control Solutions", category: "motion" },
  { frame: 4860, label: "App 03 Coming Next Teaser", category: "app" },
  { frame: 5460, label: "Final Message & Community CTA", category: "motion" },
];
