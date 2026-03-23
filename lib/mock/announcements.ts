import type { Announcement } from "@/lib/types/api";

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "3月度セミナーのご案内",
    date: "2026-03-20",
    summary: "3月の特別セミナー「最新SEOトレンド2026」を開催します。ぜひご参加ください。",
  },
  {
    id: "ann-2",
    title: "課題提出期限のリマインド",
    date: "2026-03-15",
    summary: "Webマーケティング基礎コースの課題提出期限が3月末に迫っています。未提出の方はお早めに。",
  },
  {
    id: "ann-3",
    title: "新コース開講のお知らせ",
    date: "2026-03-10",
    summary: "4月より「AI×マーケティング実践講座」が新規開講します。先行申込受付中です。",
  },
];
