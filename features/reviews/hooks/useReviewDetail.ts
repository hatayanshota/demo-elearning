import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getReviewDetail, createReview } from "../api/review.api";
import { useRoleStore } from "@/lib/stores/role-store";
import { toast } from "sonner";

export function useReviewDetail(assignmentId: string) {
  const queryClient = useQueryClient();
  const user = useRoleStore((s) => s.user);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const query = useQuery({
    queryKey: ["review", assignmentId],
    queryFn: () => getReviewDetail(assignmentId),
  });

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview(assignmentId, user.id, feedback, rating);
      toast.success("レビューを送信しました");
      queryClient.invalidateQueries({ queryKey: ["review", assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    assignment: query.data ?? null,
    isLoading: query.isLoading,
    feedback, setFeedback,
    rating, setRating,
    isSubmitting,
    handleSubmit,
  };
}
