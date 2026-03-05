import { useQuery } from "@tanstack/react-query";
import { useRoleStore } from "@/lib/stores/role-store";
import { getCourseDetail } from "../api/curriculum.api";

export function useCurriculum(courseId: string) {
  const user = useRoleStore((s) => s.user);

  const query = useQuery({
    queryKey: ["curriculum", courseId, user.id],
    queryFn: () => getCourseDetail(courseId, user.id),
  });

  return {
    course: query.data?.course ?? null,
    sections: query.data?.sections ?? [],
    isLoading: query.isLoading,
  };
}
