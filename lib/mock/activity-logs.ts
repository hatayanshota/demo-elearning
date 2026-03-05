import type { ActivityLog } from "@/lib/types/api";
import type { ActivityType } from "@/lib/types/api";

const enrollDates = [
  "2025-03-15","2025-04-01","2025-02-10","2025-05-20","2025-06-01",
  "2025-04-15","2025-07-01","2025-03-01","2025-05-10","2025-08-01",
  "2025-06-15","2025-04-20","2025-03-10","2025-07-15","2025-05-01",
  "2025-08-15","2025-02-01","2025-06-20","2025-09-01","2025-04-10",
  "2025-07-20","2025-05-15","2025-08-10","2025-03-20","2025-09-15",
  "2025-06-10","2025-10-01","2025-07-05","2025-04-25","2025-11-01",
  "2025-08-20","2025-05-25","2025-10-15","2025-09-10","2025-11-15",
  "2025-12-01","2025-10-20","2025-11-10","2025-12-15","2026-01-05",
];

// Log counts per student group
// 完了者(0-4): 35-50, 順調(5-19): 20-30, 停滞(20-29): 10-18, 未着手(30-39): 5-8
const logCounts = [
  45,40,48,38,42, // 完了者
  28,25,22,30,20,27,24,29,21,26,23,28,20,25,22, // 順調
  16,14,12,18,15,11,17,13,10,16, // 停滞
  8,6,7,5,8,5,7,6,5,5, // 未着手
];


let logId = 1;
const logs: ActivityLog[] = [];

for (let i = 0; i < 40; i++) {
  const userId = `user-${i + 4}`;
  const count = logCounts[i];
  const start = new Date(enrollDates[i]);
  const end = new Date("2026-03-05");
  const range = end.getTime() - start.getTime();

  for (let j = 0; j < count; j++) {
    const ratio = j / count;
    const date = new Date(start.getTime() + range * ratio);
    // More LOGINs, fewer ASSIGNMENT_SUBMIT/SEMINAR_REGISTER
    let type: ActivityType;
    const r = (j * 7 + i * 3) % 10;
    if (r < 5) type = "LOGIN";
    else if (r < 8) type = "LESSON_VIEW";
    else if (r < 9) type = "ASSIGNMENT_SUBMIT";
    else type = "SEMINAR_REGISTER";

    logs.push({
      id: `log-${logId++}`, userId, type, createdAt: date.toISOString(),
      metadata: type === "LESSON_VIEW" ? { lessonId: `lesson-${(j % 12) + 1}` } : null,
    });
  }
}

export const mockActivityLogs: ActivityLog[] = logs;
