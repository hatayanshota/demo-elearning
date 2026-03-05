import { useQuery } from "@tanstack/react-query";
import { getKpiSummaryData, getKpiChartsData } from "../api/dashboard.api";

export function useDashboard() {
  const summaryQuery = useQuery({
    queryKey: ["kpi-summary"],
    queryFn: getKpiSummaryData,
  });

  const chartsQuery = useQuery({
    queryKey: ["kpi-charts"],
    queryFn: getKpiChartsData,
  });

  return {
    summary: summaryQuery.data,
    charts: chartsQuery.data,
    isLoading: summaryQuery.isLoading || chartsQuery.isLoading,
  };
}
