import type { Course, Section, Lesson, Chapter } from "@/lib/types/api";

export const mockCourses: Course[] = [
  {
    id: "course-1", title: "Webマーケティング完全マスターコース",
    description: "SEO、SNS、広告運用まで、Webマーケティングの全領域を体系的に学ぶ実践型コースです。",
    thumbnailUrl: null, sortOrder: 0, createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "course-2", title: "SNS広告実践マスター講座",
    description: "Instagram・X・TikTokの広告運用を実践的に学び、ROIを最大化する手法を習得します。",
    thumbnailUrl: null, sortOrder: 1, createdAt: "2024-09-01T00:00:00Z",
  },
];

export const mockSections: Section[] = [
  { id: "section-1", courseId: "course-1", title: "マーケティング基礎", sortOrder: 0 },
  { id: "section-2", courseId: "course-1", title: "SNSマーケティング", sortOrder: 1 },
  { id: "section-3", courseId: "course-1", title: "SEO・コンテンツマーケティング", sortOrder: 2 },
  { id: "section-4", courseId: "course-1", title: "広告運用・分析", sortOrder: 3 },
];

export const mockLessons: Lesson[] = [
  // Section 1: マーケティング基礎
  { id: "lesson-1", sectionId: "section-1", title: "マーケティングとは？基本概念と歴史", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 720, sortOrder: 0, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-2", sectionId: "section-1", title: "ターゲット設定とペルソナ作成", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 900, sortOrder: 1, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-3", sectionId: "section-1", title: "カスタマージャーニーの設計", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1080, sortOrder: 2, hasAssignment: true, assignmentDescription: "自社サービスを想定したペルソナを1つ作成し、そのペルソナのカスタマージャーニーマップを記述してください。" },
  // Section 2: SNSマーケティング
  { id: "lesson-4", sectionId: "section-2", title: "SNSマーケティング戦略の基本", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 840, sortOrder: 0, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-5", sectionId: "section-2", title: "Instagram・X運用の実践テクニック", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1200, sortOrder: 1, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-6", sectionId: "section-2", title: "SNS広告の種類と活用法", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 960, sortOrder: 2, hasAssignment: true, assignmentDescription: "Instagram広告のキャンペーンプランを作成してください。ターゲット、クリエイティブ方針、KPIを含めること。" },
  // Section 3: SEO・コンテンツマーケティング
  { id: "lesson-7", sectionId: "section-3", title: "SEOの基礎と検索エンジンの仕組み", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 780, sortOrder: 0, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-8", sectionId: "section-3", title: "キーワード調査と競合分析", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1500, sortOrder: 1, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-9", sectionId: "section-3", title: "コンテンツ制作と内部SEO対策", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1320, sortOrder: 2, hasAssignment: true, assignmentDescription: "指定キーワードに対するSEO記事の構成案（見出しH2〜H3、想定文字数、狙う検索意図）を作成してください。" },
  // Section 4: 広告運用・分析
  { id: "lesson-10", sectionId: "section-4", title: "Google広告の基本と設定方法", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1080, sortOrder: 0, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-11", sectionId: "section-4", title: "GA4によるアクセス解析入門", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1440, sortOrder: 1, hasAssignment: false, assignmentDescription: null },
  { id: "lesson-12", sectionId: "section-4", title: "ROI分析とマーケティング戦略の改善", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", durationSeconds: 1680, sortOrder: 2, hasAssignment: true, assignmentDescription: "サンプルデータを元に、広告施策のROIを算出し、次月の改善提案をレポート形式でまとめてください。" },
];

export const mockChapters: Chapter[] = [
  // Lesson 1
  { id: "ch-1", lessonId: "lesson-1", title: "マーケティングの定義", startSeconds: 0, sortOrder: 0 },
  { id: "ch-2", lessonId: "lesson-1", title: "マーケティングの歴史", startSeconds: 180, sortOrder: 1 },
  { id: "ch-3", lessonId: "lesson-1", title: "現代マーケティングの4P/4C", startSeconds: 420, sortOrder: 2 },
  // Lesson 2
  { id: "ch-4", lessonId: "lesson-2", title: "STP分析の手法", startSeconds: 0, sortOrder: 0 },
  { id: "ch-5", lessonId: "lesson-2", title: "ペルソナの作り方", startSeconds: 300, sortOrder: 1 },
  { id: "ch-6", lessonId: "lesson-2", title: "事例紹介", startSeconds: 600, sortOrder: 2 },
  // Lesson 3
  { id: "ch-7", lessonId: "lesson-3", title: "カスタマージャーニーとは", startSeconds: 0, sortOrder: 0 },
  { id: "ch-8", lessonId: "lesson-3", title: "マップ作成のステップ", startSeconds: 300, sortOrder: 1 },
  { id: "ch-9", lessonId: "lesson-3", title: "タッチポイントの設計", startSeconds: 600, sortOrder: 2 },
  { id: "ch-10", lessonId: "lesson-3", title: "実践ワーク解説", startSeconds: 840, sortOrder: 3 },
  // Lesson 4
  { id: "ch-11", lessonId: "lesson-4", title: "SNSマーケティングの全体像", startSeconds: 0, sortOrder: 0 },
  { id: "ch-12", lessonId: "lesson-4", title: "プラットフォーム選定", startSeconds: 280, sortOrder: 1 },
  { id: "ch-13", lessonId: "lesson-4", title: "KPI設計", startSeconds: 560, sortOrder: 2 },
  // Lesson 5
  { id: "ch-14", lessonId: "lesson-5", title: "Instagramアルゴリズム解説", startSeconds: 0, sortOrder: 0 },
  { id: "ch-15", lessonId: "lesson-5", title: "投稿テクニック", startSeconds: 360, sortOrder: 1 },
  { id: "ch-16", lessonId: "lesson-5", title: "Xの活用法", startSeconds: 720, sortOrder: 2 },
  { id: "ch-17", lessonId: "lesson-5", title: "分析ツールの使い方", startSeconds: 960, sortOrder: 3 },
  // Lesson 6
  { id: "ch-18", lessonId: "lesson-6", title: "SNS広告の種類", startSeconds: 0, sortOrder: 0 },
  { id: "ch-19", lessonId: "lesson-6", title: "ターゲティング設定", startSeconds: 320, sortOrder: 1 },
  { id: "ch-20", lessonId: "lesson-6", title: "クリエイティブ制作のポイント", startSeconds: 640, sortOrder: 2 },
  // Lesson 7
  { id: "ch-21", lessonId: "lesson-7", title: "検索エンジンの仕組み", startSeconds: 0, sortOrder: 0 },
  { id: "ch-22", lessonId: "lesson-7", title: "SEOの3つの柱", startSeconds: 260, sortOrder: 1 },
  { id: "ch-23", lessonId: "lesson-7", title: "最新アルゴリズム動向", startSeconds: 520, sortOrder: 2 },
  // Lesson 8
  { id: "ch-24", lessonId: "lesson-8", title: "キーワード調査ツール", startSeconds: 0, sortOrder: 0 },
  { id: "ch-25", lessonId: "lesson-8", title: "検索意図の分類", startSeconds: 400, sortOrder: 1 },
  { id: "ch-26", lessonId: "lesson-8", title: "競合サイト分析", startSeconds: 800, sortOrder: 2 },
  { id: "ch-27", lessonId: "lesson-8", title: "キーワード選定の実践", startSeconds: 1200, sortOrder: 3 },
  // Lesson 9
  { id: "ch-28", lessonId: "lesson-9", title: "SEOライティングの基本", startSeconds: 0, sortOrder: 0 },
  { id: "ch-29", lessonId: "lesson-9", title: "構造化データ", startSeconds: 440, sortOrder: 1 },
  { id: "ch-30", lessonId: "lesson-9", title: "内部リンク戦略", startSeconds: 880, sortOrder: 2 },
  // Lesson 10
  { id: "ch-31", lessonId: "lesson-10", title: "Google広告の種類", startSeconds: 0, sortOrder: 0 },
  { id: "ch-32", lessonId: "lesson-10", title: "キャンペーン設定", startSeconds: 360, sortOrder: 1 },
  { id: "ch-33", lessonId: "lesson-10", title: "入札戦略", startSeconds: 720, sortOrder: 2 },
  // Lesson 11
  { id: "ch-34", lessonId: "lesson-11", title: "GA4の基本設定", startSeconds: 0, sortOrder: 0 },
  { id: "ch-35", lessonId: "lesson-11", title: "イベントとコンバージョン", startSeconds: 480, sortOrder: 1 },
  { id: "ch-36", lessonId: "lesson-11", title: "レポート作成", startSeconds: 960, sortOrder: 2 },
  // Lesson 12
  { id: "ch-37", lessonId: "lesson-12", title: "ROIの計算方法", startSeconds: 0, sortOrder: 0 },
  { id: "ch-38", lessonId: "lesson-12", title: "データ分析フレームワーク", startSeconds: 420, sortOrder: 1 },
  { id: "ch-39", lessonId: "lesson-12", title: "改善施策の立案", startSeconds: 840, sortOrder: 2 },
  { id: "ch-40", lessonId: "lesson-12", title: "最終レポートの書き方", startSeconds: 1260, sortOrder: 3 },
];
