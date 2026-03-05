import { ReviewDetailContainer } from "@/features/reviews/ui/ReviewDetail.container";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDetailContainer assignmentId={id} />;
}
