"use client";

import { useRouter } from "next/navigation";
import { useCourses } from "../hooks/useCourses";
import { CourseListView } from "./CourseList.view";

export function CourseListContainer() {
  const router = useRouter();
  const { courses, isLoading, isStudent } = useCourses();

  return (
    <CourseListView
      courses={courses} isLoading={isLoading} isStudent={isStudent}
      onCourseClick={(id) => router.push(`/student/courses/${id}`)}
    />
  );
}
