"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, MapPin, Monitor, Users } from "lucide-react";
import type { SeminarWithRegistration, Role, AttendanceType } from "@/lib/types/api";
import type { SeminarAttendee } from "../hooks/useSeminars";

type SeminarListViewProps = {
  seminars: SeminarWithRegistration[];
  tab: "upcoming" | "past";
  isLoading: boolean;
  role: Role;
  onTabChange: (tab: "upcoming" | "past") => void;
  isSalonMember?: boolean;
  attendeesBySeminar?: Record<string, SeminarAttendee[]>;
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
  const { seminars, tab, isLoading, role, isSalonMember, attendeesBySeminar, onTabChange, onRegister, onCancel } = props;

  const upcoming = seminars.filter(s => new Date(s.date) >= new Date("2026-03-05"));
  const past = seminars.filter(s => new Date(s.date) < new Date("2026-03-05"));
  const displaySeminars = tab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">セミナー</h1>

      {role === "STUDENT" && isSalonMember && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">サロン会員限定</p>
              <p className="text-xs text-amber-600">サロン専用コンテンツはこちらからアクセスできます</p>
            </div>
            <a href="https://salon.example.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                サロンサイトへ
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

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
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <DateCircle day={dp.day} />
                        <div className="flex-1 sm:hidden">
                          <h3 className="font-semibold text-sm">{seminar.title}</h3>
                          <p className="text-xs text-muted-foreground">{dp.time}</p>
                        </div>
                      </div>
                      <div className="hidden sm:block flex-1">
                        <h3 className="font-semibold">{seminar.title}</h3>
                        <p className="text-sm text-muted-foreground">{dp.time} · {seminar.description}</p>
                        {seminar.location && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{seminar.location}</p>
                        )}
                      </div>
                      <div className="sm:hidden text-xs text-muted-foreground">
                        <p>{seminar.description}</p>
                        {seminar.location && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 mt-1 text-indigo-500">
                                <MapPin className="h-3 w-3" />{seminar.location}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{seminar.location}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        {role === "ADMIN" && (
                          <div className="flex gap-3 text-sm">
                            <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" />{seminar.onlineCount}名</span>
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{seminar.onsiteCount}名</span>
                          </div>
                        )}
                        {(role === "TEACHER" || role === "ADMIN") && attendeesBySeminar?.[seminar.id] && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Users className="mr-1 h-3.5 w-3.5" />
                                参加者一覧
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{seminar.title} - 参加者一覧</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {attendeesBySeminar[seminar.id].map((attendee, idx) => (
                                  <div key={idx} className="flex items-center gap-3 rounded-md border p-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">{attendee.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm flex-1">{attendee.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {attendee.attendanceType === "ONLINE" ? "オンライン" : "現地"}
                                    </Badge>
                                  </div>
                                ))}
                                {attendeesBySeminar[seminar.id].length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center py-4">参加者はいません</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <DateCircle day={dp.day} />
                        <div className="flex-1 sm:hidden">
                          <h3 className="font-semibold text-sm">{seminar.title}</h3>
                          <p className="text-xs text-muted-foreground">{dp.time}</p>
                          {seminar.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />{seminar.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block flex-1">
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
                      {(role === "TEACHER" || role === "ADMIN") && attendeesBySeminar?.[seminar.id] && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Users className="mr-1 h-3.5 w-3.5" />
                              参加者一覧
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{seminar.title} - 参加者一覧</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {attendeesBySeminar[seminar.id].map((attendee, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-md border p-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">{attendee.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm flex-1">{attendee.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {attendee.attendanceType === "ONLINE" ? "オンライン" : "現地"}
                                  </Badge>
                                </div>
                              ))}
                              {attendeesBySeminar[seminar.id].length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">参加者はいません</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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
