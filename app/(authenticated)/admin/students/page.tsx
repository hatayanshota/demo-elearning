import { Suspense } from "react";
import { StudentList } from "@/features/students/ui/students";

export default function StudentsPage() {
  return (
    <Suspense>
      <StudentList />
    </Suspense>
  );
}
