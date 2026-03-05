"use client";

import { useRouter } from "next/navigation";
import { useReviewDetail } from "../hooks/useReviewDetail";
import { ReviewDetailView } from "./ReviewDetail.view";

type Props = { assignmentId: string };

export function ReviewDetailContainer({ assignmentId }: Props) {
  const router = useRouter();
  const hook = useReviewDetail(assignmentId);

  return (
    <ReviewDetailView
      {...hook}
      onFeedbackChange={hook.setFeedback}
      onRatingChange={hook.setRating}
      onSubmit={hook.handleSubmit}
      onBack={() => router.push("/teacher/reviews")}
    />
  );
}
