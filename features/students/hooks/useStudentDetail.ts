import { useQuery } from "@tanstack/react-query";
import { getStudent } from "../api/student.api";

export function useStudentDetail(id: string) {
  const query = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
  });

  return {
    student: query.data ?? null,
    isLoading: query.isLoading,
  };
}
