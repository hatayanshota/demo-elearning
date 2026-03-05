import type { LessonProgress } from "@/lib/types/api";

function makeProgress(
  userId: string, lessonId: string, watched: number, completed: boolean, completedDate: string | null
): LessonProgress {
  return {
    id: `progress-${userId}-${lessonId}`,
    userId, lessonId, watchedSeconds: watched, isCompleted: completed,
    completedAt: completedDate, updatedAt: completedDate ?? "2026-03-01T00:00:00Z",
  };
}

const lessonDurations = [720,900,1080,840,1200,960,780,1500,1320,1080,1440,1680];

function allCompleted(userId: string, baseDate: string): LessonProgress[] {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + (i + 1) * 5);
    return makeProgress(userId, `lesson-${i + 1}`, lessonDurations[i], true, d.toISOString());
  });
}

function partialProgress(userId: string, count: number, baseDate: string): LessonProgress[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + (i + 1) * 7);
    const completed = i < count - 1;
    const watched = completed ? lessonDurations[i] : Math.floor(lessonDurations[i] * 0.4);
    return makeProgress(userId, `lesson-${i + 1}`, watched, completed, completed ? d.toISOString() : null);
  });
}

function minimalProgress(userId: string, count: number, baseDate: string): LessonProgress[] {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 14);
    const completed = i === 0 && count > 0;
    const watched = completed ? lessonDurations[i] : Math.floor(lessonDurations[i] * 0.15);
    return makeProgress(userId, `lesson-${i + 1}`, watched, completed, completed ? d.toISOString() : null);
  });
}

const enrollDates = [
  "2025-03-15","2025-04-01","2025-02-10","2025-05-20","2025-06-01",
  "2025-04-15","2025-07-01","2025-03-01","2025-05-10","2025-08-01",
  "2025-06-15","2025-04-20","2025-03-10","2025-07-15","2025-05-01",
  "2025-08-15","2025-02-01","2025-06-20","2025-09-01","2025-04-10",
  "2025-07-20","2025-05-15","2025-08-10","2025-03-20","2025-09-15",
  "2025-06-10","2025-10-01","2025-07-05","2025-04-25","2025-11-01",
  "2025-08-20","2025-05-25","2025-10-15","2025-09-10","2025-11-15",
  "2025-12-01","2025-10-20","2025-11-10","2025-12-15","2026-01-05",
];

// 完了者: user-4 to user-8 (index 0-4)
// 順調: user-9 to user-23 (index 5-19), 6-10 lessons
// 停滞: user-24 to user-33 (index 20-29), 3-5 lessons
// 未着手: user-34 to user-43 (index 30-39), 0-1 lessons
const progressCounts = [
  12,12,12,12,12, // 完了者
  10,9,8,10,7,9,8,10,7,9,8,10,7,6,8, // 順調
  5,4,3,5,4,3,5,4,3,5, // 停滞
  1,0,1,0,1,0,1,0,0,0, // 未着手
];

export const mockLessonProgresses: LessonProgress[] = Array.from({ length: 40 }, (_, i) => {
  const userId = `user-${i + 4}`;
  const count = progressCounts[i];
  const base = enrollDates[i];
  if (count === 12) return allCompleted(userId, base);
  if (i < 20) return partialProgress(userId, count, base);
  return minimalProgress(userId, count, base);
}).flat();
