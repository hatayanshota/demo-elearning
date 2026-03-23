"use client";

import { useRouter } from "next/navigation";
import { useStudents } from "../hooks/useStudents";
import { StudentListView } from "./StudentList.view";
import { useRoleStore } from "@/lib/stores/role-store";

export function StudentListContainer() {
  const router = useRouter();
  const { role } = useRoleStore();

  const hook = useStudents();

  const handleStudentClick = (id: string) => {
    if (role === "ADMIN") {
      router.push(`/admin/students/${id}`);
    }
  };

  return (
    <StudentListView
      {...hook}
      role={role}
      onPageChange={hook.setPage}
      onStudentClick={handleStudentClick}
    />
  );
}
