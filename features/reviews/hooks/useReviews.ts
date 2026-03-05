import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getReviews } from "../api/review.api";

export function useReviews() {
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");

  const query = useQuery({
    queryKey: ["reviews", tab],
    queryFn: () => getReviews(tab),
  });

  return {
    reviews: query.data ?? [],
    tab, setTab,
    pendingCount: tab === "pending" ? (query.data?.length ?? 0) : 0,
    isLoading: query.isLoading,
  };
}
