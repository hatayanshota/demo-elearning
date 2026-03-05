import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useRoleStore } from "@/lib/stores/role-store";
import { getLessonDetail, updateLessonProgress, completeLessonProgress, createAssignment } from "../api/lesson.api";
import { toast } from "sonner";

export function useVideoLesson(courseId: string, lessonId: string) {
  const queryClient = useQueryClient();
  const user = useRoleStore((s) => s.user);
  const [assignmentContent, setAssignmentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const query = useQuery({
    queryKey: ["lesson", lessonId, user.id],
    queryFn: () => getLessonDetail(lessonId, user.id),
  });

  const lesson = query.data?.lesson ?? null;
  const assignment = query.data?.assignment ?? null;

  const showResume = !!(lesson?.progress && lesson.progress.watchedSeconds > 0 && !lesson.progress.isCompleted);

  const handleProgressUpdate = useCallback(async (seconds: number) => {
    await updateLessonProgress(lessonId, user.id, seconds);
  }, [lessonId, user.id]);

  const handleComplete = useCallback(async () => {
    await completeLessonProgress(lessonId, user.id);
    queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
  }, [lessonId, user.id, queryClient]);

  const handleSubmitAssignment = async () => {
    if (!assignmentContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createAssignment(lessonId, user.id, assignmentContent);
      toast.success("課題を提出しました。講師のレビューをお待ちください");
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      setAssignmentContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    lesson, assignment, isLoading: query.isLoading,
    showResume, resumeSeconds: lesson?.progress?.watchedSeconds ?? 0,
    assignmentContent, setAssignmentContent,
    isSubmitting,
    onProgressUpdate: handleProgressUpdate,
    onComplete: handleComplete,
    onSubmitAssignment: handleSubmitAssignment,
    courseId,
  };
}
