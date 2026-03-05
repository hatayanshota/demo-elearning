"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleCheck, Play, Lock } from "lucide-react";
import type { CourseWithProgress, SectionWithLessons, LessonWithProgress } from "@/lib/types/api";

type CurriculumViewProps = {
  course: CourseWithProgress | null;
  sections: SectionWithLessons[];
  isLoading: boolean;
  onLessonClick: (courseId: string, lessonId: string) => void;
};

function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  return `${m}分`;
}

function LessonRow({ lesson, courseId, onLessonClick }: {
  lesson: LessonWithProgress; courseId: string; onLessonClick: (c: string, l: string) => void;
}) {
  const isCompleted = lesson.progress?.isCompleted;
  const isInProgress = lesson.progress && !lesson.progress.isCompleted;

  if (lesson.isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground/50 cursor-not-allowed">
            <Lock className="h-4 w-4" />
            <span className="text-sm">{lesson.title}</span>
            <span className="ml-auto text-xs">{formatDuration(lesson.durationSeconds)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>前のレッスンを完了してください</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${isInProgress ? "bg-indigo-50 border-l-3 border-l-indigo-500" : ""}`}
      onClick={() => onLessonClick(courseId, lesson.id)}
    >
      {isCompleted ? (
        <CircleCheck className="h-5 w-5 text-green-500" />
      ) : isInProgress ? (
        <Play className="h-5 w-5 text-indigo-500" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
      )}
      <span className="text-sm font-medium">{lesson.title}</span>
      {lesson.hasAssignment && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">課題</span>}
      <span className="ml-auto text-xs text-muted-foreground">{formatDuration(lesson.durationSeconds)}</span>
    </div>
  );
}

export function CurriculumView({ course, sections, isLoading, onLessonClick }: CurriculumViewProps) {
  if (isLoading || !course) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <h1 className="text-xl font-bold">{course.title}</h1>
          {course.description && <p className="mt-1 text-sm text-white/70">{course.description}</p>}
          <div className="mt-4 flex items-center gap-3">
            <Progress value={course.progressRate} className="h-2 max-w-md bg-white/20 [&>div]:bg-white" />
            <span className="text-sm font-medium">{course.progressRate}%</span>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={sections.map(s => s.id)}>
        {sections.map((section) => {
          const completed = section.lessons.filter(l => l.progress?.isCompleted).length;
          return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <span>{section.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {completed}/{section.lessons.length} 完了
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {section.lessons.map((lesson) => (
                    <LessonRow key={lesson.id} lesson={lesson} courseId={course.id} onLessonClick={onLessonClick} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
