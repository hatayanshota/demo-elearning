import type { SeminarWithRegistration, SeminarRegistration, AttendanceType } from "@/lib/types/api";
import { mockSeminars, mockSeminarRegistrations } from "@/lib/mock";

export async function getSeminars(
  userId: string, tab: "upcoming" | "past"
): Promise<SeminarWithRegistration[]> {
  const now = new Date("2026-03-05");
  return mockSeminars
    .filter(s => tab === "upcoming" ? new Date(s.date) >= now : new Date(s.date) < now)
    .map(s => {
      const regs = mockSeminarRegistrations.filter(r => r.seminarId === s.id);
      const registration = regs.find(r => r.userId === userId) ?? null;
      return {
        ...s, registration,
        onlineCount: regs.filter(r => r.attendanceType === "ONLINE").length,
        onsiteCount: regs.filter(r => r.attendanceType === "ONSITE").length,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function createSeminarRegistration(
  seminarId: string, userId: string, attendanceType: AttendanceType
): Promise<SeminarRegistration> {
  const reg: SeminarRegistration = {
    id: `reg-${Date.now()}`,
    userId, seminarId, attendanceType,
    registeredAt: new Date().toISOString(),
  };
  mockSeminarRegistrations.push(reg);
  return reg;
}

export async function deleteSeminarRegistration(
  seminarId: string, userId: string
): Promise<void> {
  const index = mockSeminarRegistrations.findIndex(
    r => r.seminarId === seminarId && r.userId === userId
  );
  if (index !== -1) mockSeminarRegistrations.splice(index, 1);
}
