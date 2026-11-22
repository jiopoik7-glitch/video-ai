import React from "react";

export interface IconProps {
  size?: number;
  color?: string;
}

const commonStroke = {
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** 1. Buku & Pena Editorial */
export const IconBookQuill: React.FC<IconProps> = ({
  size = 48,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M7 12.5C7 10.8 8.4 9.5 10.1 9.5H20.5C22.4 9.5 24 11.1 24 13V38.5C24 36.8 22.6 35.5 20.9 35.5H10.1C8.4 35.5 7 34.2 7 32.5V12.5Z"
      stroke={color}
      {...commonStroke}
    />
    <path
      d="M41 12.5C41 10.8 39.6 9.5 37.9 9.5H27.5C25.6 9.5 24 11.1 24 13V38.5C24 36.8 25.4 35.5 27.1 35.5H37.9C39.6 35.5 41 34.2 41 32.5V12.5Z"
      stroke={color}
      {...commonStroke}
    />
    <path d="M12 16.5H19" stroke={color} {...commonStroke} />
    <path d="M12 22H18" stroke={color} {...commonStroke} />
    <path
      d="M36.5 6.5C32.5 9.5 29.5 14 28.5 20.5L34 19C37.5 16 39 11.5 36.5 6.5Z"
      stroke={color}
      {...commonStroke}
    />
    <path d="M28.5 20.5L26.5 25" stroke={color} {...commonStroke} />
  </svg>
);

/** 2. Arsitektur Gedung STOVIA */
export const IconStoviaBuilding: React.FC<IconProps> = ({
  size = 64,
  color = "#F6F4EC",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M5 19L24 8L43 19" stroke={color} {...commonStroke} />
    <path d="M8 19H40" stroke={color} {...commonStroke} />
    <path d="M11 19V37" stroke={color} {...commonStroke} />
    <path d="M18 19V37" stroke={color} {...commonStroke} />
    <path d="M30 19V37" stroke={color} {...commonStroke} />
    <path d="M37 19V37" stroke={color} {...commonStroke} />
    <path d="M21 37V27C21 25.3 22.3 24 24 24C25.7 24 27 25.3 27 27V37" stroke={color} {...commonStroke} />
    <path d="M6 37H42" stroke={color} {...commonStroke} />
    <path d="M4 41H44" stroke={color} {...commonStroke} />
    <circle cx="24" cy="14.5" r="1.8" stroke={color} {...commonStroke} />
  </svg>
);

/** 3. Pers & Surat Kabar Historis (De Expres) */
export const IconNewspaperPress: React.FC<IconProps> = ({
  size = 64,
  color = "#F6F4EC",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="7" y="9" width="28" height="30" rx="2.5" stroke={color} {...commonStroke} />
    <path d="M35 15H39.5C40.3 15 41 15.7 41 16.5V35.5C41 37.4 39.4 39 37.5 39H35" stroke={color} {...commonStroke} />
    <path d="M12 15H30" stroke={color} {...commonStroke} />
    <rect x="12" y="20" width="8" height="8" stroke={color} {...commonStroke} />
    <path d="M24 21H30" stroke={color} {...commonStroke} />
    <path d="M24 26H30" stroke={color} {...commonStroke} />
    <path d="M12 33H30" stroke={color} {...commonStroke} />
  </svg>
);

/** 4. Podium & Orasi Politik Massa (PNI) */
export const IconMegaphonePodium: React.FC<IconProps> = ({
  size = 64,
  color = "#F6F4EC",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M11 21L31 12V32L11 25V21Z" stroke={color} {...commonStroke} />
    <path d="M7 21H11V25H7V21Z" stroke={color} {...commonStroke} />
    <path d="M15 26.5L17.5 35.5H21.5L19.2 27.8" stroke={color} {...commonStroke} />
    <path d="M35.5 16.5C37.8 18.2 39 20 39 22C39 24 37.8 25.8 35.5 27.5" stroke={color} {...commonStroke} />
    <path d="M39 12.5C42.2 15.2 43.5 18.4 43.5 22C43.5 25.6 42.2 28.8 39 31.5" stroke={color} {...commonStroke} />
    <path d="M10 41H38" stroke={color} {...commonStroke} />
  </svg>
);

/** 5. Globe Diplomasi Internasional (PI) */
export const IconGlobeDiplomacy: React.FC<IconProps> = ({
  size = 64,
  color = "#F6F4EC",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="16" stroke={color} {...commonStroke} />
    <ellipse cx="24" cy="24" rx="7.5" ry="16" stroke={color} {...commonStroke} />
    <path d="M8.5 24H39.5" stroke={color} {...commonStroke} />
    <path d="M11 16H37" stroke={color} {...commonStroke} />
    <path d="M11 32H37" stroke={color} {...commonStroke} />
    <circle cx="19" cy="17" r="2" fill={color} />
    <circle cx="31" cy="29" r="2" fill={color} />
    <path d="M20.5 18.2C24.5 20 27.8 23.5 29.8 27.5" stroke={color} {...commonStroke} strokeDasharray="2.5 2.5" />
  </svg>
);

/** 6. Rantai Terputus (Non-Kooperasi / Kemerdekaan) */
export const IconBrokenChain: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M19 29L13.5 34.5C11.3 36.7 7.7 36.7 5.5 34.5C3.3 32.3 3.3 28.7 5.5 26.5L11 21"
      stroke={color}
      {...commonStroke}
    />
    <path
      d="M29 19L34.5 13.5C36.7 11.3 40.3 11.3 42.5 13.5C44.7 15.7 44.7 19.3 42.5 21.5L37 27"
      stroke={color}
      {...commonStroke}
    />
    <path d="M20 14L22 19" stroke={color} {...commonStroke} />
    <path d="M28 34L26 29" stroke={color} {...commonStroke} />
    <path d="M14 20L19 22" stroke={color} {...commonStroke} />
    <path d="M34 28L29 26" stroke={color} {...commonStroke} />
  </svg>
);

/** 7. Panah Transformasi Kronologi */
export const IconTimelineArrow: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="10" cy="24" r="3.5" stroke={color} {...commonStroke} />
    <path d="M14 24H37" stroke={color} {...commonStroke} />
    <path d="M30 17L37 24L30 31" stroke={color} {...commonStroke} />
  </svg>
);

/** 8. Tiga Serangkai / Solidaritas Kolektif */
export const IconUsersTrio: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="15" r="4.5" stroke={color} {...commonStroke} />
    <path d="M16 35C16 30 19.5 26.5 24 26.5C28.5 26.5 32 30 32 35" stroke={color} {...commonStroke} />
    <circle cx="12" cy="19" r="3.5" stroke={color} {...commonStroke} />
    <path d="M6 35C6 31.2 8.7 28.5 12 28.5C13.8 28.5 15.3 29.3 16.4 30.5" stroke={color} {...commonStroke} />
    <circle cx="36" cy="19" r="3.5" stroke={color} {...commonStroke} />
    <path d="M42 35C42 31.2 39.3 28.5 36 28.5C34.2 28.5 32.7 29.3 31.6 30.5" stroke={color} {...commonStroke} />
  </svg>
);

/** 9. Neraca Keadilan / Pengadilan Bandung */
export const IconScaleJustice: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 9V38" stroke={color} {...commonStroke} />
    <path d="M15 38H33" stroke={color} {...commonStroke} />
    <path d="M11 16H37" stroke={color} {...commonStroke} />
    <path d="M11 16L7 27H15L11 16Z" stroke={color} {...commonStroke} />
    <path d="M37 16L33 27H41L37 16Z" stroke={color} {...commonStroke} />
    <path d="M7 27C7 29.2 8.8 31 11 31C13.2 31 15 29.2 15 27" stroke={color} {...commonStroke} />
    <path d="M33 27C33 29.2 34.8 31 37 31C39.2 31 41 29.2 41 27" stroke={color} {...commonStroke} />
  </svg>
);

/** 10. Verifikasi & Penanda Inti */
export const IconSparkCheck: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="15" stroke={color} {...commonStroke} />
    <path d="M17.5 24.5L22 29L31.5 19.5" stroke={color} {...commonStroke} />
    <path d="M24 5V7.5" stroke={color} {...commonStroke} />
    <path d="M24 40.5V43" stroke={color} {...commonStroke} />
    <path d="M5 24H7.5" stroke={color} {...commonStroke} />
    <path d="M40.5 24H43" stroke={color} {...commonStroke} />
  </svg>
);

/** 11. Persatuan Nasional (Manifesto Pillar) */
export const IconUnityShield: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 7L10 13V24C10 32.5 16 38.8 24 41.5C32 38.8 38 32.5 38 24V13L24 7Z"
      stroke={color}
      {...commonStroke}
    />
    <circle cx="24" cy="22" r="5" stroke={color} {...commonStroke} />
    <path d="M17 32C18.8 29 21.2 27.5 24 27.5C26.8 27.5 29.2 29 31 32" stroke={color} {...commonStroke} />
  </svg>
);

/** 12. Swadaya / Kemandirian (Manifesto Pillar) */
export const IconSelfReliance: React.FC<IconProps> = ({
  size = 44,
  color = "#141715",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 39V16" stroke={color} {...commonStroke} />
    <path d="M17 22L24 15L31 22" stroke={color} {...commonStroke} />
    <path d="M13 39H35" stroke={color} {...commonStroke} />
    <path d="M11 30C14 27.5 18 27 24 27C30 27 34 27.5 37 30" stroke={color} {...commonStroke} />
    <circle cx="24" cy="10" r="2.2" stroke={color} {...commonStroke} />
  </svg>
);
