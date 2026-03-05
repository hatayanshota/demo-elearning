import type {
  StudentWithProfile, StudentDetail, StudentsListParams,
  PaginatedResponse, ChurnFactors, ProgressTimelineItem,
} from "@/lib/types/api";
import {
  mockUsers, mockStudentProfiles, mockLessonProgresses,
  mockAssignments, mockSeminarRegistrations, mockSeminars,
  mockActivityLogs, mockLessons,
} from "@/lib/mock";

export async function getStudents(params: StudentsListParams): Promise<PaginatedResponse<StudentWithProfile>> {
  const students = mockUsers.filter(u => u.role === "STUDENT");
  let list: StudentWithProfile[] = students.map(u => {
    const profile = mockStudentProfiles.find(p => p.userId === u.id)!;
    const totalLessons = mockLessons.length;
    const completed = mockLessonProgresses.filter(lp => lp.userId === u.id && lp.isCompleted).length;
    return { ...u, profile, progressRate: Math.round((completed / totalLessons) * 100) };
  });

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }
  if (params.riskLevel) {
    list = list.filter(s => s.profile.churnRiskLevel === params.riskLevel);
  }
  if (params.sortBy) {
    const dir = params.sortOrder === "desc" ? -1 : 1;
    list.sort((a, b) => {
      switch (params.sortBy) {
        case "name": return a.name.localeCompare(b.name) * dir;
        case "enrolledAt": return (new Date(a.profile.enrolledAt).getTime() - new Date(b.profile.enrolledAt).getTime()) * dir;
        case "progressRate": return (a.progressRate - b.progressRate) * dir;
        case "churnRiskScore": return (a.profile.churnRiskScore - b.profile.churnRiskScore) * dir;
        case "lastLoginAt": {
          const aTime = a.profile.lastLoginAt ? new Date(a.profile.lastLoginAt).getTime() : 0;
          const bTime = b.profile.lastLoginAt ? new Date(b.profile.lastLoginAt).getTime() : 0;
          return (aTime - bTime) * dir;
        }
        default: return 0;
      }
    });
  }

  const page = params.page ?? 1;
  const perPage = params.perPage ?? 20;
  const total = list.length;
  const data = list.slice((page - 1) * perPage, page * perPage);

  return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function getStudent(id: string): Promise<StudentDetail | null> {
  const user = mockUsers.find(u => u.id === id);
  if (!user || user.role !== "STUDENT") return null;

  const profile = mockStudentProfiles.find(p => p.userId === id)!;
  const totalLessons = mockLessons.length;
  const completedCount = mockLessonProgresses.filter(lp => lp.userId === id && lp.isCompleted).length;

  // Churn factors
  const now = new Date("2026-03-05");
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const loginCount = mockActivityLogs.filter(
    l => l.userId === id && l.type === "LOGIN" && new Date(l.createdAt) > thirtyDaysAgo
  ).length;

  const userAssignments = mockAssignments.filter(a => a.userId === id).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  const lastSubmit = userAssignments[0];
  const daysSinceSubmit = lastSubmit
    ? Math.floor((now.getTime() - new Date(lastSubmit.submittedAt).getTime()) / 86400000)
    : 90;

  const totalSeminars = mockSeminars.length;
  const attended = mockSeminarRegistrations.filter(r => r.userId === id).length;

  const churnFactors: ChurnFactors = {
    loginFrequency: Math.round(loginCount / 4.3),
    assignmentInterval: daysSinceSubmit,
    seminarParticipationRate: totalSeminars > 0 ? Math.round((attended / totalSeminars) * 100) : 0,
  };

  // Progress timeline
  const timeline: ProgressTimelineItem[] = [
    { date: profile.enrolledAt, label: "入会", type: "enrollment" },
  ];
  const completedProgresses = mockLessonProgresses
    .filter(lp => lp.userId === id && lp.isCompleted && lp.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());
  for (const lp of completedProgresses) {
    const lesson = mockLessons.find(l => l.id === lp.lessonId);
    if (lesson?.hasAssignment) {
      timeline.push({ date: lp.completedAt!, label: `${lesson.title} 完了`, type: "assignment_complete" });
    }
  }
  timeline.push({ date: now.toISOString(), label: "現在", type: "current" });

  const activityLogs = mockActivityLogs
    .filter(l => l.userId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...user, profile,
    progressRate: Math.round((completedCount / totalLessons) * 100),
    churnFactors, progressTimeline: timeline, activityLogs,
  };
}
