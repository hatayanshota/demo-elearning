"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/lib/stores/role-store";
import { AppSidebarView } from "./AppSidebar.view";
import { AppHeaderView } from "./AppHeader.view";
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
      <AppSidebarView role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeaderView role={role} userName={user.name} onSwitchRole={handleSwitchRole} />
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
