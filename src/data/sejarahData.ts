export interface MediaConfig {
  readonly ENABLE_VOICEOVER_FILE: boolean;
  readonly ENABLE_PIP_VIDEO: boolean;
  readonly PIP_VIDEO_MUTED: boolean;
  readonly ENABLE_PIP_PHOTO: boolean;
  readonly PIP_PHOTO_FILE: string;
  readonly PIP_VIDEO_FILE: string;
  readonly VOICEOVER_FILE: string;
  readonly ENABLE_PROCEDURAL_AUDIO: boolean;
}

export interface StudentMetadata {
  readonly title: string;
  readonly studentName: string;
  readonly className: string;
  readonly subject: string;
  readonly teacherName: string;
  readonly schoolName: string;
  readonly headerBadge: string;
}

export interface TimelineSegment {
  readonly from: number;
  readonly duration: number;
}

export interface ChapterItem {
  readonly id: string;
  readonly label: string;
  readonly from: number;
  readonly to: number;
}

export interface ToastSegment {
  readonly from: number;
  readonly to: number;
  readonly label: string;
}

export interface NarrationSegment {
  readonly id: string;
  readonly from: number;
  readonly duration: number;
  readonly text: string;
}

export interface SubtitleCue {
  readonly id: string;
  readonly from: number;
  readonly duration: number;
  readonly line1: string;
  readonly line2?: string;
  readonly highlight?: string;
}

export interface AudioEvent {
  readonly id: string;
  readonly frame: number;
  readonly durationInFrames: number;
  readonly file: string;
  readonly volume: number;
}

export interface ReferenceItem {
  readonly code: string;
  readonly title: string;
  readonly institution: string;
  readonly url: string;
}

export const VIDEO_SPECS = {
  COMPOSITION_ID: "PergerakanNasional",
  WIDTH: 1920,
  HEIGHT: 1080,
  FPS: 30,
  DURATION_IN_FRAMES: 6300,
  DURATION_SECONDS: 210,
} as const;

export const STUDENT_META: StudentMetadata = {
  title: "Organisasi Pergerakan Nasional",
  studentName: "Zhariif Rabbani",
  className: "XI. 2",
  subject: "Sejarah",
  teacherName: "Ibu Jumawati",
  schoolName: "SMAN 2 Kota Jambi",
  headerBadge: "SEJARAH XI.2 / SMAN 2 KOTA JAMBI",
};

/**
 * Konfigurasi Media Terpusat.
 * CATATAN AMAN: ENABLE_PIP_PHOTO diset false sementara agar render pertama tidak crash
 * sebelum file public/media/wajah-seragam.jpg diletakkan di workspace.
 * Setelah menaruh foto berseragam di public/media/wajah-seragam.jpg, ubah menjadi true.
 */
export const MEDIA_CONFIG: MediaConfig = {
  ENABLE_VOICEOVER_FILE: false,
  ENABLE_PIP_VIDEO: false,
  PIP_VIDEO_MUTED: false,
  ENABLE_PIP_PHOTO: false,
  PIP_PHOTO_FILE: "media/wajah-seragam.jpg",
  PIP_VIDEO_FILE: "media/wajah-seragam.mp4",
  VOICEOVER_FILE: "media/voiceover.mp3",
  ENABLE_PROCEDURAL_AUDIO: true,
};

export const TIMELINE = {
  INTRO: { from: 0, duration: 450 },
  OPENING: { from: 450, duration: 600 },
  BUDI_UTOMO: { from: 1050, duration: 1200 },
  INDISCHE_PARTIJ: { from: 2250, duration: 1200 },
  PNI: { from: 3450, duration: 1200 },
  PERHIMPUNAN_INDONESIA: { from: 4650, duration: 1200 },
  OUTRO: { from: 5850, duration: 450 },
} as const;

export const ORG_SUB_TIMING = {
  TITLE_PUNCH: { from: 0, duration: 120 },
  LATAR_BELAKANG: { from: 120, duration: 420 },
  TUJUAN_PERKEMBANGAN: { from: 540, duration: 390 },
  DAMPAK: { from: 930, duration: 270 },
} as const;

export const DARK_RANGES: readonly { from: number; to: number }[] = [
  // Budi Utomo Title Punch & Dampak
  { from: 1050, to: 1170 },
  { from: 1980, to: 2250 },
  // Indische Partij Title Punch & Dampak
  { from: 2250, to: 2370 },
  { from: 3180, to: 3450 },
  // PNI Title Punch & Dampak
  { from: 3450, to: 3570 },
  { from: 4380, to: 4650 },
  // Perhimpunan Indonesia Title Punch & Dampak
  { from: 4650, to: 4770 },
  { from: 5580, to: 5850 },
];

export function isDarkCanvasFrame(frame: number): boolean {
  for (let i = 0; i < DARK_RANGES.length; i++) {
    const r = DARK_RANGES[i];
    if (frame >= r.from && frame < r.to) {
      return true;
    }
  }
  return false;
}

export const CHAPTERS: readonly ChapterItem[] = [
  { id: "intro", label: "01 INTRO", from: 0, to: 1050 },
  { id: "bu", label: "02 BU", from: 1050, to: 2250 },
  { id: "ip", label: "03 IP", from: 2250, to: 3450 },
  { id: "pni", label: "04 PNI", from: 3450, to: 4650 },
  { id: "pi", label: "05 PI", from: 4650, to: 5850 },
  { id: "ringkas", label: "06 RINGKAS", from: 5850, to: 6300 },
];

export const TOAST_SEGMENTS: readonly ToastSegment[] = [
  { from: 0, to: 450, label: "#0 · Pengantar & Identitas Tugas" },
  { from: 450, to: 750, label: "#1 · Pengertian Organisasi Pergerakan Nasional" },
  { from: 750, to: 1050, label: "#1 · Transformasi Pola Perjuangan Modern" },
  { from: 1050, to: 1170, label: "#2 · Budi Utomo · 1908" },
  { from: 1170, to: 1590, label: "#2 · Budi Utomo · Latar Belakang & Pendiri" },
  { from: 1590, to: 1980, label: "#2 · Budi Utomo · Tujuan & Perkembangan" },
  { from: 1980, to: 2250, label: "#2 · Budi Utomo · Dampak Historis" },
  { from: 2250, to: 2370, label: "#3 · Indische Partij · 1912" },
  { from: 2370, to: 2790, label: "#3 · Indische Partij · Latar Belakang & Tiga Serangkai" },
  { from: 2790, to: 3180, label: "#3 · Indische Partij · Tujuan & Tekanan Kolonial" },
  { from: 3180, to: 3450, label: "#3 · Indische Partij · Dampak Historis" },
  { from: 3450, to: 3570, label: "#4 · Partai Nasional Indonesia · 1927" },
  { from: 3570, to: 3990, label: "#4 · PNI · Latar Belakang & Tokoh Pendiri" },
  { from: 3990, to: 4380, label: "#4 · PNI · Tujuan, Pleidoi & Perkembangan" },
  { from: 4380, to: 4650, label: "#4 · PNI · Dampak Historis" },
  { from: 4650, to: 4770, label: "#5 · Perhimpunan Indonesia · 1908–1925" },
  { from: 4770, to: 5190, label: "#5 · Perhimpunan Indonesia · Dossier Latar Belakang" },
  { from: 5190, to: 5580, label: "#5 · Perhimpunan Indonesia · Manifesto 1925 & Diplomasi" },
  { from: 5580, to: 5850, label: "#5 · Perhimpunan Indonesia · Dampak Internasional" },
  { from: 5850, to: 6090, label: "#6 · Sintesis Formula Sejarah Nasional" },
  { from: 6090, to: 6300, label: "#6 · Penutup & Kredit Akademik" },
];

export const INTRO_DATA = {
  pill: "TUGAS VIDEO PEMBELAJARAN · SEJARAH KELAS XI.2",
  headlineLine1: "Organisasi",
  headlineLine2Prefix: "Pergerakan",
  headlineLine2Highlight: "Nasional.",
  subtitle: "Dari kebangkitan kesadaran modern hingga cita-cita Indonesia merdeka.",
  identityCards: [
    { label: "NAMA SISWA", value: STUDENT_META.studentName },
    { label: "KELAS", value: STUDENT_META.className },
    { label: "GURU MAPEL", value: STUDENT_META.teacherName },
    { label: "SEKOLAH", value: STUDENT_META.schoolName },
  ],
} as const;

export const OPENING_DATA = {
  definition: {
    label: "DEFINISI KONSEPTUAL",
    headline: "Perjuangan yang mulai menemukan bentuk modern.",
    quote:
      "Organisasi Pergerakan Nasional merupakan wadah perjuangan masyarakat Indonesia yang menggunakan cara-cara modern, terorganisasi, dan berorientasi pada kepentingan bangsa untuk melawan kolonialisme serta memperjuangkan kemerdekaan.",
    sourceRef: "[S2]",
    pills: [
      {
        title: "MODERN",
        desc: "Menggunakan organisasi, administrasi, dan gagasan rasional.",
      },
      {
        title: "TERORGANISIR",
        desc: "Memiliki anggota, kepemimpinan, dan program perjuangan jelas.",
      },
      {
        title: "NASIONAL",
        desc: "Mengembangkan kesadaran melampaui batas kedaerahan.",
      },
    ],
    pillars: [
      { label: "PENDIDIKAN", detail: "Melahirkan kaum terpelajar kritis" },
      { label: "PERS", detail: "Menyebarkan gagasan lintas daerah" },
      { label: "DISKUSI POLITIK", detail: "Merumuskan arah kebangsaan" },
    ],
  },
  transformation: {
    label: "TRANSFORMASI POLA PERJUANGAN",
    headline: "Perubahan strategi, bukan penghapusan perjuangan lama.",
    sourceRef: "[S2]",
    beforeTitle: "SEBELUM 1908",
    beforePoints: [
      "Perlawanan banyak berlangsung secara lokal di daerah masing-masing.",
      "Sering mengandalkan kekuatan fisik dan perlawanan bersenjata.",
      "Jangkauan koordinasi masih terbatas pada wilayah tertentu.",
      "Sangat bergantung pada karisma pemimpin atau tokoh daerah.",
    ],
    bridgeLabel: "POLITIK ETIS · PENDIDIKAN · PERS · GAGASAN MODERN",
    afterTitle: "ERA PERGERAKAN MODERN",
    afterPoints: [
      "Jangkauan perjuangan mulai melampaui batas wilayah kedaerahan.",
      "Organisasi membangun struktur keanggotaan yang berkelanjutan.",
      "Pendidikan menjadi alat utama membangun kesadaran bangsa.",
      "Pers dan diplomasi menjadi media penyebaran cita-cita bersama.",
    ],
    emphasis:
      "Perjuangan tidak lagi hanya mengandalkan kekuatan fisik, tetapi juga kekuatan pikiran, persatuan, organisasi, dan diplomasi.",
  },
} as const;

export const BUDI_UTOMO_DATA = {
  year: "1908",
  numberTitle: "01 · BUDI UTOMO",
  subtitle: "Tonggak Awal Kebangkitan Nasional",
  sourceRef: "[S1, S2, S3, S8]",
  background: {
    foundersTitle: "Penggagas, Pendiri & Basis Anggota",
    wahidinNote:
      "Gagasan awal dipelopori dr. Wahidin Sudirohusodo yang mendorong pendidikan dan dana bantuan belajar (Studiefonds).",
    stoviaNote:
      "Para pelajar STOVIA—termasuk dr. Soetomo, Soeradji, Goenawan Mangoenkoesoemo, dan Mohammad Saleh—mewujudkannya menjadi organisasi resmi.",
    membershipNote:
      "Pada fase awal, keanggotaan masih didominasi pelajar dan kalangan priyayi Jawa-Madura, belum mencakup seluruh penduduk Nusantara.",
    flowSteps: ["dr. Wahidin", "Gagasan Studiefonds", "Pelajar STOVIA", "Budi Utomo"],
    metaTitle: "Tanggal, Tempat & Sifat",
    date: "20 Mei 1908",
    place: "STOVIA, Batavia",
    traits: [
      "Bersifat kooperatif terhadap pemerintah kolonial",
      "Berfokus pada pendidikan, sosial, dan kebudayaan",
      "Tahap awal belum menjadi partai politik kemerdekaan",
    ],
    socialTitle: "Kondisi Sosial Kolonial",
    socialPoints: [
      "Ketimpangan kesempatan pendidikan antara orang Eropa dan pribumi.",
      "Kemiskinan dan sempitnya mobilitas sosial masyarakat terjajah.",
      "Politik Etis membuka sekolah, namun aksesnya tetap sangat terbatas.",
    ],
    miniFlow: ["PENDIDIKAN", "KESADARAN", "ORGANISASI"],
  },
  goalsAndGrowth: {
    goalTitle: "Tujuan Utama Budi Utomo",
    goalIntro:
      "Mengangkat derajat masyarakat, terutama lingkungan Jawa-Madura, melalui kemajuan yang harmonis pada bidang:",
    fields: [
      "Pengajaran & Pendidikan",
      "Kebudayaan & Ilmu Pengetahuan",
      "Pertanian",
      "Peternakan",
      "Perdagangan",
      "Teknik & Industri",
    ],
    timeline: [
      {
        period: "OKTOBER 1908",
        title: "Kongres Pertama di Yogyakarta",
        desc: "R.A.A. Tirtokoesoemo terpilih sebagai ketua; peran kalangan priyayi tua semakin menguat dalam arah organisasi.",
      },
      {
        period: "1915–1916",
        title: "Diskusi Indië Weerbaar",
        desc: "Terlibat dalam gagasan pertahanan Hindia Belanda dan tuntutan perwakilan pribumi (bukan pendirian milisi independen).",
      },
      {
        period: "1928–1935",
        title: "Peleburan Menjadi Parindra",
        desc: "Mengalami perluasan orientasi kebangsaan, lalu melebur bersama PBI membentuk Partai Indonesia Raya (Parindra) pada 1935.",
      },
    ],
  },
  impact: {
    badge: "DAMPAK BUDI UTOMO",
    climax:
      "Budi Utomo membantu membuka jalan bagi lahirnya tradisi organisasi modern dalam perjuangan bangsa.",
    focusDate: "20 MEI",
    focusNote:
      "Ditetapkan sebagai Hari Kebangkitan Nasional melalui Keppres Nomor 316 Tahun 1959 [S7, S8].",
    points: [
      "Memperkenalkan pola perjuangan terstruktur melalui organisasi modern.",
      "Mendorong tumbuhnya kesadaran kolektif dan gerakan pendidikan pribumi.",
      "Menjadi tonggak historis yang dikenang lewat peringatan Hari Kebangkitan Nasional.",
    ],
  },
} as const;

export const INDISCHE_PARTIJ_DATA = {
  year: "1912",
  numberTitle: "02 · INDISCHE PARTIJ",
  subtitle: "Nasionalisme Inklusif dan Politik Terbuka",
  sourceRef: "[S2, S3]",
  masthead: {
    paperName: "DE EXPRES · EDISI SEJARAH",
    edition: "BANDUNG · 1912–1913",
    motto: "INDIE VOOR INDIËRS",
  },
  background: {
    trioTitle: "Tiga Serangkai",
    trio: [
      { name: "E.F.E. Douwes Dekker", alias: "Danudirja Setiabudi" },
      { name: "dr. Cipto Mangunkusumo", alias: "Dokter & Aktivis Kritis" },
      { name: "Suwardi Suryaningrat", alias: "Ki Hajar Dewantara" },
    ],
    trioNote:
      "Ketiganya dikenal berani mengkritik ketimpangan dan politik diskriminatif kolonial secara terbuka.",
    metaTitle: "Kelahiran & Sifat",
    date: "1912 (25 Desember 1912)",
    dateNote:
      "Tanggal 25 Desember 1912 dipakai luas dalam pembelajaran sebagai puncak peresmian di Bandung.",
    traits: [
      "Berorientasi politik radikal dan nonkooperatif",
      "Menuntut persamaan hak politik tanpa sekat ras",
      "Mengusung gagasan kemerdekaan Hindia",
    ],
    socialTitle: "Kondisi Sosial Kolonial",
    socialPoints: [
      "Diskriminasi rasial tajam dalam hukum, kerja, dan pendidikan.",
      "Perbedaan status sosial antara golongan Eropa, Indo, dan pribumi.",
      "Kesadaran bahwa penduduk Hindia memiliki kepentingan bersama.",
    ],
    inclusiveNote:
      "Indische Partij membuka gagasan kebangsaan yang tidak dibatasi satu suku, daerah, atau agama.",
  },
  goalsAndGrowth: {
    motto: "INDIE VOOR INDIËRS",
    mottoMeaning: "Hindia harus diperuntukkan bagi seluruh penduduk Hindia.",
    goals: [
      "Membangun rasa cinta tanah air bagi seluruh penduduk Hindia.",
      "Mengembangkan kesadaran kebangsaan lintas golongan.",
      "Menolak dominasi kolonial Belanda secara tegas.",
      "Memperjuangkan kemerdekaan Hindia sebagai tujuan politik.",
    ],
    pullQuote: "ALS IK EENS NEDERLANDER WAS",
    pullQuoteSub:
      "Artikel Ki Hajar Dewantara (1913) di surat kabar De Expres — kritik tajam atas kontradiksi perayaan kemerdekaan Belanda di tanah jajahan.",
    chronology: [
      {
        date: "1913",
        event: "Pemerintah kolonial menolak permohonan badan hukum Indische Partij.",
      },
      {
        date: "31 MARET 1913",
        event: "Organisasi Indische Partij resmi dibubarkan oleh pemerintah kolonial.",
      },
      {
        date: "SEPTEMBER 1913",
        event: "Tiga Serangkai diasingkan ke Belanda atas permintaan mereka agar tetap menjalani pengasingan bersama.",
      },
    ],
  },
  impact: {
    badge: "DAMPAK INDISCHE PARTIJ",
    headline: "Membawa nasionalisme menuju gagasan persatuan lintas identitas.",
    points: [
      "Menegaskan konsep kebangsaan yang lebih inklusif melampaui batas etnis.",
      "Memperkenalkan perjuangan politik terbuka dan pers kritis sebagai senjata.",
      "Memperkuat tuntutan kemerdekaan sebagai cita-cita bersama seluruh penduduk Hindia.",
    ],
  },
} as const;

export const PNI_DATA = {
  year: "1927",
  numberTitle: "03 · PARTAI NASIONAL INDONESIA",
  subtitle: "Self-Help · Non-Kooperasi · Aksi Massa",
  sourceRef: "[S2, S4]",
  background: {
    topStripDate: "4 JULI 1927 · BANDUNG",
    topStripNameNote:
      "Dibentuk dengan nama Perserikatan Nasional Indonesia, kemudian berkembang menjadi Partai Nasional Indonesia.",
    traits: ["Nasionalis", "Radikal", "Nonkooperatif", "Self-Help"],
    foundersTitle: "Tokoh Algemeene Studieclub Bandung",
    leadFounder: "Ir. Soekarno",
    leadRole:
      "Tokoh utama penggerak ideologi nasionalisme kerakyatan dan persatuan massa.",
    otherFounders: [
      "Mr. Sartono",
      "dr. Samsi",
      "Mr. Iskaq Tjokrohadisurjo",
      "Mr. Budiarto",
      "Mr. Ali Sastroamidjojo",
      "Mr. Sunario",
      "Ir. Anwari",
    ],
    membershipNote:
      "Anggota PNI terbuka bagi beragam lapisan masyarakat Indonesia, tidak terbatas golongan elite.",
    socialTitle: "Kondisi Sosial & Politik",
    socialPoints: [
      "Tindakan represif kolonial menguat pasca pemberontakan PKI 1926–1927.",
      "Ruang gerak organisasi politik semakin diawasi dan dibatasi.",
      "Ketimpangan ekonomi kian menekan kehidupan rakyat kecil.",
      "Diperlukan organisasi nasional yang mampu menghimpun kekuatan massa luas.",
    ],
  },
  goalsAndGrowth: {
    headline: "INDONESIA MERDEKA",
    goalDesc:
      "Mencapai kemerdekaan penuh dengan mengandalkan kekuatan rakyat sendiri (Self-Help) dan menolak bergantung pada lembaga kolonial.",
    principles: [
      { title: "Jiwa Nasional", desc: "Kesadaran harga diri sebagai bangsa merdeka" },
      { title: "Tekad Nasional", desc: "Kemauan politik tanpa kompromi penjajahan" },
      { title: "Tindakan Nasional", desc: "Aksi nyata berbasis kekuatan rakyat sendiri" },
    ],
    pleidoiTitle: "INDONESIA MENGGUGAT",
    pleidoiSub: "Pembelaan Ir. Soekarno di Pengadilan Landraad Bandung, 1930.",
    docCode: "ARSIP PENGADILAN · BDG-1930",
    chronology: [
      { date: "4 JUL 1927", text: "Berdirinya Perserikatan Nasional Indonesia & peran aktif dalam federasi PPPKI." },
      { date: "DES 1929", text: "Ir. Soekarno dan sejumlah tokoh pimpinan PNI ditangkap pemerintah kolonial." },
      { date: "AGU–DES 1930", text: "Sidang Bandung, pidato Indonesia Menggugat, dan vonis hukum pada Desember 1930." },
      { date: "25 APR 1931", text: "PNI resmi dibubarkan oleh Mr. Sartono setelah upaya banding ditolak." },
      { date: "PASCA APR 1931", text: "Lahir jalur organisasi berbeda: Partindo (30 Apr 1931) & PNI Pendidikan / PNI Baru akhir 1931 bersama Moh. Hatta dan Sutan Sjahrir." },
    ],
  },
  impact: {
    badge: "DAMPAK PNI",
    headline: "Menjadikan kemerdekaan sebagai tujuan perjuangan politik massa yang semakin tegas.",
    points: [
      "Memperluas gerakan nasionalisme hingga melampaui kalangan elite terpelajar.",
      "Memperkuat etos persatuan, kemandirian (Self-Help), dan sikap nonkooperatif.",
      "Memperjelas arah perjuangan politik menuju cita-cita Indonesia merdeka.",
    ],
  },
} as const;

export const PERHIMPUNAN_INDONESIA_DATA = {
  years: ["1908", "1922", "1925"] as readonly string[],
  numberTitle: "04 · PERHIMPUNAN INDONESIA",
  subtitle: "Diplomasi Pemuda Indonesia di Eropa",
  sourceRef: "[S2, S5, S6]",
  coordinates: "52.1601° N, 4.4970° E · LEIDEN, BELANDA",
  background: {
    foundersTitle: "Mahasiswa & Tokoh Penggerak",
    earlyNote:
      "Berdiri sejak 1908 sebagai Indische Vereeniging; tokoh awal antara lain Sutan Kasayangan dan R.N. Noto Suroto.",
    laterFigures: [
      "Mohammad Hatta",
      "Ahmad Soebardjo",
      "Nazir Datuk Pamuntjak",
      "Soetan Sjahrir",
      "Iwa Kusumasumantri",
    ],
    roleNote:
      "Diskusi kampus, pers mahasiswa, dan pergaulan internasional menempa orientasi politik mereka.",
    evolutionTitle: "Evolusi Nama & Sifat",
    evolution: [
      { year: "1908", name: "Indische Vereeniging", note: "Organisasi sosial-budaya mahasiswa" },
      { year: "1922", name: "Indonesische Vereeniging", note: "Mulai bergerak ke arah politik" },
      { year: "1925", name: "Perhimpunan Indonesia", note: "Identitas politik nasionalis & majalah Indonesia Merdeka" },
    ],
    traits: ["Nasionalis", "Nonkooperatif", "Progresif", "Diplomasi Internasional"],
    contextTitle: "Konteks Politik Eropa",
    contextPoints: [
      "Mahasiswa menyaksikan langsung praktik demokrasi dan kebebasan sipil di Eropa.",
      "Kontras tajam dengan sistem kolonialisme yang mengekang tanah air.",
      "Berkembangnya prinsip hak menentukan nasib sendiri (self-determination).",
      "Kemerdekaan Indonesia diperjuangkan sebagai isu internasional.",
    ],
  },
  goalsAndGrowth: {
    manifestoTitle: "MANIFESTO POLITIK 1925",
    pillars: [
      {
        title: "PERSATUAN NASIONAL",
        desc: "Menghapus sekat kedaerahan dan menyatukan seluruh bangsa dalam satu barisan.",
      },
      {
        title: "SOLIDARITAS",
        desc: "Menumbuhkan kesadaran senasib sebagai rakyat yang menghadapi penjajahan sama.",
      },
      {
        title: "NON-KOOPERASI",
        desc: "Menolak ketergantungan pada lembaga kolonial; kemerdekaan bukan hadiah.",
      },
      {
        title: "SWADAYA",
        desc: "Membangun kekuatan politik, sosial, dan ekonomi di atas kemampuan sendiri.",
      },
    ],
    routeTitle: "LEIDEN → BRUSSELS → FORUM INTERNASIONAL",
    routeEvents: [
      "Penerbitan majalah Indonesia Merdeka untuk publik Eropa dan tanah air.",
      "Kehadiran aktif di Kongres Liga Menentang Imperialisme, Brussels (1927).",
      "Penangkapan tokoh PI (1927) dan pidato pembelaan Mohammad Hatta: Indonesia Vrij.",
      "Pembebasan tokoh PI pada 1928 yang mengangkat reputasi gerakan Indonesia di dunia.",
    ],
  },
  impact: {
    badge: "DAMPAK PERHIMPUNAN INDONESIA",
    headline: "Memperkenalkan cita-cita Indonesia merdeka kepada dunia internasional.",
    points: [
      "Mempopulerkan nama Indonesia sebagai identitas politik dan kebangsaan modern.",
      "Merumuskan empat asas perjuangan: persatuan, solidaritas, nonkooperasi, dan swadaya.",
      "Menyumbang pemikiran dan semangat nasionalisme yang turut menguat menuju Sumpah Pemuda 1928.",
    ],
  },
} as const;

export const OUTRO_DATA = {
  formulaTitle: "SINTESIS FORMULA SEJARAH",
  formulaCards: [
    {
      year: "1908",
      org: "BUDI UTOMO",
      summary: "Kesadaran modern melalui organisasi & pendidikan.",
    },
    {
      year: "1912",
      org: "INDISCHE PARTIJ",
      summary: "Nasionalisme inklusif & politik terbuka.",
    },
    {
      year: "1925*",
      org: "PERHIMPUNAN INDONESIA",
      summary: "Persatuan, solidaritas, nonkooperasi & diplomasi dunia.",
    },
    {
      year: "1927",
      org: "PNI",
      summary: "Kekuatan massa, swadaya & politik nonkooperatif.",
    },
  ],
  formulaFootnote:
    "*Berakar sejak 1908 (Indische Vereeniging) & transformasi 1922; tahun 1925 merujuk fase nama PI & Manifesto Politiknya.",
  resultPill: "SATU CITA-CITA: INDONESIA MERDEKA",
  thanksPrefix: "Terima",
  thanksHighlight: "Kasih.",
  thanksSub: "Semoga materi Organisasi Pergerakan Nasional ini bermanfaat.",
  creditsFooter:
    "Referensi: Kemendikdasmen · ANRI · Kementerian Kebudayaan · Literatur Sejarah",
} as const;

export const NARRATION: readonly NarrationSegment[] = [
  {
    id: "intro",
    from: 0,
    duration: 450,
    text: "Halo semuanya. Saya Zhariif Rabbani dari kelas XI.2 SMAN 2 Kota Jambi. Pada tugas Sejarah bersama Ibu Jumawati ini, kita menelusuri empat organisasi pergerakan nasional menuju Indonesia merdeka.",
  },
  {
    id: "opening",
    from: 450,
    duration: 600,
    text: "Organisasi pergerakan nasional adalah wadah perjuangan modern, terorganisasi, dan berorientasi kebangsaan. Berbeda dari perlawanan lokal sebelum 1908, era baru memadukan pendidikan, pers, organisasi, dan diplomasi.",
  },
  {
    id: "budi-utomo",
    from: 1050,
    duration: 1200,
    text: "Budi Utomo berawal dari gagasan Studiefonds dr. Wahidin Sudirohusodo yang diwujudkan pelajar STOVIA pada 20 Mei 1908 di Batavia. Berfokus pada pendidikan dan budaya Jawa-Madura, Budi Utomo melewati Kongres 1908, diskusi Indië Weerbaar 1915–1916, hingga melebur menjadi Parindra pada 1935.",
  },
  {
    id: "indische-partij",
    from: 2250,
    duration: 1200,
    text: "Indische Partij berdiri 1912 di Bandung bersama Tiga Serangkai dengan semboyan Indie voor Indiërs. Lewat De Expres dan tulisan Als ik eens Nederlander was, mereka mengusung nasionalisme inklusif hingga ditolak badan hukumnya, dibubarkan 31 Maret 1913, dan diasingkan ke Belanda September 1913.",
  },
  {
    id: "pni",
    from: 3450,
    duration: 1200,
    text: "Perserikatan Nasional Indonesia lahir 4 Juli 1927 di Bandung lalu berkembang menjadi PNI bersama Ir. Soekarno. Mengusung Self-Help dan nonkooperasi, Soekarno ditangkap Desember 1929 dan membela lewat Indonesia Menggugat pada 1930. Usai dibubarkan Mr. Sartono 25 April 1931, muncul Partindo dan PNI Baru.",
  },
  {
    id: "perhimpunan-indonesia",
    from: 4650,
    duration: 1200,
    text: "Di Belanda, Indische Vereeniging sejak 1908 berubah menjadi Indonesische Vereeniging 1922 dan Perhimpunan Indonesia 1925. Lewat Manifesto Politik 1925, majalah Indonesia Merdeka, Kongres Brussels 1927, dan pidato Indonesia Vrij Mohammad Hatta, mereka membawa nama Indonesia ke dunia.",
  },
  {
    id: "outro",
    from: 5850,
    duration: 450,
    text: "Budi Utomo, Indische Partij, Perhimpunan Indonesia, dan PNI saling melengkapi menuju satu cita-cita: Indonesia Merdeka. Terima kasih, semoga bermanfaat.",
  },
];

// Synced 2-line max editorial captions (never colliding with HUD or StudentPiP)
export const SUBTITLES: readonly SubtitleCue[] = [
  { id: "s1", from: 45, duration: 195, line1: "Zhariif Rabbani · Kelas XI.2 SMAN 2 Kota Jambi", line2: "Menelusuri empat organisasi pergerakan nasional Indonesia.", highlight: "pergerakan nasional" },
  { id: "s2", from: 255, duration: 180, line1: "Dari bangkitnya kesadaran pendidikan modern", line2: "hingga terwujudnya cita-cita Indonesia merdeka.", highlight: "Indonesia merdeka" },
  { id: "s3", from: 470, duration: 260, line1: "Wadah perjuangan modern, terorganisasi, dan berorientasi bangsa", line2: "untuk melawan kolonialisme melalui pikiran dan struktur.", highlight: "terorganisasi" },
  { id: "s4", from: 765, duration: 270, line1: "Pola perjuangan bergeser dari perlawanan fisik lokal", line2: "menuju kekuatan pendidikan, pers, organisasi, dan diplomasi.", highlight: "pendidikan, pers" },
  { id: "s5", from: 1065, duration: 100, line1: "Bab 01 · Budi Utomo (1908)", line2: "Tonggak awal tradisi organisasi modern di Nusantara.", highlight: "Budi Utomo" },
  { id: "s6", from: 1190, duration: 380, line1: "Gagasan Studiefonds dr. Wahidin Sudirohusodo diwujudkan", line2: "pelajar STOVIA pada 20 Mei 1908 di Batavia.", highlight: "20 Mei 1908" },
  { id: "s7", from: 1610, duration: 350, line1: "Usai Kongres Yogyakarta 1908 dan diskusi Indië Weerbaar,", line2: "Budi Utomo melebur bersama PBI menjadi Parindra pada 1935.", highlight: "Parindra pada 1935" },
  { id: "s8", from: 2000, duration: 235, line1: "Tanggal 20 Mei ditetapkan sebagai Hari Kebangkitan Nasional", line2: "melalui Keputusan Presiden Nomor 316 Tahun 1959.", highlight: "20 Mei" },
  { id: "s9", from: 2265, duration: 100, line1: "Bab 02 · Indische Partij (1912)", line2: "Pelopor nasionalisme inklusif dan politik terbuka.", highlight: "Indische Partij" },
  { id: "s10", from: 2390, duration: 380, line1: "Tiga Serangkai menolak diskriminasi rasial kolonial", line2: "dan membuka kebangsaan lintas suku, daerah, serta agama.", highlight: "Tiga Serangkai" },
  { id: "s11", from: 2810, duration: 350, line1: "Lewat De Expres dan Als ik eens Nederlander was, badan hukum ditolak,", line2: "dibubarkan 31 Maret 1913, lalu diasingkan September 1913.", highlight: "31 Maret 1913" },
  { id: "s12", from: 3200, duration: 235, line1: "Indische Partij menegaskan kemerdekaan sebagai cita-cita", line2: "bersama seluruh penduduk Hindia tanpa sekat golongan.", highlight: "cita-cita" },
  { id: "s13", from: 3465, duration: 100, line1: "Bab 03 · Partai Nasional Indonesia (1927)", line2: "Self-Help, nonkooperasi, dan kekuatan aksi massa.", highlight: "Partai Nasional Indonesia" },
  { id: "s14", from: 3590, duration: 380, line1: "Lahir 4 Juli 1927 di Bandung sebagai Perserikatan Nasional Indonesia,", line2: "Soekarno dan tokoh Studieclub menghimpun kekuatan rakyat.", highlight: "4 Juli 1927" },
  { id: "s15", from: 4010, duration: 350, line1: "Usai sidang Indonesia Menggugat 1930, PNI dibubarkan 25 April 1931;", line2: "lahirlah jalur berbeda: Partindo dan PNI Pendidikan (PNI Baru).", highlight: "25 April 1931" },
  { id: "s16", from: 4400, duration: 235, line1: "PNI membawa gagasan kemerdekaan melampaui kaum elite", line2: "menjadi kesadaran politik massa yang tegas dan mandiri.", highlight: "politik massa" },
  { id: "s17", from: 4665, duration: 100, line1: "Bab 04 · Perhimpunan Indonesia (1908–1925)", line2: "Diplomasi intelektual pemuda Indonesia di Eropa.", highlight: "Perhimpunan Indonesia" },
  { id: "s18", from: 4790, duration: 380, line1: "Berakar dari Indische Vereeniging 1908 dan fase 1922,", line2: "tahun 1925 mengukuhkan nama Perhimpunan Indonesia di Leiden.", highlight: "1908" },
  { id: "s19", from: 5210, duration: 350, line1: "Manifesto 1925, Kongres Brussels 1927, dan pidato Indonesia Vrij", line2: "mengangkat perjuangan Indonesia ke panggung internasional.", highlight: "Manifesto 1925" },
  { id: "s20", from: 5600, duration: 235, line1: "PI mempopulerkan nama Indonesia di dunia internasional", line2: "dan turut menyuburkan gagasan menuju Sumpah Pemuda 1928.", highlight: "Sumpah Pemuda 1928" },
  { id: "s21", from: 5870, duration: 205, line1: "Kesadaran modern, inklusivitas, diplomasi dunia, dan aksi massa", line2: "bermuara pada satu cita-cita: Indonesia Merdeka.", highlight: "Indonesia Merdeka" },
  { id: "s22", from: 6110, duration: 165, line1: "Terima kasih telah menyimak dokumenter Sejarah XI.2.", line2: "Zhariif Rabbani · SMAN 2 Kota Jambi.", highlight: "Terima kasih" },
];

export const AUDIO_EVENTS: readonly AudioEvent[] = [
  // Intro stabilo & card pops
  { id: "intro-stabilo", frame: 70, durationInFrames: 14, file: "audio/sfx-stabilo-swipe.wav", volume: 0.25 },
  { id: "intro-cards", frame: 155, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.24 },
  // Opening
  { id: "opening-whip", frame: 450, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.28 },
  { id: "opening-transform", frame: 750, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.26 },
  // Budi Utomo
  { id: "bu-impact-in", frame: 1050, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.32 },
  { id: "bu-year-tick", frame: 1095, durationInFrames: 8, file: "audio/sfx-year-tick.wav", volume: 0.28 },
  { id: "bu-card-pop", frame: 1170, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.26 },
  { id: "bu-timeline", frame: 1590, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.26 },
  { id: "bu-impact-out", frame: 1980, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  { id: "bu-stabilo", frame: 2045, durationInFrames: 14, file: "audio/sfx-stabilo-swipe.wav", volume: 0.25 },
  // Indische Partij
  { id: "ip-whip", frame: 2250, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.26 },
  { id: "ip-impact-in", frame: 2254, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  { id: "ip-year-tick", frame: 2295, durationInFrames: 8, file: "audio/sfx-year-tick.wav", volume: 0.28 },
  { id: "ip-card-pop", frame: 2370, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.26 },
  { id: "ip-quote", frame: 2790, durationInFrames: 14, file: "audio/sfx-stabilo-swipe.wav", volume: 0.26 },
  { id: "ip-impact-out", frame: 3180, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  // PNI
  { id: "pni-impact-in", frame: 3450, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.33 },
  { id: "pni-year-tick", frame: 3495, durationInFrames: 8, file: "audio/sfx-year-tick.wav", volume: 0.28 },
  { id: "pni-card-pop", frame: 3570, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.26 },
  { id: "pni-manifesto", frame: 3990, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.27 },
  { id: "pni-impact-out", frame: 4380, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  // Perhimpunan Indonesia
  { id: "pi-whip", frame: 4650, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.26 },
  { id: "pi-impact-in", frame: 4654, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  { id: "pi-year-tick", frame: 4695, durationInFrames: 8, file: "audio/sfx-year-tick.wav", volume: 0.28 },
  { id: "pi-card-pop", frame: 4770, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.26 },
  { id: "pi-pillars", frame: 5190, durationInFrames: 10, file: "audio/sfx-card-pop.wav", volume: 0.26 },
  { id: "pi-impact-out", frame: 5580, durationInFrames: 36, file: "audio/sfx-impact-sub.wav", volume: 0.30 },
  // Outro
  { id: "formula-whip", frame: 5850, durationInFrames: 16, file: "audio/sfx-paper-whip.wav", volume: 0.27 },
  { id: "formula-stabilo", frame: 5995, durationInFrames: 14, file: "audio/sfx-stabilo-swipe.wav", volume: 0.26 },
  { id: "outro-resolve", frame: 6090, durationInFrames: 100, file: "audio/sfx-outro-resolve.wav", volume: 0.34 },
];

export const REFERENCES: readonly ReferenceItem[] = [
  { code: "S1", title: "Pedoman Hari Kebangkitan Nasional 2025", institution: "Kemendikdasmen RI", url: "https://www.kemendikdasmen.go.id/download/file/1174" },
  { code: "S2", title: "Modul Sejarah Indonesia Kelas XI (KD 3.7)", institution: "Repositori Kemendikdasmen", url: "https://repositori.kemendikdasmen.go.id/21684/1/XI_Sejarah_KD-3.7_Final.pdf" },
  { code: "S3", title: "Ensiklopedia Sejarah Indonesia", institution: "Kementerian Kebudayaan RI", url: "https://esi.kemenbud.go.id/" },
  { code: "S4", title: "Presidenpedia — Arsip Statis Kepresidenan", institution: "Arsip Nasional RI (ANRI)", url: "https://pusdipres.anri.go.id/presidenpedia/" },
  { code: "S5", title: "Penelitian Mengenai Perhimpunan Indonesia", institution: "Universitas Negeri Yogyakarta", url: "https://eprints.uny.ac.id/41370/" },
  { code: "S6", title: "Sumpah Pemuda & Pengaruhnya bagi Pergerakan Nasional", institution: "Repositori Kemendikdasmen", url: "https://repositori.kemendikdasmen.go.id/24062/1/Sumpah%20pemuda%20latar%20sejarah%20dan%20pengaruhnya%20bagi%20pergerakan%20nasional.pdf" },
  { code: "S7", title: "Dokumentasi Peraturan Hari Kebangkitan Nasional", institution: "BPHN RI", url: "https://bphn.go.id/data/documents/85kp001.pdf" },
  { code: "S8", title: "Keputusan Presiden Nomor 316 Tahun 1959", institution: "Dokumentasi Peraturan Negara", url: "https://id.wikisource.org/wiki/Pembaharuan_Keputusan_Presiden_Republik_Indonesia_Nomor_316_Tahun_1959" },
];
