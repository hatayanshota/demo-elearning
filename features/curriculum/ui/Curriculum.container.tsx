"use client";

import { useRouter } from "next/navigation";
import { useCurriculum } from "../hooks/useCurriculum";
import { CurriculumView } from "./Curriculum.view";

type Props = { courseId: string };

export function CurriculumContainer({ courseId }: Props) {
  const router = useRouter();
  const { course, sections, isLoading } = useCurriculum(courseId);

  return (
    <CurriculumView
      course={course} sections={sections} isLoading={isLoading}
      onLessonClick={(cId, lId) => router.push(`/student/courses/${cId}/lessons/${lId}`)}
    />
  );
}
