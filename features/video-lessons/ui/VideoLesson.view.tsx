"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Star } from "lucide-react";
import { type RefObject } from "react";
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
  videoRef?: RefObject<HTMLVideoElement | null>;
  currentTime?: number;
  onTimeUpdate?: () => void;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getActiveChapterIndex(chapters: { startSeconds: number }[], currentTime: number): number {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (currentTime >= chapters[i].startSeconds) return i;
  }
  return 0;
}

export function VideoLessonView(props: VideoLessonViewProps) {
  const { lesson, assignment, isLoading, showResume, resumeSeconds, assignmentContent, isSubmitting,
    onAssignmentChange, onSubmitAssignment, onResumeFromPosition, onStartFromBeginning, onChapterClick,
    videoRef, currentTime = 0, onTimeUpdate } = props;

  if (isLoading || !lesson) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Skeleton className="col-span-1 md:col-span-2 h-96" /><Skeleton className="h-96" /></div>;
  }

  const activeChapterIndex = getActiveChapterIndex(lesson.chapters, currentTime);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>コース</span>
        <span>/</span>
        <span>Webマーケティング</span>
        <span>/</span>
        <span className="font-medium text-foreground">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-4">
          {lesson.videoUrl ? (
            <video
              ref={videoRef}
              className="aspect-video w-full rounded-lg bg-slate-900"
              controls
              preload="metadata"
              onTimeUpdate={onTimeUpdate}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-900 text-white">
              <div className="text-center">
                <Play className="mx-auto h-16 w-16 opacity-50" />
                <p className="mt-2 text-sm opacity-50">動画プレイヤー</p>
                <p className="text-xs opacity-30">{formatTime(lesson.durationSeconds ?? 0)}</p>
              </div>
            </div>
          )}

          {showResume && (
            <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <span className="text-sm">📌 {formatTime(resumeSeconds)}から再開しますか？</span>
              <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white" onClick={onResumeFromPosition}>再開</Button>
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={onStartFromBeginning}>最初から</Button>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base">チャプター</CardTitle>
              {currentTime > 0 && (
                <p className="text-xs text-muted-foreground">{formatTime(currentTime)}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {lesson.chapters.map((ch, i) => {
                  const isActive = i === activeChapterIndex;
                  return (
                    <div
                      key={ch.id}
                      className={`flex items-start gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-muted/50 ${isActive ? "border-l-3 border-l-indigo-500 bg-indigo-50 font-medium" : ""}`}
                      onClick={() => onChapterClick(ch.startSeconds)}
                    >
                      <span className={`text-xs font-medium shrink-0 ${isActive ? "text-indigo-600" : "text-muted-foreground"}`}>
                        {formatTime(ch.startSeconds)}
                      </span>
                      <div className="flex-1">
                        <span className={`text-sm ${isActive ? "text-indigo-900" : ""}`}>{ch.title}</span>
                        {ch.summary && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ch.summary}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
