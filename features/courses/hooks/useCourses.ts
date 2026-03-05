import { useQuery } from "@tanstack/react-query";
import { useRoleStore } from "@/lib/stores/role-store";
import { getCourses } from "../api/course.api";

export function useCourses() {
  const { role, user } = useRoleStore();
  const userId = role === "STUDENT" ? user.id : undefined;

  const query = useQuery({
    queryKey: ["courses", userId],
    queryFn: () => getCourses(userId),
  });

  return {
    courses: query.data ?? [],
    isLoading: query.isLoading,
    isStudent: role === "STUDENT",
  };
}
