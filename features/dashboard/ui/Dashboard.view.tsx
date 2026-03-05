"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import type { KpiSummary, KpiCharts } from "@/lib/types/api";
import { KpiCardView } from "./KpiCard.view";

const COLORS = ["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444", "#14B8A6"];

type DashboardViewProps = {
  summary: KpiSummary | undefined;
  charts: KpiCharts | undefined;
  isLoading: boolean;
  onHighRiskClick: () => void;
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">{children}</CardContent>
    </Card>
  );
}

export function DashboardView({ summary, charts, isLoading, onHighRiskClick }: DashboardViewProps) {
  if (isLoading || !summary || !charts) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: "総生徒数", value: summary.totalStudents, suffix: "名", trend: "up" as const, bgColor: "#6366F1", labelColor: "#C7D2FE" },
    { label: "今月入会数", value: summary.newEnrollmentCount, suffix: "名", trend: "up" as const, bgColor: "#0EA5E9", labelColor: "#BAE6FD" },
    { label: "アクティブ率", value: summary.activeRate, suffix: "%", trend: "up" as const, bgColor: "#10B981", labelColor: "#A7F3D0" },
    { label: "平均課題達成", value: summary.averageCompletionDays, suffix: "日", bgColor: "#F59E0B", labelColor: "#FEF3C7" },
    { label: "課題完了率", value: summary.assignmentCompletionRate, suffix: "%", bgColor: "#8B5CF6", labelColor: "#DDD6FE" },
    { label: "セミナー参加率", value: summary.seminarParticipationRate, suffix: "%", bgColor: "#EC4899", labelColor: "#FBCFE8" },
    { label: "チャーンリスク高", value: summary.highChurnRiskCount, suffix: "名", isClickable: true, onClick: onHighRiskClick, bgColor: "#EF4444", labelColor: "#FECACA" },
    { label: "3ヶ月以内達成", value: summary.recentCompletionCount, suffix: "名", bgColor: "#14B8A6", labelColor: "#99F6E4" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">KPI ダッシュボード</h1>

      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCardView key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="年齢分布チャート">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="性別デモグラフィクス">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={charts.genderDistribution} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {charts.genderDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="コホート分析">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.occupationDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="label" type="category" fontSize={12} width={80} />
              <ReTooltip />
              <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="アクティブ状況">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.activeTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip />
              <Line type="monotone" dataKey="count" stroke="#14B8A6" name="アクティブ" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="col-span-2 grid grid-cols-2 gap-0 overflow-hidden">
          <div className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">セミナー参加</p>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.seminarTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ReTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="online" stroke="#6366F1" name="オンライン" strokeWidth={2} />
                  <Line type="monotone" dataKey="onsite" stroke="#F59E0B" name="現地" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border-l p-5">
            <p className="text-sm font-semibold text-muted-foreground">成績詳細レポート</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">平均完了率</span>
                <span className="font-semibold">{summary.assignmentCompletionRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">セミナー参加率</span>
                <span className="font-semibold">{summary.seminarParticipationRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">平均完了日数</span>
                <span className="font-semibold">{summary.averageCompletionDays}日</span>
              </div>
            </div>
          </div>
        </Card>

        <ChartCard title="アクティブユーザー分析">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.regionDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="課題停滞箇所">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.assignmentBottleneck}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis fontSize={12} />
              <ReTooltip />
              <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
