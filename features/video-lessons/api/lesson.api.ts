import type { LessonWithProgress, LessonProgress, Assignment, Review } from "@/lib/types/api";
import { mockLessons, mockChapters, mockLessonProgresses, mockAssignments, mockReviews } from "@/lib/mock";

export type LessonDetailResponse = {
  lesson: LessonWithProgress;
  assignment: (Assignment & { review: Review | null }) | null;
};

export async function getLessonDetail(lessonId: string, userId: string): Promise<LessonDetailResponse | null> {
  const lesson = mockLessons.find(l => l.id === lessonId);
  if (!lesson) return null;

  const progress = mockLessonProgresses.find(
    lp => lp.userId === userId && lp.lessonId === lessonId
  ) ?? null;
  const chapters = mockChapters
    .filter(ch => ch.lessonId === lessonId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const existingAssignment = mockAssignments.find(
    a => a.userId === userId && a.lessonId === lessonId
  );
  let assignment: (Assignment & { review: Review | null }) | null = null;
  if (existingAssignment) {
    const review = mockReviews.find(r => r.assignmentId === existingAssignment.id) ?? null;
    assignment = { ...existingAssignment, review };
  }

  return {
    lesson: { ...lesson, progress, isLocked: false, chapters },
    assignment,
  };
}

export async function updateLessonProgress(
  lessonId: string, userId: string, watchedSeconds: number
): Promise<LessonProgress> {
  const existing = mockLessonProgresses.find(
    lp => lp.userId === userId && lp.lessonId === lessonId
  );
  if (existing) {
    existing.watchedSeconds = watchedSeconds;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }
  const newProgress: LessonProgress = {
    id: `progress-${userId}-${lessonId}`,
    userId, lessonId, watchedSeconds, isCompleted: false,
    completedAt: null, updatedAt: new Date().toISOString(),
  };
  mockLessonProgresses.push(newProgress);
  return newProgress;
}

export async function completeLessonProgress(
  lessonId: string, userId: string
): Promise<LessonProgress> {
  const lesson = mockLessons.find(l => l.id === lessonId)!;
  const existing = mockLessonProgresses.find(
    lp => lp.userId === userId && lp.lessonId === lessonId
  );
  if (existing) {
    existing.isCompleted = true;
    existing.completedAt = new Date().toISOString();
    existing.watchedSeconds = lesson.durationSeconds ?? 0;
    return existing;
  }
  const newProgress: LessonProgress = {
    id: `progress-${userId}-${lessonId}`,
    userId, lessonId, watchedSeconds: lesson.durationSeconds ?? 0,
    isCompleted: true, completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockLessonProgresses.push(newProgress);
  return newProgress;
}

export async function createAssignment(
  lessonId: string, userId: string, content: string
): Promise<Assignment> {
  const assignment: Assignment = {
    id: `assignment-${Date.now()}`,
    userId, lessonId, content, status: "PENDING",
    submittedAt: new Date().toISOString(),
  };
  mockAssignments.push(assignment);
  return assignment;
}
