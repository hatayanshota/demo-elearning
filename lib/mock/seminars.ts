import type { Seminar, SeminarRegistration } from "@/lib/types/api";

export const mockSeminars: Seminar[] = [
  { id: "seminar-1", title: "SNSマーケティング最前線2025", description: "最新のSNSアルゴリズムと運用テクニックを学ぶ", date: "2025-06-15T14:00:00Z", location: "東京都渋谷区 GROWTH ACADEMYセミナールーム", onlineUrl: "https://zoom.us/example1", capacity: 40, createdAt: "2025-05-01T00:00:00Z" },
  { id: "seminar-2", title: "Google広告実践ワークショップ", description: "実際のアカウントを使ったGoogle広告の設定・最適化体験", date: "2025-08-20T13:00:00Z", location: "大阪市北区 梅田コワーキングスペース", onlineUrl: "https://zoom.us/example2", capacity: 35, createdAt: "2025-07-01T00:00:00Z" },
  { id: "seminar-3", title: "SEOコンテンツ戦略セミナー", description: "検索上位を獲るためのコンテンツ設計と実践テクニック", date: "2025-10-12T14:00:00Z", location: null, onlineUrl: "https://zoom.us/example3", capacity: 50, createdAt: "2025-09-01T00:00:00Z" },
  { id: "seminar-4", title: "GA4データ分析ハンズオン", description: "GA4の設定からレポート作成までを実機で体験", date: "2025-12-08T13:00:00Z", location: "東京都新宿区 新宿ビジネスセンター", onlineUrl: "https://zoom.us/example4", capacity: 30, createdAt: "2025-11-01T00:00:00Z" },
  { id: "seminar-5", title: "AIマーケティング活用術", description: "ChatGPTなどの生成AIをマーケティング業務に活用する方法", date: "2026-03-22T14:00:00Z", location: "東京都渋谷区 GROWTH ACADEMYセミナールーム", onlineUrl: "https://zoom.us/example5", capacity: 40, createdAt: "2026-02-01T00:00:00Z" },
  { id: "seminar-6", title: "動画マーケティング入門", description: "YouTube・TikTokを活用した動画マーケティングの基礎", date: "2026-04-19T13:00:00Z", location: null, onlineUrl: "https://zoom.us/example6", capacity: 50, createdAt: "2026-03-01T00:00:00Z" },
  { id: "seminar-7", title: "マーケティング戦略総まとめ講座", description: "コース内容を振り返り、実務に活かすための戦略立案ワークショップ", date: "2026-05-17T14:00:00Z", location: "東京都渋谷区 GROWTH ACADEMYセミナールーム", onlineUrl: "https://zoom.us/example7", capacity: 40, createdAt: "2026-04-01T00:00:00Z" },
];

const registrations: SeminarRegistration[] = [];
let regId = 1;

// Past seminars (1-4): more registrations
const pastRegistrations: [string, number[], ("ONLINE"|"ONSITE")[]][] = [
  ["seminar-1", [4,5,6,7,8,9,10,11,12,13,14,15,16,17], ["ONLINE","ONSITE","ONLINE","ONLINE","ONSITE","ONLINE","ONLINE","ONSITE","ONLINE","ONSITE","ONLINE","ONLINE","ONSITE","ONLINE"]],
  ["seminar-2", [4,5,6,8,10,12,14,15,18,20,22,24], ["ONSITE","ONLINE","ONLINE","ONSITE","ONLINE","ONSITE","ONLINE","ONLINE","ONSITE","ONLINE","ONSITE","ONLINE"]],
  ["seminar-3", [4,5,7,9,11,13,16,19,21,23,25], ["ONLINE","ONLINE","ONLINE","ONSITE","ONLINE","ONLINE","ONLINE","ONLINE","ONSITE","ONLINE","ONLINE"]],
  ["seminar-4", [4,6,8,10,12,14,17,20], ["ONSITE","ONLINE","ONLINE","ONSITE","ONLINE","ONLINE","ONSITE","ONLINE"]],
];

for (const [seminarId, userIndices, types] of pastRegistrations) {
  userIndices.forEach((ui, i) => {
    registrations.push({
      id: `reg-${regId++}`, userId: `user-${ui}`, seminarId,
      attendanceType: types[i], registeredAt: mockSeminars.find(s => s.id === seminarId)!.date,
    });
  });
}

// Future seminars (5-7): some registrations
const futureRegistrations: [string, number[], ("ONLINE"|"ONSITE")[]][] = [
  ["seminar-5", [4,5,9,11,15], ["ONLINE","ONSITE","ONLINE","ONLINE","ONSITE"]],
  ["seminar-6", [4,7,13], ["ONLINE","ONLINE","ONLINE"]],
  ["seminar-7", [], []],
];

for (const [seminarId, userIndices, types] of futureRegistrations) {
  userIndices.forEach((ui, i) => {
    registrations.push({
      id: `reg-${regId++}`, userId: `user-${ui}`, seminarId,
      attendanceType: types[i], registeredAt: "2026-03-01T00:00:00Z",
    });
  });
}

export const mockSeminarRegistrations: SeminarRegistration[] = registrations;
