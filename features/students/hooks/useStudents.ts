import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getStudents } from "../api/student.api";
import type { ChurnRiskLevel, StudentsListParams } from "@/lib/types/api";

export function useStudents(initialRiskLevel?: ChurnRiskLevel) {
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<ChurnRiskLevel | undefined>(initialRiskLevel);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const params: StudentsListParams = { search, riskLevel, sortBy, sortOrder, page, perPage: 20 };

  const query = useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRiskFilter = (level: ChurnRiskLevel | undefined) => {
    setRiskLevel(level);
    setPage(1);
  };

  return {
    students: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    page, setPage,
    search, onSearch: handleSearch,
    riskLevel, onRiskFilter: handleRiskFilter,
    sortBy, sortOrder, onSort: handleSort,
    isLoading: query.isLoading,
  };
}
