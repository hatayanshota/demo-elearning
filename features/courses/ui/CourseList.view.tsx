"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import type { CourseWithProgress } from "@/lib/types/api";

type CourseListViewProps = {
  courses: CourseWithProgress[];
  isLoading: boolean;
  isStudent: boolean;
  onCourseClick: (courseId: string) => void;
};

const courseImages = [
  "from-indigo-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
];

export function CourseListView({ courses, isLoading, isStudent, onCourseClick }: CourseListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">コース一覧</h1>
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">コース一覧</h1>
      {isStudent && <p className="text-sm text-muted-foreground">受講中のコース</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses.map((course, i) => (
          <Card
            key={course.id}
            className={`overflow-hidden ${isStudent ? "cursor-pointer transition-shadow hover:shadow-md" : ""}`}
            onClick={() => isStudent && onCourseClick(course.id)}
          >
            <CardContent className="p-0">
              <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${courseImages[i % courseImages.length]}`}>
                <BookOpen className="h-12 w-12 text-white/60" />
              </div>
              <div className="p-5 space-y-3">
                <Badge variant="outline" className="text-xs">{course.progressRate === 100 ? "完了" : "受講中"}</Badge>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                {isStudent && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">進捗</span>
                    <Progress value={course.progressRate} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{course.progressRate}%</span>
                  </div>
                )}
                {!isStudent && (
                  <p className="text-xs text-muted-foreground">
                    全{course.totalLessons}レッスン · {course.completedLessons}完了
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
