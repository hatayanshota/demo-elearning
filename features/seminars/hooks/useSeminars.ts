import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRoleStore } from "@/lib/stores/role-store";
import { getSeminars, createSeminarRegistration, deleteSeminarRegistration } from "../api/seminar.api";
import { toast } from "sonner";
import type { AttendanceType } from "@/lib/types/api";
import { mockSeminarRegistrations, mockStudentProfiles, mockUsers } from "@/lib/mock";

export type SeminarAttendee = {
  name: string;
  attendanceType: "ONLINE" | "ONSITE";
};

export function useSeminars() {
  const queryClient = useQueryClient();
  const { role, user } = useRoleStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const query = useQuery({
    queryKey: ["seminars", user.id, tab],
    queryFn: () => getSeminars(user.id, tab),
  });

  const attendeesBySeminar = useMemo(() => {
    const map: Record<string, SeminarAttendee[]> = {};
    mockSeminarRegistrations.forEach((reg) => {
      const u = mockUsers.find((u) => u.id === reg.userId);
      if (!u) return;
      if (!map[reg.seminarId]) map[reg.seminarId] = [];
      map[reg.seminarId].push({
        name: u.name,
        attendanceType: reg.attendanceType,
      });
    });
    return map;
  }, []);

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

  const isSalonMember = useMemo(() => {
    if (role !== "STUDENT") return false;
    const profile = mockStudentProfiles.find((p) => p.userId === user.id);
    return profile?.isSalonMember ?? false;
  }, [role, user.id]);

  return {
    seminars: query.data ?? [],
    tab, setTab,
    isLoading: query.isLoading,
    role,
    isSalonMember,
    attendeesBySeminar,
    onRegister: handleRegister,
    onCancel: handleCancel,
  };
}
