import type { CourseWithProgress, SectionWithLessons } from "@/lib/types/api";
import { mockCourses, mockSections, mockLessons, mockChapters, mockLessonProgresses, mockAssignments } from "@/lib/mock";

export async function getCourseDetail(
  courseId: string, userId: string
): Promise<{ course: CourseWithProgress; sections: SectionWithLessons[] } | null> {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return null;

  const sections = mockSections
    .filter(s => s.courseId === courseId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  let allCompleted = true;
  const sectionsWithLessons: SectionWithLessons[] = sections.map(section => {
    const lessons = mockLessons
      .filter(l => l.sectionId === section.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(lesson => {
        const progress = mockLessonProgresses.find(
          lp => lp.userId === userId && lp.lessonId === lesson.id
        ) ?? null;
        const chapters = mockChapters
          .filter(ch => ch.lessonId === lesson.id)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        const assignment = mockAssignments.find(
          a => a.userId === userId && a.lessonId === lesson.id
        ) ?? null;
        const isLocked = !allCompleted;
        if (!progress?.isCompleted) allCompleted = false;
        return { ...lesson, progress, isLocked: isLocked && !progress, chapters, assignment };
      });
    return { ...section, lessons };
  });

  const allLessons = mockLessons.filter(l => sections.some(s => s.id === l.sectionId));
  const totalLessons = allLessons.length;
  const completedLessons = mockLessonProgresses.filter(
    lp => lp.userId === userId && lp.isCompleted && allLessons.some(l => l.id === lp.lessonId)
  ).length;

  return {
    course: {
      ...course, totalLessons, completedLessons,
      progressRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    },
    sections: sectionsWithLessons,
  };
}
