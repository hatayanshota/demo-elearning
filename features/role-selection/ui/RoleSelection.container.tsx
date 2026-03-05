"use client";

import { useRouter } from "next/navigation";
import { useRoleStore } from "@/lib/stores/role-store";
import { RoleSelectionView } from "./RoleSelection.view";
import type { Role } from "@/lib/types/api";

const landingPages: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  TEACHER: "/teacher/reviews",
  STUDENT: "/student/dashboard",
};

export function RoleSelectionContainer() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  const handleSelectRole = (role: Role) => {
    setRole(role);
    router.push(landingPages[role]);
  };

  return <RoleSelectionView onSelectRole={handleSelectRole} />;
}
