"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Role } from "@/lib/types/api";

type RoleCard = {
  role: Role;
  label: string;
  buttonLabel: string;
  descriptions: string[];
  image: string;
  buttonColor: string;
};

const roleCards: RoleCard[] = [
  {
    role: "ADMIN",
    label: "Admin",
    buttonLabel: "Adminで体験",
    descriptions: ["KPIダッシュボード", "生徒管理・分析"],
    image: "/images/role-admin.png",
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
  },
  {
    role: "TEACHER",
    label: "Teacher",
    buttonLabel: "Teacherで体験",
    descriptions: ["課題レビュー", "フィードバック管理"],
    image: "/images/role-teacher.png",
    buttonColor: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    role: "STUDENT",
    label: "Student",
    buttonLabel: "Studentで体験",
    descriptions: ["動画学習・課題提出", "セミナー参加"],
    image: "/images/role-student.png",
    buttonColor: "bg-violet-500 hover:bg-violet-600",
  },
];

type RoleSelectionViewProps = {
  onSelectRole: (role: Role) => void;
};

export function RoleSelectionView({ onSelectRole }: RoleSelectionViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#6366F1] px-4">
      <div className="mb-10 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">SchoolOS</h1>
        </div>
        <p className="text-sm text-white/70">3つのロールでSchoolOSの全機能を体験できます</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {roleCards.map((card) => (
          <Card
            key={card.role}
            className="overflow-hidden border-0 shadow-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]"
          >
            <CardContent className="flex flex-col items-center p-6 pt-8 text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={card.image}
                  alt={card.label}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold">{card.label}</h2>
              <div className="mt-2 space-y-0.5">
                {card.descriptions.map((d) => (
                  <p key={d} className="text-xs text-muted-foreground">{d}</p>
                ))}
              </div>
              <Button
                className={`mt-5 w-full text-white ${card.buttonColor}`}
                size="sm"
                onClick={() => onSelectRole(card.role)}
              >
                {card.buttonLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
