"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, LogIn, BookOpen, Send, Calendar, CheckCircle2 } from "lucide-react";
import type { CourseWithProgress, Lesson, ActivityLog, ActivityType, Announcement, Seminar } from "@/lib/types/api";

const activityIcons: Record<ActivityType, React.ReactNode> = {
  LOGIN: <LogIn className="h-4 w-4 text-blue-500" />,
  LESSON_VIEW: <BookOpen className="h-4 w-4 text-green-500" />,
  ASSIGNMENT_SUBMIT: <Send className="h-4 w-4 text-purple-500" />,
  SEMINAR_REGISTER: <Calendar className="h-4 w-4 text-orange-500" />,
};
const activityLabels: Record<ActivityType, string> = {
  LOGIN: "ログイン", LESSON_VIEW: "レッスン閲覧",
  ASSIGNMENT_SUBMIT: "課題提出", SEMINAR_REGISTER: "セミナー申込",
};

type StudentDashboardViewProps = {
  courses: CourseWithProgress[];
  daysSinceEnrollment: number;
  nextLesson: Lesson | undefined;
  recentLogs: ActivityLog[];
  announcements: Announcement[];
  upcomingSeminars: Seminar[];
  seminarCount: number;
  eventCount: number;
  isLoading: boolean;
  onCourseClick: (courseId: string) => void;
  onNextLessonClick: (courseId: string, lessonId: string) => void;
};

export function StudentDashboardView(props: StudentDashboardViewProps) {
  const { courses, daysSinceEnrollment, nextLesson, recentLogs, announcements, upcomingSeminars, seminarCount, eventCount, isLoading,
    onCourseClick, onNextLessonClick } = props;

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  const mainCourse = courses[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">学習ダッシュボード</h1>

      {mainCourse && (
        <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">入会 {daysSinceEnrollment} 日目 · 学習を続けましょう！</p>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={mainCourse.progressRate} className="h-3 w-48 bg-white/20 [&>div]:bg-white" />
                <span className="text-lg font-bold">{mainCourse.progressRate}%</span>
                <span className="text-sm text-white/70">全レッスン完了</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nextLesson && (
          <Card className="cursor-pointer border-indigo-200 bg-indigo-50/50 transition-shadow hover:shadow-md" onClick={() => onNextLessonClick("course-1", nextLesson.id)}>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-indigo-600">次のレッスン →</p>
              <h3 className="mt-1 font-semibold">{nextLesson.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {nextLesson.durationSeconds ? `${Math.floor(nextLesson.durationSeconds / 60)}分` : ""}
              </p>
            </CardContent>
          </Card>
        )}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-amber-600">お知らせ</p>
            <div className="mt-2 space-y-2">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="border-b border-amber-100 pb-2 last:border-0">
                  <p className="text-sm font-medium">{ann.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(ann.date).toLocaleDateString("ja-JP")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {upcomingSeminars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">今後のセミナー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSeminars.map((sem) => (
              <div key={sem.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <span className="text-xs font-bold">{new Date(sem.date).getDate()}</span>
                  <span className="text-[10px]">{new Date(sem.date).toLocaleDateString("ja-JP", { month: "short" })}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{sem.title}</p>
                  <p className="text-xs text-muted-foreground">{sem.location ?? "オンライン"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">今週のアクション</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">活動履歴はありません</p>
          ) : (
            recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  {activityIcons[log.type]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activityLabels[log.type]}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
                {log.type === "ASSIGNMENT_SUBMIT" && (
                  <Button size="sm" variant="default" className="h-7 px-3 text-xs">採点</Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">セミナー参加回数</p>
            <p className={`mt-1 text-2xl font-bold ${seminarCount > 0 ? "text-green-500" : "text-red-500"}`}>
              {seminarCount}回
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">イベント参加回数</p>
            <p className={`mt-1 text-2xl font-bold ${eventCount > 0 ? "text-green-500" : "text-red-500"}`}>
              {eventCount}回
            </p>
          </CardContent>
        </Card>
      </div>

      {courses.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">コース進捗</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-3 cursor-pointer" onClick={() => onCourseClick(course.id)}>
                <CheckCircle2 className={`h-5 w-5 ${course.progressRate === 100 ? "text-green-500" : "text-muted-foreground/30"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{course.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={course.progressRate} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{course.progressRate}%</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
