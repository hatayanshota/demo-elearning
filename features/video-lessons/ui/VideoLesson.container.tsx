"use client";

import { useVideoLesson } from "../hooks/useVideoLesson";
import { VideoLessonView } from "./VideoLesson.view";

type Props = { courseId: string; lessonId: string };

export function VideoLessonContainer({ courseId, lessonId }: Props) {
  const hook = useVideoLesson(courseId, lessonId);

  return (
    <VideoLessonView
      lesson={hook.lesson}
      assignment={hook.assignment}
      isLoading={hook.isLoading}
      showResume={hook.showResume}
      resumeSeconds={hook.resumeSeconds}
      assignmentContent={hook.assignmentContent}
      isSubmitting={hook.isSubmitting}
      onAssignmentChange={hook.setAssignmentContent}
      onSubmitAssignment={hook.onSubmitAssignment}
      onResumeFromPosition={() => hook.onSeek(hook.resumeSeconds)}
      onStartFromBeginning={() => hook.onSeek(0)}
      onChapterClick={hook.onSeek}
      videoRef={hook.videoRef}
      currentTime={hook.currentTime}
      onTimeUpdate={hook.onTimeUpdate}
    />
  );
}
