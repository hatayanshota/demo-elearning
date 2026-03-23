import type { AssignmentWithDetails, Review } from "@/lib/types/api";
import { mockAssignments, mockReviews, mockUsers, mockLessons } from "@/lib/mock";

export async function getReviews(tab: "pending" | "reviewed"): Promise<AssignmentWithDetails[]> {
  const status = tab === "pending" ? "PENDING" : "REVIEWED";
  return mockAssignments
    .filter(a => a.status === status)
    .map(a => {
      const student = mockUsers.find(u => u.id === a.userId);
      const lesson = mockLessons.find(l => l.id === a.lessonId);
      const review = mockReviews.find(r => r.assignmentId === a.id) ?? null;
      return {
        ...a,
        studentName: student?.name ?? "不明",
        studentAvatarUrl: student?.avatarUrl ?? null,
        lessonTitle: lesson?.title ?? "不明",
        review,
      };
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getReviewDetail(assignmentId: string): Promise<AssignmentWithDetails | null> {
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  if (!assignment) return null;
  const student = mockUsers.find(u => u.id === assignment.userId);
  const lesson = mockLessons.find(l => l.id === assignment.lessonId);
  const review = mockReviews.find(r => r.assignmentId === assignment.id) ?? null;
  return {
    ...assignment,
    studentName: student?.name ?? "不明",
    studentAvatarUrl: student?.avatarUrl ?? null,
    lessonTitle: lesson?.title ?? "不明",
    review,
  };
}

export async function getReviewStats(): Promise<{ total: number; reviewed: number; pending: number }> {
  const total = mockAssignments.length;
  const reviewed = mockAssignments.filter(a => a.status === "REVIEWED").length;
  const pending = mockAssignments.filter(a => a.status === "PENDING").length;
  return { total, reviewed, pending };
}

export async function createReview(
  assignmentId: string, reviewerId: string, feedback: string, rating: number | null
): Promise<Review> {
  const review: Review = {
    id: `review-${Date.now()}`,
    assignmentId, reviewerId, feedback, rating,
    reviewedAt: new Date().toISOString(),
  };
  mockReviews.push(review);
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  if (assignment) assignment.status = "REVIEWED";
  return review;
}
