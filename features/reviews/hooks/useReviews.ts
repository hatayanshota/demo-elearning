import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getReviews, getReviewStats } from "../api/review.api";

export function useReviews() {
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");

  const query = useQuery({
    queryKey: ["reviews", tab],
    queryFn: () => getReviews(tab),
  });

  const statsQuery = useQuery({
    queryKey: ["review-stats"],
    queryFn: () => getReviewStats(),
  });

  const totalCount = statsQuery.data?.total ?? 0;
  const reviewedCount = statsQuery.data?.reviewed ?? 0;
  const reviewCompletionRate = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  return {
    reviews: query.data ?? [],
    tab, setTab,
    pendingCount: tab === "pending" ? (query.data?.length ?? 0) : 0,
    totalCount,
    reviewedCount,
    reviewCompletionRate,
    isLoading: query.isLoading,
  };
}
