type Schedule = {
  venue: string;
  date: string;
  fee: number;
  time: string;
};

export const schedules = [
  {
    id: 1,
    date: "2025-01-15",
    time: "19:00",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 8,
    totalSlots: 16,
    fee: 75000,
    type: "Mix",
    facilities: ["Air Mineral", "Rompi", "Bola"],
  },
  {
    id: 2,
    date: "2025-01-16",
    time: "20:00",
    venue: "GOR Senayan Mini Soccer",
    slotsAvailable: 12,
    totalSlots: 16,
    fee: 85000,
    type: "Open",
    facilities: ["Air Mineral", "Rompi", "Bola", "Shower"],
  },
  {
    id: 3,
    date: "2025-01-17",
    time: "18:30",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 3,
    totalSlots: 16,
    fee: 75000,
    type: "Championship",
    facilities: ["Air Mineral", "Rompi", "Bola", "Wasit"],
  },
  {
    id: 4,
    date: "2025-01-18",
    time: "19:30",
    venue: "GOR Senayan Mini Soccer",
    slotsAvailable: 6,
    totalSlots: 16,
    fee: 85000,
    type: "Open",
    facilities: ["Air Mineral", "Rompi", "Bola", "Shower"],
  },
  {
    id: 5,
    date: "2025-01-19",
    time: "20:30",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 10,
    totalSlots: 16,
    fee: 75000,
    type: "Mix",
    facilities: ["Air Mineral", "Rompi", "Bola"],
  },
];

export const news = [
  {
    id: "1",
    title: "Turnamen Mini Soccer Bulanan - Januari 2025",
    description:
      "Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah untuk juara. Daftarkan tim Anda sekarang dan raih kesempatan menjadi yang terbaik.",
    date: "2025-01-10",
    thumbnail:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    readTime: "3 min",
  },
  {
    id: "2",
    title: "Update Harga Sewa Lapangan",
    description:
      "Berlaku mulai 1 Februari 2025, ada penyesuaian tarif untuk beberapa venue. Simak detail lengkapnya di sini.",
    date: "2025-01-08",
    thumbnail:
      "https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg",
    readTime: "2 min",
  },
  {
    id: "3",
    title: "Tips Bermain Futsal untuk Pemula",
    description:
      "Panduan lengkap untuk pemula yang ingin mulai bermain futsal. Dari teknik dasar hingga strategi tim yang efektif.",
    date: "2025-01-05",
    thumbnail:
      "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    readTime: "5 min",
  },
];
