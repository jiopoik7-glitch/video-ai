import React, {type ReactNode} from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from './videoConfig';

type IconName =
  | 'leaf'
  | 'sprout'
  | 'sun'
  | 'book'
  | 'basket'
  | 'water'
  | 'pot'
  | 'home'
  | 'compass'
  | 'bookmark'
  | 'phone'
  | 'photo'
  | 'camera'
  | 'flashlight'
  | 'chevron'
  | 'sparkle'
  | 'check';

type SceneProps = {
  frame: number;
  start: number;
  end: number;
  children: ReactNode;
  fade?: number;
  lift?: number;
};

type GardenRow = {
  icon: IconName;
  title: string;
  description: string;
};

type AppPageProps = {
  frame: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  variant: 'why' | 'benefits' | 'small';
  artHeight: number;
  sectionTitle: string;
  rows: GardenRow[];
  activeTab: number;
  note?: string;
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif';

const ease = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
  easing: Easing.bezier(0.22, 0.61, 0.36, 1),
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const progress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], ease);

const springIn = (frame: number, start: number, fps: number): number =>
  spring({
    frame: Math.max(0, frame - start),
    fps,
    config: {damping: 19, stiffness: 145, mass: 0.82},
    durationInFrames: 30,
  });

const SceneLayer: React.FC<SceneProps> = ({
  frame,
  start,
  end,
  children,
  fade = 22,
  lift = 24,
}) => {
  const opacity = interpolate(
    frame,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
    {...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const enter = springIn(frame, start, 60);
  const translateY = interpolate(enter, [0, 1], [lift, 0]);
  const scale = interpolate(enter, [0, 1], [0.985, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Icon: React.FC<{name: IconName; size?: number; color?: string; strokeWidth?: number}> = ({
  name,
  size = 32,
  color = 'currentColor',
  strokeWidth = 2.1,
}) => {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  let drawing: ReactNode;
  switch (name) {
    case 'leaf':
      drawing = (
        <>
          <path {...common} d="M25 7C13 8 6 16 7 28c12 1 20-6 21-18 0-2-1-3-3-3Z" />
          <path {...common} d="M9 28c5-7 10-11 17-16" />
        </>
      );
      break;
    case 'sprout':
      drawing = (
        <>
          <path {...common} d="M17 29V17" />
          <path {...common} d="M17 19C8 19 6 13 7 7c7 0 12 3 12 10" />
          <path {...common} d="M18 17c0-8 5-12 12-12 1 7-2 12-12 14" />
          <path {...common} d="M10 29h15" />
        </>
      );
      break;
    case 'sun':
      drawing = (
        <>
          <circle {...common} cx="19" cy="19" r="7" />
          <path {...common} d="M19 3v4M19 31v4M3 19h4M31 19h4M7.7 7.7l2.8 2.8m17 17 2.8 2.8m0-22.6-2.8 2.8m-17 17-2.8 2.8" />
        </>
      );
      break;
    case 'book':
      drawing = (
        <>
          <path {...common} d="M7 7.5c4-1.8 8-1.2 12 1.2v21c-4-2.4-8-3-12-1.2z" />
          <path {...common} d="M31 7.5c-4-1.8-8-1.2-12 1.2v21c4-2.4 8-3 12-1.2z" />
          <path {...common} d="M19 9v21" />
        </>
      );
      break;
    case 'basket':
      drawing = (
        <>
          <path {...common} d="M7 15h24l-2.5 15h-19z" />
          <path {...common} d="m12 15 5-9m12 9-5-9M13 19v7m6-7v7m6-7v7" />
        </>
      );
      break;
    case 'water':
      drawing = <path {...common} d="M19 4C15 11 9 16 9 22a10 10 0 0 0 20 0c0-6-6-11-10-18Z" />;
      break;
    case 'pot':
      drawing = (
        <>
          <path {...common} d="M8 17h22l-3 16H11z" />
          <path {...common} d="M13 17c0-5 2-8 6-11m0 11c0-7 4-10 9-11" />
          <path {...common} d="M18 11c-5 0-7-3-7-7 5 0 8 2 8 7m2 1c0-5 4-8 9-8 0 5-3 8-9 9" />
        </>
      );
      break;
    case 'home':
      drawing = (
        <>
          <path {...common} d="m5 17 14-12 14 12" />
          <path {...common} d="M9 15v17h20V15M16 32V21h7v11" />
        </>
      );
      break;
    case 'compass':
      drawing = (
        <>
          <circle {...common} cx="19" cy="19" r="14" />
          <path {...common} d="m24 13-3 9-8 3 3-9z" />
        </>
      );
      break;
    case 'bookmark':
      drawing = <path {...common} d="M10 6h18v27l-9-6-9 6z" />;
      break;
    case 'phone':
      drawing = (
        <>
          <rect {...common} x="9" y="4" width="20" height="30" rx="4" />
          <path {...common} d="M15 8h8m-3 21h.1" />
        </>
      );
      break;
    case 'photo':
      drawing = (
        <>
          <rect {...common} x="5" y="5" width="28" height="28" rx="7" />
          <circle {...common} cx="14" cy="14" r="2.5" />
          <path {...common} d="m7 28 9-8 5 4 5-6 7 9" />
        </>
      );
      break;
    case 'camera':
      drawing = (
        <>
          <path {...common} d="M6 12h6l2-4h10l2 4h6v19H6z" />
          <circle {...common} cx="19" cy="21" r="6" />
        </>
      );
      break;
    case 'flashlight':
      drawing = (
        <>
          <path {...common} d="M12 6h14l-2 9H14zM15 15h8l2 17h-12z" />
          <path {...common} d="M16 21h6" />
        </>
      );
      break;
    case 'chevron':
      drawing = <path {...common} d="m14 7 12 12-12 12" />;
      break;
    case 'sparkle':
      drawing = (
        <>
          <path {...common} d="m19 4 3.2 10.8L33 18l-10.8 3.2L19 32l-3.2-10.8L5 18l10.8-3.2z" />
          <path {...common} d="m31 3 1.2 4L36 8l-3.8 1.2L31 13l-1.2-3.8L26 8l3.8-1z" />
        </>
      );
      break;
    case 'check':
      drawing = <path {...common} d="m8 20 7 7L30 11" />;
      break;
    default:
      drawing = null;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 38 38" aria-hidden="true">
      {drawing}
    </svg>
  );
};

const BotanicalWallpaper: React.FC<{frame: number; prefix: string}> = ({frame, prefix}) => {
  const drift = interpolate(frame, [0, 1800], [-10, 12], ease);
  return (
    <AbsoluteFill style={{background: '#061B16', overflow: 'hidden'}}>
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <linearGradient id={`${prefix}-base`} x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#244D36" />
            <stop offset="48%" stopColor="#0D3025" />
            <stop offset="100%" stopColor="#04130F" />
          </linearGradient>
          <radialGradient id={`${prefix}-light`} cx="70%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#8BB77B" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#173D2B" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${prefix}-leaf-a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#87AF72" />
            <stop offset="100%" stopColor="#1C5439" />
          </linearGradient>
          <linearGradient id={`${prefix}-leaf-b`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#477F54" />
            <stop offset="100%" stopColor="#0B3325" />
          </linearGradient>
          <filter id={`${prefix}-soft`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
        </defs>
        <rect width="1080" height="1920" fill={`url(#${prefix}-base)`} />
        <rect width="1080" height="1920" fill={`url(#${prefix}-light)`} />
        <g opacity="0.48" filter={`url(#${prefix}-soft)`}>
          <ellipse cx="180" cy="440" rx="230" ry="480" fill="#6F9B61" />
          <ellipse cx="940" cy="1040" rx="250" ry="520" fill="#40734B" />
          <ellipse cx="470" cy="1570" rx="360" ry="230" fill="#183D2B" />
        </g>
        <g transform={`translate(${drift} 0)`} opacity="0.96">
          <path d="M-100 510C70 280 250 90 490-120C490 170 310 430 10 650C-42 690-91 633-100 510Z" fill={`url(#${prefix}-leaf-a)`} />
          <path d="M-82 586C92 376 263 190 460-28" fill="none" stroke="#B5D09B" strokeOpacity="0.35" strokeWidth="8" />
          <path d="M-10 440 140 420M80 330 245 300M170 220 320 184" fill="none" stroke="#B5D09B" strokeOpacity="0.24" strokeWidth="5" />
          <path d="M1180 320C1010 420 860 650 780 930C1040 850 1190 630 1250 420C1265 355 1235 300 1180 320Z" fill={`url(#${prefix}-leaf-b)`} />
          <path d="M1210 360C1040 520 910 700 800 890" fill="none" stroke="#A9C58C" strokeOpacity="0.32" strokeWidth="8" />
          <path d="M1040 520 1180 520M960 650 1110 670M880 760 1025 815" fill="none" stroke="#A9C58C" strokeOpacity="0.22" strokeWidth="5" />
          <path d="M970 1130C820 960 590 850 340 850C470 1090 690 1250 900 1270C980 1278 1020 1210 970 1130Z" fill="#2B6545" opacity="0.78" />
          <path d="M955 1225C740 1050 560 950 380 875" fill="none" stroke="#A8C78A" strokeOpacity="0.26" strokeWidth="7" />
          <path d="M-140 1330C80 1120 260 1050 480 1080C360 1350 170 1510-60 1530C-145 1537-190 1430-140 1330Z" fill="#204E36" />
          <path d="M-105 1455C90 1290 240 1180 440 1097" fill="none" stroke="#9AB77E" strokeOpacity="0.23" strokeWidth="7" />
          <path d="M1120 1580C960 1370 790 1300 590 1308C700 1530 890 1690 1080 1720C1160 1730 1180 1650 1120 1580Z" fill="#315F40" />
          <path d="M1110 1660C930 1500 780 1400 630 1325" fill="none" stroke="#B1C88F" strokeOpacity="0.24" strokeWidth="7" />
        </g>
        <rect width="1080" height="1920" fill="#00110C" opacity="0.18" />
      </svg>
    </AbsoluteFill>
  );
};

const DynamicIsland: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const expand = spring({
    frame: Math.max(0, frame - 850),
    fps,
    config: {damping: 22, stiffness: 135, mass: 0.8},
    durationInFrames: 26,
  });
  const collapse = progress(frame, 956, 978);
  const expanded = clamp01(expand * (1 - collapse));
  const width = interpolate(expanded, [0, 1], [226, 430]);
  const height = interpolate(expanded, [0, 1], [60, 130]);
  const radius = interpolate(expanded, [0, 1], [34, 42]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width,
        height,
        borderRadius: radius,
        background: '#030403',
        boxShadow: '0 7px 25px rgba(0,0,0,0.2)',
        zIndex: 50,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - expanded,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 19px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 31,
              height: 31,
              borderRadius: 11,
              background: '#193D29',
              display: 'grid',
              placeItems: 'center',
              color: '#B9E69D',
            }}
          >
            <Icon name="leaf" size={21} color="#B9E69D" />
          </div>
          <span style={{fontFamily: FONT_STACK, color: '#F5F7F3', fontSize: 21, fontWeight: 650}}>
            Growing
          </span>
        </div>
        <span style={{fontFamily: FONT_STACK, color: '#B7E18F', fontSize: 21, fontWeight: 700}}>
          2/3
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: expanded,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 19,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            flexShrink: 0,
            borderRadius: 18,
            background: '#173D29',
            display: 'grid',
            placeItems: 'center',
            color: '#C3E8A7',
          }}
        >
          <Icon name="sprout" size={35} color="#C3E8A7" />
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: FONT_STACK, fontSize: 20, fontWeight: 700, color: '#FFFFFF'}}>
            Panduan berkebun
          </div>
          <div style={{fontFamily: FONT_STACK, fontSize: 17, color: '#B9C2BA', marginTop: 4}}>
            2 dari 3 topik dipelajari
          </div>
          <div style={{height: 5, background: '#303731', borderRadius: 9, marginTop: 10, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '66.67%', background: '#8ACB75', borderRadius: 9}} />
          </div>
        </div>
        <span style={{fontFamily: FONT_STACK, color: '#C2E79F', fontSize: 20, fontWeight: 700}}>
          2/3
        </span>
      </div>
    </div>
  );
};

const StatusBar: React.FC<{tone: 'light' | 'dark'; hideClock?: boolean}> = ({tone, hideClock = false}) => {
  const color = tone === 'light' ? '#FFFFFF' : '#17231D';
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 40,
        top: 57,
        left: 66,
        right: 66,
        height: 31,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color,
        fontFamily: FONT_STACK,
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: -0.6,
      }}
    >
      <span style={{opacity: hideClock ? 0 : 1}}>09:41</span>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <svg width="35" height="25" viewBox="0 0 35 25" aria-hidden="true">
          <rect x="1" y="16" width="5" height="7" rx="1.5" fill={color} />
          <rect x="9" y="12" width="5" height="11" rx="1.5" fill={color} />
          <rect x="17" y="7" width="5" height="16" rx="1.5" fill={color} />
          <rect x="25" y="2" width="5" height="21" rx="1.5" fill={color} opacity="0.92" />
        </svg>
        <svg width="31" height="25" viewBox="0 0 31 25" aria-hidden="true">
          <path d="M3 9C10 2 21 2 28 9M7 13c5-5 12-5 17 0m-12 4c2-2 5-2 7 0" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="15.5" cy="21" r="1.8" fill={color} />
        </svg>
        <svg width="43" height="24" viewBox="0 0 43 24" aria-hidden="true">
          <rect x="1" y="3" width="36" height="18" rx="5" fill="none" stroke={color} strokeWidth="2" />
          <rect x="4" y="6" width="27" height="12" rx="3" fill={color} />
          <path d="M39 8v8" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

const HomeIndicator: React.FC<{tone: 'light' | 'dark'}> = ({tone}) => (
  <div
    style={{
      position: 'absolute',
      zIndex: 70,
      bottom: 19,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 238,
      height: 8,
      borderRadius: 20,
      background: tone === 'light' ? '#FFFFFF' : '#17231D',
      opacity: tone === 'light' ? 0.94 : 0.88,
    }}
  />
);

const SystemChrome: React.FC<{frame: number; tone: 'light' | 'dark'; hideClock?: boolean}> = ({
  frame,
  tone,
  hideClock = false,
}) => (
  <>
    <StatusBar tone={tone} hideClock={hideClock} />
    <DynamicIsland frame={frame} />
    <HomeIndicator tone={tone} />
  </>
);

const LockScreen: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const notificationIn = springIn(frame, 58, fps);
  const swipe = progress(frame, 235, 285);
  const clockY = interpolate(swipe, [0, 1], [0, -250]);
  const clockScale = interpolate(swipe, [0, 1], [1, 0.78]);
  const bottomOpacity = 1 - swipe;

  return (
    <AbsoluteFill style={{fontFamily: FONT_STACK, color: '#FFFFFF', overflow: 'hidden'}}>
      <BotanicalWallpaper frame={frame} prefix="lock-wallpaper" />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,12,8,0.18) 0%, rgba(0,10,7,0.06) 34%, rgba(0,12,8,0.42) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 284,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: bottomOpacity,
          transform: `translateY(${clockY}px) scale(${clockScale})`,
          transformOrigin: 'center top',
        }}
      >
        <div style={{fontSize: 28, fontWeight: 600, letterSpacing: 1.2, color: 'rgba(255,255,255,0.92)'}}>
          MINGGU, 22 NOVEMBER
        </div>
        <div
          style={{
            fontSize: 184,
            lineHeight: 1.06,
            fontWeight: 250,
            letterSpacing: -10,
            marginTop: 9,
            textShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          09:41
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 42,
          right: 42,
          height: 218,
          borderRadius: 38,
          padding: '27px 30px',
          boxSizing: 'border-box',
          background: 'rgba(242,248,241,0.23)',
          border: '1.5px solid rgba(255,255,255,0.28)',
          boxShadow: '0 18px 55px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
          backdropFilter: 'blur(34px) saturate(170%)',
          WebkitBackdropFilter: 'blur(34px) saturate(170%)',
          opacity: interpolate(notificationIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(notificationIn, [0, 1], [50, 0])}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div
            style={{
              width: 55,
              height: 55,
              borderRadius: 17,
              background: 'linear-gradient(145deg,#D8F0BD,#6D9D62)',
              display: 'grid',
              placeItems: 'center',
              color: '#173D28',
            }}
          >
            <Icon name="sprout" size={35} color="#173D28" />
          </div>
          <div style={{fontSize: 22, fontWeight: 750, letterSpacing: 0.2}}>KEBUN KECIL</div>
          <div style={{marginLeft: 'auto', fontSize: 19, color: 'rgba(255,255,255,0.78)'}}>sekarang</div>
        </div>
        <div style={{fontSize: 29, fontWeight: 750, marginTop: 13, letterSpacing: -0.4}}>
          Pernah terpikir untuk menanam sendiri?
        </div>
        <div style={{fontSize: 24, lineHeight: 1.28, color: 'rgba(255,255,255,0.9)', marginTop: 5}}>
          Satu pot kecil bisa menjadi awal yang berarti.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          bottom: 165,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: bottomOpacity,
        }}
      >
        {[{name: 'flashlight' as const}, {name: 'camera' as const}].map((item) => (
          <div
            key={item.name}
            style={{
              width: 94,
              height: 94,
              borderRadius: 50,
              background: 'rgba(240,246,242,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'grid',
              placeItems: 'center',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            <Icon name={item.name} size={43} color="#FFFFFF" />
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 22,
          letterSpacing: 0.1,
          opacity: bottomOpacity,
        }}
      >
        Geser ke atas untuk membuka
      </div>
    </AbsoluteFill>
  );
};

const AppIconTile: React.FC<{
  icon: IconName;
  title: string;
  subtitle: string;
  gradient: string;
  selected: boolean;
  frame: number;
  tapAt: number;
}> = ({icon, title, subtitle, gradient, selected, frame, tapAt}) => {
  const {fps} = useVideoConfig();
  const press = spring({
    frame: Math.max(0, frame - tapAt),
    fps,
    config: {damping: 13, stiffness: 260, mass: 0.5},
    durationInFrames: 7,
  });
  const release = spring({
    frame: Math.max(0, frame - (tapAt + 7)),
    fps,
    config: {damping: 17, stiffness: 190, mass: 0.62},
    durationInFrames: 11,
  });
  const touchDepth = clamp01(press * (1 - release));
  const scale = selected ? 1 - 0.09 * touchDepth : 1;
  return (
    <div
      style={{
        width: 285,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        transform: `scale(${scale})`,
        filter: selected ? `brightness(${1 + 0.06 * touchDepth})` : 'none',
      }}
    >
      <div
        style={{
          width: 142,
          height: 142,
          borderRadius: 35,
          background: gradient,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 17px 35px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.52)',
          border: '1px solid rgba(255,255,255,0.28)',
        }}
      >
        <Icon name={icon} size={76} color="#FFFFFF" strokeWidth={1.7} />
      </div>
      <div style={{color: '#FFFFFF', textAlign: 'center', fontSize: 24, fontWeight: 700, textShadow: '0 2px 14px rgba(0,0,0,0.5)'}}>
        {title}
      </div>
      <div style={{color: 'rgba(255,255,255,0.82)', fontSize: 18, marginTop: -10}}>{subtitle}</div>
    </div>
  );
};

const HomeScreen: React.FC<{frame: number; start: number; activeIcon: number}> = ({
  frame,
  start,
  activeIcon,
}) => {
  const {fps} = useVideoConfig();
  const entrance = springIn(frame, start, fps);
  const icons = [
    {icon: 'leaf' as const, title: 'WHY GARDEN?', subtitle: 'Kenali alasannya', gradient: 'linear-gradient(145deg,#80B96D,#285B3B)'},
    {icon: 'sun' as const, title: 'BENEFITS', subtitle: 'Lihat manfaatnya', gradient: 'linear-gradient(145deg,#F4C96F,#D88745)'},
    {icon: 'pot' as const, title: 'START SMALL', subtitle: 'Mulai dari satu pot', gradient: 'linear-gradient(145deg,#A8C8A0,#537C54)'},
  ];
  return (
    <AbsoluteFill style={{fontFamily: FONT_STACK, color: '#FFFFFF', overflow: 'hidden'}}>
      <BotanicalWallpaper frame={frame} prefix={`home-wallpaper-${start}`} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.08) 45%,rgba(0,0,0,0.28))'}} />
      <div
        style={{
          position: 'absolute',
          top: 540,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(entrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(entrance, [0, 1], [35, 0])}px)`,
        }}
      >
        <div style={{fontSize: 24, fontWeight: 650, letterSpacing: 0.7, color: 'rgba(255,255,255,0.88)'}}>
          KEBUN KECIL
        </div>
        <div style={{fontSize: 48, fontWeight: 650, letterSpacing: -1.4, marginTop: 9}}>
          Grow a little every day.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 770,
          left: 42,
          right: 42,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          opacity: interpolate(entrance, [0, 1], [0, 1]),
        }}
      >
        {icons.map((item, index) => (
          <AppIconTile
            key={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            gradient={item.gradient}
            selected={activeIcon === index}
            frame={frame}
            tapAt={start + 64}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1586,
          left: 60,
          right: 60,
          height: 144,
          borderRadius: 47,
          background: 'rgba(236,243,236,0.2)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(32px) saturate(160%)',
          WebkitBackdropFilter: 'blur(32px) saturate(160%)',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          boxShadow: '0 12px 35px rgba(0,0,0,0.14)',
          opacity: interpolate(entrance, [0, 1], [0, 1]),
        }}
      >
        {(['phone', 'photo', 'camera', 'bookmark'] as const).map((name, index) => (
          <div
            key={name}
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              background: ['#4E9B72', '#D58B58', '#788F9C', '#7C9A67'][index],
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <Icon name={name} size={48} color="#FFFFFF" />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 1760, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10}}>
        <div style={{width: 10, height: 10, borderRadius: 10, background: '#FFFFFF'}} />
        <div style={{width: 10, height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.45)'}} />
      </div>
    </AbsoluteFill>
  );
};

const GardenArtwork: React.FC<{variant: 'why' | 'benefits' | 'small'; height: number}> = ({variant, height}) => {
  const palettes = {
    why: {start: '#183D2A', end: '#0A2118', accent: '#C5E09F', leaf: '#6C9C63', text: '#FFFFFF', tag: 'GROW AT HOME', headline: 'Makanan tumbuh.\nBukan muncul.'},
    benefits: {start: '#DCE9CB', end: '#B6D2A5', accent: '#416A43', leaf: '#5E935B', text: '#183322', tag: 'A LITTLE MORE GREEN', headline: 'Lebih dari\nsekadar panen.'},
    small: {start: '#E9E3D3', end: '#C4D7B9', accent: '#416A43', leaf: '#497D4F', text: '#203A2B', tag: 'START WITH ONE POT', headline: 'Mulai dari\nsatu pot kecil.'},
  } as const;
  const palette = palettes[variant];
  const id = `art-${variant}`;
  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 34,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(125deg,${palette.start},${palette.end})`,
        boxShadow: '0 12px 32px rgba(30,54,35,0.12)',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 972 420" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.start} />
            <stop offset="100%" stopColor={palette.end} />
          </linearGradient>
          <linearGradient id={`${id}-pot`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D7B38B" />
            <stop offset="100%" stopColor="#986B4C" />
          </linearGradient>
        </defs>
        <rect width="972" height="420" fill={`url(#${id}-bg)`} />
        <circle cx="810" cy="78" r="160" fill="#FFFFFF" opacity="0.12" />
        <circle cx="740" cy="70" r="95" fill={palette.accent} opacity="0.15" />
        <path d="M585 420c80-105 185-135 387-112v112z" fill="#173B2A" opacity="0.12" />
        <ellipse cx="795" cy="367" rx="180" ry="25" fill="#0B2419" opacity="0.15" />
        <path d="M782 360c-8-82-9-153 8-224" fill="none" stroke={palette.accent} strokeWidth="12" strokeLinecap="round" />
        <path d="M789 236c-72-6-104-49-91-101 55 5 92 38 91 101Z" fill={palette.leaf} />
        <path d="M792 199c6-69 48-102 103-88-7 54-43 89-103 88Z" fill={palette.leaf} opacity="0.92" />
        <path d="M787 295c-70 4-108-32-103-88 57-1 98 31 103 88Z" fill={palette.leaf} opacity="0.92" />
        <path d="M790 270c15-64 59-91 109-69-17 51-55 76-109 69Z" fill={palette.leaf} />
        <path d="M793 144c-1 60-4 126-10 190" fill="none" stroke="#D5E6B7" strokeOpacity="0.48" strokeWidth="5" />
        <path d="M690 338h213l-22 72H712z" fill={`url(#${id}-pot)`} />
        <path d="M678 328h237v25H678z" fill="#E0C19A" />
        <path d="M702 353h190" stroke="#805B43" strokeOpacity="0.34" strokeWidth="5" />
        <path d="M570 385c-14-39-8-86 18-118 22 29 27 74 8 118Z" fill={palette.leaf} opacity="0.75" />
        <path d="M590 383c16-54 54-76 96-61-15 44-47 64-96 61Z" fill={palette.leaf} opacity="0.7" />
      </svg>
      <div style={{position: 'absolute', left: 34, top: 31, color: palette.text, maxWidth: '56%'}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '9px 15px',
            borderRadius: 30,
            background: 'rgba(255,255,255,0.16)',
            border: '1px solid rgba(255,255,255,0.16)',
            fontSize: 16,
            fontWeight: 750,
            letterSpacing: 1.3,
          }}
        >
          {palette.tag}
        </div>
        <div style={{fontSize: 43, lineHeight: 1.08, fontWeight: 750, letterSpacing: -1.6, whiteSpace: 'pre-line', marginTop: 23}}>
          {palette.headline}
        </div>
      </div>
    </div>
  );
};

const GroupRow: React.FC<{row: GardenRow; last: boolean; height: number}> = ({row, last, height}) => (
  <div
    style={{
      height,
      display: 'flex',
      alignItems: 'center',
      padding: '0 25px',
      gap: 22,
      boxSizing: 'border-box',
      borderBottom: last ? 'none' : `1px solid ${COLORS.separator}`,
    }}
  >
    <div
      style={{
        width: 68,
        height: 68,
        flexShrink: 0,
        borderRadius: 21,
        display: 'grid',
        placeItems: 'center',
        background: '#EDF4E9',
        color: '#4D8451',
      }}
    >
      <Icon name={row.icon} size={39} color="#4D8451" />
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: 29, lineHeight: 1.1, fontWeight: 720, color: COLORS.ink, letterSpacing: -0.55}}>
        {row.title}
      </div>
      <div style={{fontSize: 22, lineHeight: 1.22, color: COLORS.secondary, marginTop: 8}}>
        {row.description}
      </div>
    </div>
    <Icon name="chevron" size={24} color="#A4ACA5" />
  </div>
);

const TabBar: React.FC<{activeTab: number}> = ({activeTab}) => {
  const tabs = [
    {name: 'Beranda', icon: 'home' as const},
    {name: 'Panduan', icon: 'compass' as const},
    {name: 'Koleksi', icon: 'bookmark' as const},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 54,
        right: 54,
        bottom: 70,
        height: 132,
        borderRadius: 42,
        background: 'rgba(250,252,248,0.78)',
        border: '1px solid rgba(255,255,255,0.92)',
        boxShadow: '0 12px 40px rgba(26,44,31,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
        backdropFilter: 'blur(30px) saturate(170%)',
        WebkitBackdropFilter: 'blur(30px) saturate(170%)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 20,
      }}
    >
      {tabs.map((tab, index) => {
        const active = index === activeTab;
        return (
          <div key={tab.name} style={{width: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: active ? '#477F4D' : '#7C877F'}}>
            <Icon name={tab.icon} size={34} color={active ? '#477F4D' : '#7C877F'} strokeWidth={active ? 2.5 : 1.9} />
            <span style={{fontSize: 20, fontWeight: active ? 750 : 550}}>{tab.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const AppPage: React.FC<AppPageProps> = ({
  frame,
  eyebrow,
  title,
  subtitle,
  variant,
  artHeight,
  sectionTitle,
  rows,
  activeTab,
  note,
}) => {
  const {fps} = useVideoConfig();
  const pageIn = springIn(frame, 0, fps);
  const titleY = interpolate(pageIn, [0, 1], [26, 0]);
  const rowHeight = variant === 'why' ? 174 : variant === 'benefits' ? 160 : 145;
  const artworkTop = 447;
  const sectionTop = artworkTop + artHeight + 34;
  const rowsTop = sectionTop + 47;
  return (
    <AbsoluteFill style={{fontFamily: FONT_STACK, color: COLORS.ink, background: 'linear-gradient(180deg,#F8FAF6 0%,#F0F3ED 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, right: -100, width: 500, height: 500, borderRadius: 500, background: 'rgba(206,226,193,0.22)', filter: 'blur(40px)'}} />
      <div style={{position: 'absolute', top: 143, left: 64, right: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 24, fontWeight: 750, letterSpacing: -0.2}}>Kebun Kecil</div>
        <div style={{width: 49, height: 49, borderRadius: 25, background: '#E7EFE2', display: 'grid', placeItems: 'center', color: '#4F8051'}}>
          <Icon name="sun" size={27} color="#4F8051" />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 219,
          left: 64,
          right: 64,
          transform: `translateY(${titleY}px)`,
          opacity: interpolate(pageIn, [0, 1], [0.55, 1]),
        }}
      >
        <div style={{fontSize: 18, fontWeight: 800, color: '#6C9569', letterSpacing: 1.8}}>{eyebrow}</div>
        <div style={{fontSize: 69, lineHeight: 1.04, fontWeight: 760, letterSpacing: -3.3, marginTop: 10, color: '#17231D'}}>{title}</div>
        <div style={{fontSize: 27, color: '#78837B', marginTop: 15, lineHeight: 1.25}}>{subtitle}</div>
      </div>
      <div style={{position: 'absolute', top: artworkTop, left: 54, right: 54}}>
        <GardenArtwork variant={variant} height={artHeight} />
      </div>
      <div style={{position: 'absolute', top: sectionTop, left: 67, right: 67, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontSize: 18, fontWeight: 800, letterSpacing: 1.35, color: '#879187'}}>{sectionTitle}</span>
        <span style={{fontSize: 18, color: '#91A092', fontWeight: 650}}>{`0${rows.length} LANGKAH`}</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: rowsTop,
          left: 54,
          right: 54,
          borderRadius: 30,
          overflow: 'hidden',
          background: '#FFFFFF',
          boxShadow: '0 9px 30px rgba(38,57,39,0.055)',
        }}
      >
        {rows.map((row, index) => (
          <GroupRow key={row.title} row={row} last={index === rows.length - 1} height={rowHeight} />
        ))}
      </div>
      {note ? (
        <div style={{position: 'absolute', top: rowsTop + rowHeight * rows.length + 30, left: 68, right: 68, color: '#6C796E', fontSize: 22, fontWeight: 650, textAlign: 'center'}}>
          {note}
        </div>
      ) : null}
      <TabBar activeTab={activeTab} />
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const entrance = springIn(frame, 0, fps);
  const titleOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const titleY = interpolate(entrance, [0, 1], [50, 0]);
  return (
    <AbsoluteFill style={{fontFamily: FONT_STACK, color: '#FFFFFF', overflow: 'hidden'}}>
      <BotanicalWallpaper frame={frame} prefix="outro-wallpaper" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(2,18,12,0.18),rgba(2,19,13,0.52) 58%,rgba(2,16,11,0.82))'}} />
      <div
        style={{
          position: 'absolute',
          top: 510,
          left: 66,
          right: 66,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 13, padding: '12px 22px', border: '1px solid rgba(255,255,255,0.28)', borderRadius: 40, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)'}}>
          <Icon name="leaf" size={27} color="#D1E9B3" />
          <span style={{fontSize: 22, fontWeight: 750, letterSpacing: 1.5}}>KEBUN KECIL</span>
        </div>
        <div style={{fontSize: 91, lineHeight: 0.99, fontWeight: 820, letterSpacing: -4.7, marginTop: 47}}>
          SMALL SPACE.
          <br />
          BIG IMPACT.
        </div>
        <div style={{fontSize: 34, marginTop: 30, color: 'rgba(255,255,255,0.88)', fontWeight: 520}}>
          Mulai dari satu tanaman.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 62,
          right: 62,
          bottom: 260,
          minHeight: 132,
          borderRadius: 37,
          padding: '25px 29px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: 'rgba(244,249,241,0.18)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 15px 45px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.3)',
          backdropFilter: 'blur(28px) saturate(155%)',
          WebkitBackdropFilter: 'blur(28px) saturate(155%)',
          opacity: titleOpacity,
          transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{width: 66, height: 66, borderRadius: 23, background: 'rgba(207,232,180,0.22)', display: 'grid', placeItems: 'center', flexShrink: 0}}>
          <Icon name="sprout" size={42} color="#D7EFB9" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 25, fontWeight: 760}}>Kalau cuma punya satu pot...</div>
          <div style={{fontSize: 22, color: 'rgba(255,255,255,0.82)', marginTop: 5}}>Tanaman apa yang ingin kamu tanam?</div>
        </div>
        <Icon name="chevron" size={30} color="#FFFFFF" />
      </div>
      <div style={{position: 'absolute', bottom: 125, left: 0, right: 0, textAlign: 'center', fontSize: 21, color: 'rgba(255,255,255,0.72)', letterSpacing: 1.3}}>
        LET'S UNLOCK THE GARDEN
      </div>
    </AbsoluteFill>
  );
};

export const GardeningVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const whyRows: GardenRow[] = [
    {icon: 'basket', title: 'Kenali sumber pangan', description: 'Lihat proses dari benih hingga panen.'},
    {icon: 'leaf', title: 'Tanam sebagian kebutuhan', description: 'Mulai dari bumbu atau sayur yang sering dipakai.'},
  ];
  const benefitRows: GardenRow[] = [
    {icon: 'book', title: 'Belajar tentang alam', description: 'Kenali tanah, air, cahaya, dan siklus tumbuh.'},
    {icon: 'sun', title: 'Bergerak dan rehat', description: 'Rawat tanaman sebagai jeda dari rutinitas.'},
    {icon: 'basket', title: 'Melengkapi dapur', description: 'Petik bumbu atau sayur saat siap dipanen.'},
  ];
  const smallRows: GardenRow[] = [
    {icon: 'sprout', title: 'Pilih satu tanaman', description: 'Sesuaikan dengan cahaya di rumah.'},
    {icon: 'pot', title: 'Siapkan wadah', description: 'Pilih pot dengan lubang drainase.'},
    {icon: 'water', title: 'Amati dan rawat', description: 'Cek media sebelum menyiram.'},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#061B16', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ambient-garden.wav')} volume={0.28} />
      <Sequence from={54} durationInFrames={80}>
        <Audio src={staticFile('audio/sfx-notification.wav')} volume={0.72} />
      </Sequence>
      <Sequence from={245} durationInFrames={90}>
        <Audio src={staticFile('audio/sfx-whoosh.wav')} volume={0.46} />
      </Sequence>
      <Sequence from={330} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx-tap.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={705} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx-tap.wav')} volume={0.42} />
      </Sequence>
      <Sequence from={1095} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx-tap.wav')} volume={0.42} />
      </Sequence>

      <SceneLayer frame={frame} start={0} end={278} fade={22} lift={0}>
        <LockScreen frame={frame} />
      </SceneLayer>

      <SceneLayer frame={frame} start={255} end={365} fade={18} lift={18}>
        <HomeScreen frame={frame} start={255} activeIcon={0} />
      </SceneLayer>

      <SceneLayer frame={frame} start={345} end={697} fade={22} lift={36}>
        <AppPage
          frame={Math.max(0, frame - 345)}
          eyebrow="01 / WHY GARDEN?"
          title="Kenapa berkebun?"
          subtitle="Kenali proses di balik makanan kita."
          variant="why"
          artHeight={350}
          sectionTitle="MENGAPA MULAI?"
          rows={whyRows}
          activeTab={0}
          note="Kecil langkahnya, besar maknanya."
        />
      </SceneLayer>

      <SceneLayer frame={frame} start={675} end={744} fade={14} lift={12}>
        <HomeScreen frame={frame} start={675} activeIcon={1} />
      </SceneLayer>

      <SceneLayer frame={frame} start={720} end={1092} fade={22} lift={34}>
        <AppPage
          frame={Math.max(0, frame - 720)}
          eyebrow="02 / THE BENEFITS"
          title="Manfaat yang tumbuh"
          subtitle="Berkebun memberi lebih dari hasil panen."
          variant="benefits"
          artHeight={245}
          sectionTitle="LEBIH DARI SEKADAR PANEN"
          rows={benefitRows}
          activeTab={1}
        />
      </SceneLayer>

      <SceneLayer frame={frame} start={1065} end={1133} fade={14} lift={12}>
        <HomeScreen frame={frame} start={1065} activeIcon={2} />
      </SceneLayer>

      <SceneLayer frame={frame} start={1110} end={1540} fade={24} lift={34}>
        <AppPage
          frame={Math.max(0, frame - 1110)}
          eyebrow="03 / START SMALL"
          title="Mulai dari kecil"
          subtitle="Satu pot cukup untuk memulai."
          variant="small"
          artHeight={285}
          sectionTitle="TIGA LANGKAH PERTAMA"
          rows={smallRows}
          activeTab={2}
          note="Tutorial kebun mini — segera hadir."
        />
      </SceneLayer>

      <SceneLayer frame={frame} start={1518} end={1900} fade={24} lift={30}>
        <OutroScene frame={Math.max(0, frame - 1518)} />
      </SceneLayer>

      {(() => {
        const darkChrome =
          (frame >= 365 && frame < 690) ||
          (frame >= 740 && frame < 1090) ||
          (frame >= 1134 && frame < 1540);
        return (
          <SystemChrome
            frame={frame}
            tone={darkChrome ? 'dark' : 'light'}
            hideClock={frame < 278}
          />
        );
      })()}
    </AbsoluteFill>
  );
};
