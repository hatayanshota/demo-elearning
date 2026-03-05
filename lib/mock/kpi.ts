import type { KpiSummary, KpiCharts, ChartDataItem, SeminarTrendItem, ActiveTrendItem } from "@/lib/types/api";
import { mockStudentProfiles } from "./users";
import { mockLessons } from "./courses";
import { mockLessonProgresses } from "./progress";
import { mockAssignments } from "./assignments";
import { mockSeminarRegistrations } from "./seminars";
import { mockActivityLogs } from "./activity-logs";

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const k = key(item);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

function toChartData(counts: Record<string, number>, limit = 10): ChartDataItem[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

export function getKpiSummary(): KpiSummary {
  const total = mockStudentProfiles.length;
  const now = new Date("2026-03-05");
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const active = mockStudentProfiles.filter(p =>
    p.lastLoginAt && new Date(p.lastLoginAt) > thirtyDaysAgo
  ).length;

  const totalLessons = mockLessons.length;

  const assignmentLessons = mockLessons.filter(l => l.hasAssignment);
  const totalAssignments = assignmentLessons.length * total;
  const completedAssignments = mockAssignments.filter(a => a.status === "REVIEWED").length;

  const highRisk = mockStudentProfiles.filter(p => p.churnRiskLevel === "HIGH").length;

  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentCompleters = mockStudentProfiles.filter(p => {
    const all = mockLessonProgresses.filter(
      lp => lp.userId === p.userId && lp.isCompleted
    );
    return all.length === totalLessons && all.some(lp =>
      lp.completedAt && new Date(lp.completedAt) > threeMonthsAgo
    );
  }).length;

  const thisMonth = new Date(now);
  thisMonth.setDate(1);
  const newEnrollments = mockStudentProfiles.filter(p =>
    new Date(p.enrolledAt) >= thisMonth
  ).length;

  // Average completion days for students who completed all lessons
  const completionDays: number[] = [];
  for (const p of mockStudentProfiles) {
    const all = mockLessonProgresses.filter(lp => lp.userId === p.userId && lp.isCompleted);
    if (all.length === totalLessons) {
      const lastDate = all.reduce((max, lp) =>
        lp.completedAt && new Date(lp.completedAt) > max ? new Date(lp.completedAt) : max
      , new Date(p.enrolledAt));
      const days = Math.floor((lastDate.getTime() - new Date(p.enrolledAt).getTime()) / 86400000);
      completionDays.push(days);
    }
  }
  const avgDays = completionDays.length > 0
    ? Math.round(completionDays.reduce((s, d) => s + d, 0) / completionDays.length)
    : 0;

  const seminarStudents = new Set(mockSeminarRegistrations.map(r => r.userId));
  const seminarRate = Math.round((seminarStudents.size / total) * 100);

  return {
    totalStudents: total,
    activeRate: Math.round((active / total) * 100),
    assignmentCompletionRate: Math.round((completedAssignments / totalAssignments) * 100),
    averageCompletionDays: avgDays,
    seminarParticipationRate: seminarRate,
    highChurnRiskCount: highRisk,
    recentCompletionCount: recentCompleters,
    newEnrollmentCount: newEnrollments,
  };
}

export function getKpiCharts(): KpiCharts {
  // Age distribution
  const ageBuckets = countBy(
    mockStudentProfiles.filter(p => p.age !== null),
    p => {
      const age = p.age!;
      if (age < 20) return "10代";
      if (age < 30) return "20代";
      if (age < 40) return "30代";
      if (age < 50) return "40代";
      return "50代以上";
    }
  );
  const ageOrder = ["10代", "20代", "30代", "40代", "50代以上"];
  const ageDistribution = ageOrder
    .filter(k => ageBuckets[k])
    .map(label => ({ label, value: ageBuckets[label] }));

  // Gender distribution
  const genderMap: Record<string, string> = { MALE: "男性", FEMALE: "女性", OTHER: "その他" };
  const genderDistribution = toChartData(
    countBy(mockStudentProfiles.filter(p => p.gender), p => genderMap[p.gender!])
  );

  // Occupation distribution
  const occupationDistribution = toChartData(
    countBy(mockStudentProfiles.filter(p => p.occupation), p => p.occupation!)
  );

  // Region distribution
  const regionDistribution = toChartData(
    countBy(mockStudentProfiles.filter(p => p.prefecture), p => p.prefecture!)
  );

  // Seminar trend (last 6 months)
  const months = ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"];
  const seminarTrend: SeminarTrendItem[] = months.map(m => {
    const regs = mockSeminarRegistrations.filter(r => r.registeredAt.startsWith(m));
    return {
      month: m,
      online: regs.filter(r => r.attendanceType === "ONLINE").length,
      onsite: regs.filter(r => r.attendanceType === "ONSITE").length,
    };
  });

  // Assignment bottleneck
  const lessonIncomplete = countBy(
    mockLessonProgresses.filter(lp => !lp.isCompleted),
    lp => {
      const lesson = mockLessons.find(l => l.id === lp.lessonId);
      return lesson?.title ?? lp.lessonId;
    }
  );
  const assignmentBottleneck = toChartData(lessonIncomplete);

  // Completion days histogram
  const daysBuckets: Record<string, number> = {};
  for (const p of mockStudentProfiles) {
    const lastAssignment = mockAssignments
      .filter(a => a.userId === p.userId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
    if (lastAssignment) {
      const days = Math.floor(
        (new Date(lastAssignment.submittedAt).getTime() - new Date(p.enrolledAt).getTime()) / 86400000
      );
      const bucket = `${Math.floor(days / 30) * 30}〜${Math.floor(days / 30) * 30 + 29}日`;
      daysBuckets[bucket] = (daysBuckets[bucket] ?? 0) + 1;
    }
  }
  const completionDaysHistogram = Object.entries(daysBuckets)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([label, value]) => ({ label, value }));

  // Active trend (last 12 weeks)
  const activeTrend: ActiveTrendItem[] = [];
  const now = new Date("2026-03-05");
  for (let w = 11; w >= 0; w--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);
    const uniqueUsers = new Set(
      mockActivityLogs
        .filter(l => l.type === "LOGIN" && new Date(l.createdAt) >= weekStart && new Date(l.createdAt) < weekEnd)
        .map(l => l.userId)
    );
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    activeTrend.push({ week: weekLabel, count: uniqueUsers.size });
  }

  return {
    ageDistribution, genderDistribution, occupationDistribution, regionDistribution,
    seminarTrend, assignmentBottleneck, completionDaysHistogram, activeTrend,
  };
}
