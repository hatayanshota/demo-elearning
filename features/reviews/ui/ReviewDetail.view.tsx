"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star } from "lucide-react";
import type { AssignmentWithDetails } from "@/lib/types/api";

type ReviewDetailViewProps = {
  assignment: AssignmentWithDetails | null;
  isLoading: boolean;
  feedback: string;
  rating: number | null;
  isSubmitting: boolean;
  onFeedbackChange: (value: string) => void;
  onRatingChange: (value: number | null) => void;
  onSubmit: () => void;
  onBack: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ReviewDetailView(props: ReviewDetailViewProps) {
  const { assignment, isLoading, feedback, rating, isSubmitting,
    onFeedbackChange, onRatingChange, onSubmit, onBack } = props;

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>;
  if (!assignment) return <p>課題が見つかりません</p>;

  const isReviewed = assignment.status === "REVIEWED";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-1 h-4 w-4" /> レビュー一覧に戻る
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>提出内容</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4 text-sm">
              <div><span className="text-muted-foreground">生徒:</span> {assignment.studentName}</div>
              <div><span className="text-muted-foreground">レッスン:</span> {assignment.lessonTitle}</div>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(assignment.submittedAt)}</p>
            <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">{assignment.content}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isReviewed ? "フィードバック" : "フィードバックを記入"}
              {isReviewed && <Badge variant="secondary">レビュー済み</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isReviewed && assignment.review ? (
              <>
                <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">{assignment.review.feedback}</div>
                {assignment.review.rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < assignment.review!.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{formatDate(assignment.review.reviewedAt)}</p>
              </>
            ) : (
              <>
                <Textarea
                  placeholder="フィードバックを入力してください"
                  value={feedback}
                  onChange={(e) => onFeedbackChange(e.target.value)}
                  rows={6}
                />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">評価（任意）</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onClick={() => onRatingChange(rating === i + 1 ? null : i + 1)} type="button">
                        <Star className={`h-6 w-6 ${rating && i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={onSubmit} disabled={!feedback.trim() || isSubmitting}>
                  {isSubmitting ? "送信中..." : "レビューを送信"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
