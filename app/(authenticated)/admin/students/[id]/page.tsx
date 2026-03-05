import { StudentDetailContainer } from "@/features/students/ui/StudentDetail.container";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentDetailContainer studentId={id} />;
}
