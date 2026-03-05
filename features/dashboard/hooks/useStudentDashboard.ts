import { useQuery } from "@tanstack/react-query";
import { useRoleStore } from "@/lib/stores/role-store";
import { getCourses } from "@/features/courses/api/course.api";
import { mockActivityLogs, mockLessons, mockLessonProgresses } from "@/lib/mock";

export function useStudentDashboard() {
  const user = useRoleStore((s) => s.user);

  const coursesQuery = useQuery({
    queryKey: ["student-courses", user.id],
    queryFn: () => getCourses(user.id),
  });

  const enrolledAt = "2025-03-15T00:00:00Z"; // mockStudentUser's enrolledAt
  const daysSinceEnrollment = Math.floor(
    (new Date("2026-03-05").getTime() - new Date(enrolledAt).getTime()) / 86400000
  );

  // Next lesson: first incomplete lesson
  const completedLessonIds = new Set(
    mockLessonProgresses.filter(lp => lp.userId === user.id && lp.isCompleted).map(lp => lp.lessonId)
  );
  const sortedLessons = [...mockLessons].sort((a, b) => a.sortOrder - b.sortOrder);
  const nextLesson = sortedLessons.find(l => !completedLessonIds.has(l.id));

  const recentLogs = mockActivityLogs
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    courses: coursesQuery.data ?? [],
    daysSinceEnrollment,
    nextLesson,
    recentLogs,
    isLoading: coursesQuery.isLoading,
  };
}
