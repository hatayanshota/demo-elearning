"use client";

import { useRouter } from "next/navigation";
import { useStudentDetail } from "../hooks/useStudentDetail";
import { StudentDetailView } from "./StudentDetail.view";

type Props = { studentId: string };

export function StudentDetailContainer({ studentId }: Props) {
  const router = useRouter();
  const { student, isLoading } = useStudentDetail(studentId);

  return (
    <StudentDetailView
      student={student}
      isLoading={isLoading}
      onBack={() => router.push("/admin/students")}
    />
  );
}
