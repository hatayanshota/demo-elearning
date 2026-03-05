"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useStudents } from "../hooks/useStudents";
import { StudentListView } from "./StudentList.view";
import type { ChurnRiskLevel } from "@/lib/types/api";

export function StudentListContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRisk = searchParams.get("risk") as ChurnRiskLevel | null;

  const hook = useStudents(initialRisk ?? undefined);

  return (
    <StudentListView
      {...hook}
      onPageChange={hook.setPage}
      onStudentClick={(id) => router.push(`/admin/students/${id}`)}
    />
  );
}
