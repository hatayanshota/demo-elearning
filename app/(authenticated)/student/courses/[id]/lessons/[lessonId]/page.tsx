import { VideoLessonContainer } from "@/features/video-lessons/ui/VideoLesson.container";

export default async function VideoLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  return <VideoLessonContainer courseId={id} lessonId={lessonId} />;
}
