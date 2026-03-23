import { Suspense } from "react";
import { StudentList } from "@/features/students/ui/students";

export default function TeacherStudentsPage() {
  return (
    <Suspense>
      <StudentList />
    </Suspense>
  );
}
