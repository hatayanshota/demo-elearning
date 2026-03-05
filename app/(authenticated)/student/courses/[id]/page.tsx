import { CurriculumContainer } from "@/features/curriculum/ui/Curriculum.container";

export default async function CurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CurriculumContainer courseId={id} />;
}
