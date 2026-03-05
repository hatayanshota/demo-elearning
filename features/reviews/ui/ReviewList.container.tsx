"use client";

import { useRouter } from "next/navigation";
import { useReviews } from "../hooks/useReviews";
import { ReviewListView } from "./ReviewList.view";

export function ReviewListContainer() {
  const router = useRouter();
  const { reviews, tab, setTab, isLoading } = useReviews();

  return (
    <ReviewListView
      reviews={reviews} tab={tab} isLoading={isLoading}
      onTabChange={setTab}
      onReviewClick={(id) => router.push(`/teacher/reviews/${id}`)}
    />
  );
}
