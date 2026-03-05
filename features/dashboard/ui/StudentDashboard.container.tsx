"use client";

import { useRouter } from "next/navigation";
import { useStudentDashboard } from "../hooks/useStudentDashboard";
import { StudentDashboardView } from "./StudentDashboard.view";

export function StudentDashboardContainer() {
  const router = useRouter();
  const hook = useStudentDashboard();

  return (
    <StudentDashboardView
      {...hook}
      onCourseClick={(id) => router.push(`/student/courses/${id}`)}
      onNextLessonClick={(courseId, lessonId) => router.push(`/student/courses/${courseId}/lessons/${lessonId}`)}
    />
  );
}
