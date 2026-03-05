"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardView } from "./Dashboard.view";

export function DashboardContainer() {
  const router = useRouter();
  const { summary, charts, isLoading } = useDashboard();

  const handleHighRiskClick = () => {
    router.push("/admin/students?risk=HIGH");
  };

  return (
    <DashboardView
      summary={summary}
      charts={charts}
      isLoading={isLoading}
      onHighRiskClick={handleHighRiskClick}
    />
  );
}
