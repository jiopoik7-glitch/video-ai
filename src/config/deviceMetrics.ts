import { VIDEO_CONFIG } from "./videoConfig";

export const DEVICE_METRICS = {
  referenceModel: "iPhone Modern Reference (iOS 26)",
  canvasWidth: VIDEO_CONFIG.width,
  canvasHeight: VIDEO_CONFIG.height,
  scaleFactor: 2.5,
  safeArea: {
    top: 132,
    bottom: 84,
    horizontal: 44,
  },
  statusBar: {
    height: 112,
    clockLeft: 64,
    indicatorsRight: 64,
    topOffset: 42,
  },
  dynamicIsland: {
    centerX: VIDEO_CONFIG.width / 2,
    topY: 32,
    idleWidth: 276,
    idleHeight: 76,
    compactWidth: 480,
    compactHeight: 82,
    expandedWidth: 960,
    expandedHeight: 248,
    radiusIdle: 38,
    radiusExpanded: 56,
  },
  navigationBar: {
    height: 112,
    largeTitleHeight: 176,
  },
  tabBar: {
    height: 144,
    bottomOffset: 42,
  },
  homeIndicator: {
    width: 340,
    height: 12,
    bottomOffset: 24,
    radius: 6,
  },
  tiktokSafeRegion: {
    rightMargin: 150,
    bottomMargin: 320,
  },
} as const;
