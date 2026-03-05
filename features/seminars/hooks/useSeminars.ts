import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRoleStore } from "@/lib/stores/role-store";
import { getSeminars, createSeminarRegistration, deleteSeminarRegistration } from "../api/seminar.api";
import { toast } from "sonner";
import type { AttendanceType } from "@/lib/types/api";

export function useSeminars() {
  const queryClient = useQueryClient();
  const { role, user } = useRoleStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const query = useQuery({
    queryKey: ["seminars", user.id, tab],
    queryFn: () => getSeminars(user.id, tab),
  });

  const handleRegister = async (seminarId: string, attendanceType: AttendanceType) => {
    await createSeminarRegistration(seminarId, user.id, attendanceType);
    toast.success("セミナーに申し込みました");
    queryClient.invalidateQueries({ queryKey: ["seminars"] });
  };

  const handleCancel = async (seminarId: string) => {
    await deleteSeminarRegistration(seminarId, user.id);
    toast.success("申込をキャンセルしました");
    queryClient.invalidateQueries({ queryKey: ["seminars"] });
  };

  return {
    seminars: query.data ?? [],
    tab, setTab,
    isLoading: query.isLoading,
    role,
    onRegister: handleRegister,
    onCancel: handleCancel,
  };
}
