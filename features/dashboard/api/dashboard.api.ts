import type { KpiSummary, KpiCharts } from "@/lib/types/api";
import { getKpiSummary, getKpiCharts } from "@/lib/mock";

export async function getKpiSummaryData(): Promise<KpiSummary> {
  return getKpiSummary();
}

export async function getKpiChartsData(): Promise<KpiCharts> {
  return getKpiCharts();
}
