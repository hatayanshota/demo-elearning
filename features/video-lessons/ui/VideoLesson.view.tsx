"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Play, Star } from "lucide-react";
import { useState } from "react";
import type { LessonWithProgress, Assignment, Review } from "@/lib/types/api";

type VideoLessonViewProps = {
  lesson: LessonWithProgress | null;
  assignment: (Assignment & { review: Review | null }) | null;
  isLoading: boolean;
  showResume: boolean;
  resumeSeconds: number;
  assignmentContent: string;
  isSubmitting: boolean;
  onAssignmentChange: (value: string) => void;
  onSubmitAssignment: () => void;
  onResumeFromPosition: () => void;
  onStartFromBeginning: () => void;
  onChapterClick: (seconds: number) => void;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoLessonView(props: VideoLessonViewProps) {
  const { lesson, assignment, isLoading, showResume, resumeSeconds, assignmentContent, isSubmitting,
    onAssignmentChange, onSubmitAssignment, onResumeFromPosition, onStartFromBeginning, onChapterClick } = props;

  const [isResumeOpen, setIsResumeOpen] = useState(showResume);

  if (isLoading || !lesson) {
    return <div className="grid grid-cols-3 gap-6"><Skeleton className="col-span-2 h-96" /><Skeleton className="h-96" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>コース</span>
        <span>/</span>
        <span>Webマーケティング</span>
        <span>/</span>
        <span className="font-medium text-foreground">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-900 text-white">
            <div className="text-center">
              <Play className="mx-auto h-16 w-16 opacity-50" />
              <p className="mt-2 text-sm opacity-50">動画プレイヤー</p>
              <p className="text-xs opacity-30">{formatTime(lesson.durationSeconds ?? 0)}</p>
            </div>
          </div>

          {showResume && (
            <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <span className="text-sm">📌 {formatTime(resumeSeconds)}から再開しますか？</span>
              <Button size="sm" onClick={onResumeFromPosition}>再開</Button>
            </div>
          )}

          {lesson.hasAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">課題 · {lesson.assignmentDescription}</CardTitle>
                <p className="text-sm text-muted-foreground">字数制限</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment ? (
                  <div className="space-y-3">
                    <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">{assignment.content}</div>
                    <Badge variant={assignment.status === "REVIEWED" ? "secondary" : "default"}>
                      {assignment.status === "REVIEWED" ? "レビュー済み" : "レビュー待ち"}
                    </Badge>
                    {assignment.review && (
                      <div className="space-y-2 rounded-md border p-4">
                        <p className="text-sm font-medium">講師からのフィードバック</p>
                        <p className="text-sm">{assignment.review.feedback}</p>
                        {assignment.review.rating && (
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < assignment.review!.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="課題の回答を入力してください。"
                      value={assignmentContent}
                      onChange={(e) => onAssignmentChange(e.target.value)}
                      rows={6}
                    />
                    <div className="flex justify-end">
                      <Button onClick={onSubmitAssignment} disabled={!assignmentContent.trim() || isSubmitting}>
                        {isSubmitting ? "送信中..." : "提出する"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">チャプター</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {lesson.chapters.map((ch, i) => (
                  <div
                    key={ch.id}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-muted/50 ${i === 0 ? "border-l-3 border-l-indigo-500 bg-indigo-50" : ""}`}
                    onClick={() => onChapterClick(ch.startSeconds)}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{formatTime(ch.startSeconds)}</span>
                    <span className="text-sm">{ch.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isResumeOpen} onOpenChange={setIsResumeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>視聴を再開しますか？</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            前回 {formatTime(resumeSeconds)} まで視聴しました。続きから再生しますか？
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsResumeOpen(false); onStartFromBeginning(); }}>
              最初から
            </Button>
            <Button onClick={() => { setIsResumeOpen(false); onResumeFromPosition(); }}>
              続きから
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
