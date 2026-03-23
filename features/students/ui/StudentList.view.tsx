"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { StudentWithProfile, ChurnRiskLevel } from "@/lib/types/api";

const riskBadgeVariant: Record<ChurnRiskLevel, "default" | "secondary" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
};
const riskLabel: Record<ChurnRiskLevel, string> = { LOW: "低", MEDIUM: "中", HIGH: "高" };

const riskRowBorder: Record<ChurnRiskLevel, string> = {
  LOW: "border-l-green-400",
  MEDIUM: "border-l-amber-400",
  HIGH: "border-l-red-400",
};

const riskFilterColors: Record<string, string> = {
  all: "",
  HIGH: "bg-red-500 text-white hover:bg-red-600",
  MEDIUM: "bg-amber-500 text-white hover:bg-amber-600",
  LOW: "bg-green-500 text-white hover:bg-green-600",
};

type StudentListViewProps = {
  students: StudentWithProfile[];
  isLoading: boolean;
  search: string;
  riskLevel: ChurnRiskLevel | undefined;
  page: number;
  totalPages: number;
  total: number;
  sortBy: string | undefined;
  sortOrder: "asc" | "desc";
  onSearch: (value: string) => void;
  onRiskFilter: (level: ChurnRiskLevel | undefined) => void;
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  onStudentClick: (id: string) => void;
};

function SortableHeader({ label, column, sortBy, sortOrder, onSort }: {
  label: string; column: string; sortBy: string | undefined; sortOrder: "asc"|"desc"; onSort: (c: string) => void;
}) {
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(column)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3.5 w-3.5 ${sortBy === column ? "text-foreground" : "text-muted-foreground/50"}`} />
      </div>
    </TableHead>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ja-JP");
}

export function StudentListView(props: StudentListViewProps) {
  const { students, isLoading, search, riskLevel, page, totalPages, total, sortBy, sortOrder,
    onSearch, onRiskFilter, onSort, onPageChange, onStudentClick } = props;

  const riskFilters: { key: ChurnRiskLevel | undefined; label: string }[] = [
    { key: undefined, label: "全て" },
    { key: "HIGH", label: "リスク高" },
    { key: "MEDIUM", label: "リスク中" },
    { key: "LOW", label: "リスク低" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">生徒一覧</h1>
        <div className="flex gap-2">
          {riskFilters.map((f) => (
            <Button
              key={f.key ?? "all"}
              variant={riskLevel === f.key ? "default" : "outline"}
              size="sm"
              className={riskLevel === f.key ? riskFilterColors[f.key ?? "all"] : ""}
              onClick={() => onRiskFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="生徒名で検索..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="ml-auto text-sm text-muted-foreground">ステータス ▾</span>
      </div>

      <p className="text-xs text-muted-foreground">
        今月の入会者を重点確認スコアが61以上のデインジケーターを表示
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <div className="rounded-md border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader label="名前" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead>メール</TableHead>
                <SortableHeader label="入会日" column="enrolledAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <SortableHeader label="進捗率" column="progressRate" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <SortableHeader label="チャーンリスク" column="churnRiskScore" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <SortableHeader label="最終ログイン" column="lastLoginAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead>サロン</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s.id}
                  className={`cursor-pointer border-l-3 transition-colors duration-150 hover:bg-muted/50 ${riskRowBorder[s.profile.churnRiskLevel]} ${s.profile.churnRiskLevel === "HIGH" ? "bg-red-50/50" : s.profile.churnRiskLevel === "MEDIUM" ? "bg-amber-50/30" : ""}`}
                  onClick={() => onStudentClick(s.id)}
                >
                  <TableCell>
                    <div className="font-medium">{s.name}</div>
                    {s.profile.chatworkName && (
                      <div className="text-xs text-muted-foreground">{s.profile.chatworkName}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell>{formatDate(s.profile.enrolledAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.progressRate} className="h-2 w-20" />
                      <span className="text-sm">{s.progressRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskBadgeVariant[s.profile.churnRiskLevel]}>
                      {riskLabel[s.profile.churnRiskLevel]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(s.profile.lastLoginAt)}</TableCell>
                  <TableCell>
                    {s.profile.isSalonMember ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">サロン</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="mr-2 text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
