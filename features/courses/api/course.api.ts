import type { CourseWithProgress } from "@/lib/types/api";
import { mockCourses, mockLessons, mockSections, mockLessonProgresses } from "@/lib/mock";

export async function getCourses(userId?: string): Promise<CourseWithProgress[]> {
  return mockCourses.map(course => {
    const sections = mockSections.filter(s => s.courseId === course.id);
    const lessons = mockLessons.filter(l => sections.some(s => s.id === l.sectionId));
    const totalLessons = lessons.length;
    const completedLessons = userId
      ? mockLessonProgresses.filter(lp => lp.userId === userId && lp.isCompleted && lessons.some(l => l.id === lp.lessonId)).length
      : 0;
    return {
      ...course, totalLessons, completedLessons,
      progressRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });
}
