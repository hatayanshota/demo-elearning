"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Users, BookOpen, Calendar, MessageSquare, GraduationCap,
  LayoutDashboard, Search,
} from "lucide-react";
import type { Role } from "@/lib/types/api";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "ダッシュボード", href: "/admin/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "生徒一覧", href: "/admin/students", icon: <Users className="h-5 w-5" /> },
    { label: "コース一覧", href: "/admin/courses", icon: <BookOpen className="h-5 w-5" /> },
    { label: "セミナー一覧", href: "/admin/seminars", icon: <Calendar className="h-5 w-5" /> },
    { label: "会員検索", href: "/admin/student-search", icon: <Search className="h-5 w-5" /> },
  ],
  TEACHER: [
    { label: "レビュー一覧", href: "/teacher/reviews", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "会員検索", href: "/teacher/students", icon: <Users className="h-5 w-5" /> },
    { label: "コース一覧", href: "/teacher/courses", icon: <BookOpen className="h-5 w-5" /> },
    { label: "セミナー一覧", href: "/teacher/seminars", icon: <Calendar className="h-5 w-5" /> },
  ],
  STUDENT: [
    { label: "ダッシュボード", href: "/student/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "コース一覧", href: "/student/courses", icon: <GraduationCap className="h-5 w-5" /> },
    { label: "セミナー一覧", href: "/student/seminars", icon: <Calendar className="h-5 w-5" /> },
  ],
};

type AppSidebarViewProps = {
  role: Role;
  onNavClick?: () => void;
};

export function AppSidebarView({ role, onNavClick }: AppSidebarViewProps) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-[#1E1B4B] text-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          SchoolOS
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavClick?.()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
