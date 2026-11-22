export interface AppIconItem {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
  readonly accent: string;
  readonly bgGradient: string;
}

export interface GroupedPoint {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly tag: string;
}

export interface BarrierSolution {
  readonly barrier: string;
  readonly solution: string;
  readonly action: string;
}

export const LOCK_SCREEN_DATA = {
  dateText: "Minggu, 22 November",
  notificationApp: "Unlock The Garden",
  notificationTime: "baru saja",
  notificationTitle: "Pertanyaan Hari Ini",
  notificationBody:
    "Pernah berpikir dari mana makanan yang kita konsumsi setiap hari berasal?",
} as const;

export const HOME_APPS: readonly AppIconItem[] = [
  {
    id: "why-garden",
    name: "WHY GARDEN?",
    subtitle: "Alasan & Data",
    accent: "#34C759",
    bgGradient: "linear-gradient(145deg, #163020 0%, #0D1F15 100%)",
  },
  {
    id: "the-benefits",
    name: "THE BENEFITS",
    subtitle: "5 Manfaat Nyata",
    accent: "#22A06B",
    bgGradient: "linear-gradient(145deg, #215732 0%, #163C23 100%)",
  },
  {
    id: "start-small",
    name: "START SMALL",
    subtitle: "Mulai dari 1 Pot",
    accent: "#4A7C59",
    bgGradient: "linear-gradient(145deg, #2D6A4F 0%, #1B4332 100%)",
  },
];

export const WHY_GARDEN_DATA = {
  appTitle: "WHY GARDEN?",
  headline: "Why does gardening matter?",
  statValue: "5,81%",
  statLabel: "Inflasi kelompok volatile food (YoY · Oktober 2026)",
  statSource:
    "Sumber: Bank Indonesia. Inflasi kelompok pangan bergejolak, bukan kenaikan setiap jenis sayuran.",
  points: [
    {
      id: "supply",
      title: "Ketergantungan Sistem Pangan",
      detail:
        "Makanan melewati rantai panjang: produksi, panen, hingga distribusi. Cuaca ekstrem dapat memengaruhi pasokan.",
      tag: "Realitas",
    },
    {
      id: "source",
      title: "Mengenal Sumber Makanan",
      detail:
        "Berkebun mengajarkan bahwa sayuran tidak muncul begitu saja—ada proses tumbuh, waktu, dan perawatan.",
      tag: "Kesadaran",
    },
    {
      id: "resilience",
      title: "Langkah Kecil Ketahanan Pangan",
      detail:
        "Tidak harus memproduksi semua kebutuhan sendiri, cukup mulai menanam sebagian bahan dapur sehari-hari.",
      tag: "Kemandirian",
    },
  ] as readonly GroupedPoint[],
};

export const BENEFITS_DATA = {
  appTitle: "THE BENEFITS",
  headline: "More than just growing plants.",
  studyBadge: "Tinjauan 40 studi ilmiah · Dampak positif pada well-being",
  benefits: [
    {
      id: "food",
      title: "Penuhi Sebagian Kebutuhan Dapur",
      detail: "Petik daun bawang, kemangi, atau cabai segar langsung dari rumah.",
      tag: "01",
    },
    {
      id: "knowledge",
      title: "Pahami Proses Pertumbuhan",
      detail: "Belajar langsung tentang tanah, air, cahaya matahari, dan unsur hara.",
      tag: "02",
    },
    {
      id: "mental",
      title: "Dukung Kesejahteraan Mental",
      detail: "Lebih dekat dengan alam, melatih kesabaran, dan menikmati proses.",
      tag: "03",
    },
    {
      id: "active",
      title: "Aktivitas Fisik Ringan",
      detail: "Menyiram, mengisi media tanam, dan merawat daun menjaga tubuh aktif.",
      tag: "04",
    },
    {
      id: "habit",
      title: "Kebiasaan Produktif & Hemat",
      detail: "Melatih konsistensi serta berpotensi mengurangi sebagian belanja dapur.",
      tag: "05",
    },
  ] as readonly GroupedPoint[],
  closingQuestion: "But... do you need a big garden?",
};

export const START_SMALL_DATA = {
  appTitle: "START SMALL",
  headline: "You don't need a big garden to begin.",
  segments: ["Hambatan Umum", "Solusi Praktis"] as const,
  items: [
    {
      barrier: "Tidak punya halaman luas",
      solution: "Manfaatkan teras, balkon, atau sudut rumah yang terkena cahaya cukup.",
      action: "1 Sudut Cahaya",
    },
    {
      barrier: "Khawatir butuh modal & alat mahal",
      solution: "Mulai dengan wadah sederhana dan media tanam dasar yang terjangkau.",
      action: "1 Wadah Sederhana",
    },
    {
      barrier: "Belum punya pengalaman menanam",
      solution: "Belajar lewat satu jenis tanaman mudah terlebih dahulu.",
      action: "1 Tanaman Pertama",
    },
  ] as readonly BarrierSolution[],
  teaserLabel: "COMING NEXT · EPISODE 02 & 03",
  teaserTitle: "Your First Mini Garden",
  teaserSubtitle: "Panduan praktik wadah, media tanam, hingga panen pertama.",
};

export const FINAL_MESSAGE_DATA = {
  kicker: "UNLOCK THE GARDEN",
  headline: "SMALL SPACE.\nBIG IMPACT.",
  subheadline: "START WITH ONE PLANT.",
  quote:
    "Satu benih, satu pot, satu sudut rumah. Dari hal sekecil itu, tumbuh kebiasaan besar.",
  ctaPrompt: "Kalau kamu hanya punya satu pot, tanaman apa yang ingin kamu tanam?",
};
