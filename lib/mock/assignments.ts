import type { Assignment, Review } from "@/lib/types/api";

const assignmentLessons = ["lesson-3", "lesson-6", "lesson-9", "lesson-12"];

const contents = [
  "ペルソナとして30代の女性マーケターを設定しました。認知→興味→比較検討→購入→リピートの各フェーズでのタッチポイントを整理し、SNSとメルマガが重要であることを導き出しました。",
  "Instagram広告のキャンペーンプラン：ターゲットは25-35歳女性、クリエイティブはカルーセル広告を中心に、月間予算10万円でCPA3,000円を目標とします。",
  "「Webマーケティング 初心者」をメインキーワードとした記事構成案を作成。H2を5つ設定し、合計5000文字の記事で検索意図「知りたい」をカバーする設計としました。",
  "サンプルデータからROAS 280%を算出。SNS広告のCPAが高いため、リターゲティング広告の比率を上げ、LP改善によるCVR向上を提案します。",
];

const feedbacks = [
  "ペルソナの設定が具体的で良いです。カスタマージャーニーの各フェーズで想定される課題も追記するとさらに実践的になります。",
  "KPI設計が明確で素晴らしいです。A/Bテストの計画も加えると、より実務に近い提案になるでしょう。",
  "検索意図の分析が的確です。競合記事との差別化ポイントをもう少し具体的に記述してみてください。",
  "ROI分析の手法は正しいです。施策の優先順位付けにIMPACT/EFFORTマトリクスを使うとより説得力が増します。",
  "良い視点で分析できています。次回はファネル全体を俯瞰した改善提案にチャレンジしてみてください。",
];

let assignmentId = 1;
let reviewId = 1;
const assignments: Assignment[] = [];
const reviews: Review[] = [];

// 完了者 (user-4 to user-8): 4 assignments each, all reviewed
for (let u = 4; u <= 8; u++) {
  assignmentLessons.forEach((lessonId, li) => {
    const aId = `assignment-${assignmentId++}`;
    const d = new Date("2025-04-01");
    d.setDate(d.getDate() + (u - 4) * 10 + li * 15);
    assignments.push({
      id: aId, userId: `user-${u}`, lessonId, content: contents[li],
      status: "REVIEWED", submittedAt: d.toISOString(),
    });
    const rd = new Date(d);
    rd.setDate(rd.getDate() + 3);
    reviews.push({
      id: `review-${reviewId++}`, assignmentId: aId,
      reviewerId: li % 2 === 0 ? "user-2" : "user-3",
      feedback: feedbacks[li % feedbacks.length],
      rating: 3 + (li % 3), reviewedAt: rd.toISOString(),
    });
  });
}

// 順調 (user-9 to user-23): 2-3 assignments, most reviewed
for (let u = 9; u <= 23; u++) {
  const count = u % 2 === 0 ? 3 : 2;
  for (let li = 0; li < count; li++) {
    const aId = `assignment-${assignmentId++}`;
    const d = new Date("2025-06-01");
    d.setDate(d.getDate() + (u - 9) * 8 + li * 20);
    const isReviewed = li < count - 1 || u < 18;
    assignments.push({
      id: aId, userId: `user-${u}`, lessonId: assignmentLessons[li],
      content: contents[li], status: isReviewed ? "REVIEWED" : "PENDING",
      submittedAt: d.toISOString(),
    });
    if (isReviewed) {
      const rd = new Date(d);
      rd.setDate(rd.getDate() + 2);
      reviews.push({
        id: `review-${reviewId++}`, assignmentId: aId,
        reviewerId: u % 2 === 0 ? "user-2" : "user-3",
        feedback: feedbacks[(u + li) % feedbacks.length],
        rating: 3 + (u % 3), reviewedAt: rd.toISOString(),
      });
    }
  }
}

// 停滞 (user-24 to user-33): 0-1 assignments
for (let u = 24; u <= 28; u++) {
  const aId = `assignment-${assignmentId++}`;
  const d = new Date("2025-09-01");
  d.setDate(d.getDate() + (u - 24) * 12);
  assignments.push({
    id: aId, userId: `user-${u}`, lessonId: "lesson-3",
    content: contents[0], status: "PENDING", submittedAt: d.toISOString(),
  });
}

export const mockAssignments: Assignment[] = assignments;
export const mockReviews: Review[] = reviews;
