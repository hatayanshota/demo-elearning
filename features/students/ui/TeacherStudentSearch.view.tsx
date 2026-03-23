"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import type { StudentWithProfile } from "@/lib/types/api";

type TeacherStudentSearchViewProps = {
  students: StudentWithProfile[];
  search: string;
  onSearch: (value: string) => void;
};

export function TeacherStudentSearchView({ students, search, onSearch }: TeacherStudentSearchViewProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">会員検索</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="生徒名・メールで検索..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {students.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center text-muted-foreground">
            該当する生徒が見つかりません
          </div>
        ) : (
          students.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                    {s.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{s.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.profile.chatworkName && (
                    <span className="text-xs text-muted-foreground">CW: {s.profile.chatworkName}</span>
                  )}
                  {s.profile.isSalonMember && (
                    <Badge className="bg-emerald-100 text-emerald-700">サロン</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
