"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Monitor, Users } from "lucide-react";
import type { SeminarWithRegistration, Role, AttendanceType } from "@/lib/types/api";

type SeminarListViewProps = {
  seminars: SeminarWithRegistration[];
  tab: "upcoming" | "past";
  isLoading: boolean;
  role: Role;
  onTabChange: (tab: "upcoming" | "past") => void;
  onRegister: (seminarId: string, type: AttendanceType) => void;
  onCancel: (seminarId: string) => void;
};

function formatDateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("ja-JP", { month: "short" }),
    time: d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
  };
}

function DateCircle({ day }: { day: number }) {
  return (
    <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
      <span className="text-xl font-bold leading-none">{day}</span>
    </div>
  );
}

export function SeminarListView(props: SeminarListViewProps) {
  const { seminars, tab, isLoading, role, onTabChange, onRegister, onCancel } = props;

  const upcoming = seminars.filter(s => new Date(s.date) >= new Date("2026-03-05"));
  const past = seminars.filter(s => new Date(s.date) < new Date("2026-03-05"));
  const displaySeminars = tab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">セミナー</h1>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">参加予定のセミナー</h2>
              {upcoming.map((seminar) => {
                const dp = formatDateParts(seminar.date);
                return (
                  <Card key={seminar.id} className="overflow-hidden border-indigo-100 bg-indigo-50/30">
                    <CardContent className="flex items-center gap-4 p-5">
                      <DateCircle day={dp.day} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{seminar.title}</h3>
                        <p className="text-sm text-muted-foreground">{dp.time} · {seminar.description}</p>
                        {seminar.location && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{seminar.location}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {role === "ADMIN" && (
                          <div className="flex gap-3 text-sm">
                            <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" />{seminar.onlineCount}名</span>
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{seminar.onsiteCount}名</span>
                          </div>
                        )}
                        {role === "STUDENT" && (
                          seminar.registration ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {seminar.registration.attendanceType === "ONLINE" ? "オンライン" : "現地"}申込済
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => onCancel(seminar.id)}>
                                キャンセル
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => onRegister(seminar.id, "ONLINE")}>
                                オンライン
                              </Button>
                              {seminar.location && (
                                <Button size="sm" variant="outline" onClick={() => onRegister(seminar.id, "ONSITE")}>
                                  現地参加
                                </Button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">過去のセミナー</h2>
              {past.map((seminar) => {
                const dp = formatDateParts(seminar.date);
                return (
                  <Card key={seminar.id}>
                    <CardContent className="flex items-center gap-4 p-5">
                      <DateCircle day={dp.day} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{seminar.title}</h3>
                        <p className="text-sm text-muted-foreground">{dp.time}</p>
                        {seminar.location && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{seminar.location}</p>
                        )}
                      </div>
                      {role === "ADMIN" && (
                        <Badge variant="outline">
                          {seminar.onlineCount + seminar.onsiteCount}名参加
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {displaySeminars.length === 0 && (
            <div className="rounded-lg border bg-white p-12 text-center text-muted-foreground">
              セミナーはありません
            </div>
          )}
        </>
      )}
    </div>
  );
}
