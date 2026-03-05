"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, LogIn, BookOpen, Send, Calendar } from "lucide-react";
import type { StudentDetail, ActivityType } from "@/lib/types/api";

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

type StudentDetailViewProps = {
  student: StudentDetail | null;
  isLoading: boolean;
  onBack: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP");
}

function daysSince(iso: string) {
  return Math.floor((new Date("2026-03-05").getTime() - new Date(iso).getTime()) / 86400000);
}

function ChurnScoreCircle({ score, level }: { score: number; level: string }) {
  const bgColor = score <= 30 ? "bg-green-500" : score <= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-medium text-muted-foreground">離脱スコア</p>
      <div className={`flex h-20 w-20 items-center justify-center rounded-full text-white ${bgColor}`}>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <Badge variant={level === "HIGH" ? "destructive" : level === "MEDIUM" ? "default" : "secondary"}>
        {level === "HIGH" ? "高リスク" : level === "MEDIUM" ? "中リスク" : "低リスク"}
      </Badge>
    </div>
  );
}

export function StudentDetailView({ student, isLoading, onBack }: StudentDetailViewProps) {
  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}</div>;
  }
  if (!student) return <p>生徒が見つかりません</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" /> 生徒一覧
        </Button>
        <span>/</span>
        <span className="font-medium text-foreground">{student.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                {student.name[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{student.email}</p>
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                  <span>{student.profile.age ?? "—"}歳 · {student.profile.gender === "MALE" ? "男性" : student.profile.gender === "FEMALE" ? "女性" : "その他"}</span>
                  <span>{student.profile.occupation ?? "—"}</span>
                  <span>入会から{daysSince(student.profile.enrolledAt)}日目</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full items-center justify-center p-6">
            <ChurnScoreCircle score={student.profile.churnRiskScore} level={student.profile.churnRiskLevel} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">全レッスン進捗</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={student.progressRate} className="h-2 flex-1" />
              <span className="text-sm font-semibold">{student.progressRate}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">ログイン頻度</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">週{student.churnFactors.loginFrequency}回</p>
            <p className="text-xs text-muted-foreground">課題提出間隔: 平均{student.churnFactors.assignmentInterval}日</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">セミナー・コンテンツ</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">参加率 {student.churnFactors.seminarParticipationRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">アクティビティタイムライン</CardTitle></CardHeader>
        <CardContent>
          <div className="relative ml-4 border-l-2 border-muted pl-6 space-y-4">
            {student.activityLogs.slice(0, 15).map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100">
                  {activityIcons[log.type]}
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">{activityLabels[log.type]}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
