"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AssignmentWithDetails } from "@/lib/types/api";

type ReviewListViewProps = {
  reviews: AssignmentWithDetails[];
  tab: "pending" | "reviewed";
  isLoading: boolean;
  onTabChange: (tab: "pending" | "reviewed") => void;
  onReviewClick: (id: string) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const riskBorderColor: Record<string, string> = {
  HIGH: "border-l-red-400",
  MEDIUM: "border-l-amber-400",
  LOW: "border-l-green-400",
};

export function ReviewListView({ reviews, tab, isLoading, onTabChange, onReviewClick }: ReviewListViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">課題レビュー</h1>
        {tab === "pending" && reviews.length > 0 && (
          <Badge variant="destructive" className="rounded-full">{reviews.length}件 未レビュー</Badge>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as "pending" | "reviewed")}>
        <TabsList>
          <TabsTrigger value="pending">未レビュー</TabsTrigger>
          <TabsTrigger value="reviewed">レビュー済み</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center text-muted-foreground">
          {tab === "pending" ? "すべてのレビューが完了しています" : "レビュー済みの課題はありません"}
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card
              key={r.id}
              className={`cursor-pointer overflow-hidden border-l-3 transition-shadow hover:shadow-md ${riskBorderColor[r.status === "PENDING" ? "HIGH" : "LOW"] ?? ""}`}
              onClick={() => onReviewClick(r.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                    {r.studentName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{r.studentName}</p>
                    <Badge variant={r.status === "PENDING" ? "destructive" : "secondary"} className="text-xs">
                      {r.status === "PENDING" ? "未提出" : "レビュー済"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">課題: {r.lessonTitle}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.submittedAt)}</p>
                </div>
                {r.status === "PENDING" && (
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                    レビュー
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
