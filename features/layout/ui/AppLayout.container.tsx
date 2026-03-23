"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/lib/stores/role-store";
import { AppSidebarView } from "./AppSidebar.view";
import { AppHeaderView } from "./AppHeader.view";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Role } from "@/lib/types/api";

const landingPages: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  TEACHER: "/teacher/reviews",
  STUDENT: "/student/dashboard",
};

export function AppLayoutContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, user, setRole } = useRoleStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSwitchRole = (newRole: Role) => {
    setRole(newRole);
    router.push(landingPages[newRole]);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AppSidebarView role={role} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeaderView role={role} userName={user.name} onSwitchRole={handleSwitchRole} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </div>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0 bg-[#1E1B4B]" showCloseButton={false}>
          <SheetTitle className="sr-only">ナビゲーション</SheetTitle>
          <AppSidebarView role={role} onNavClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
