"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Role } from "@/lib/types/api";

const roleLabels: Record<Role, string> = {
  ADMIN: "管理者",
  TEACHER: "講師",
  STUDENT: "生徒",
};

type AppHeaderViewProps = {
  role: Role;
  userName: string;
  onSwitchRole: (role: Role) => void;
};

export function AppHeaderView({ role, userName, onSwitchRole }: AppHeaderViewProps) {
  const otherRoles = (["ADMIN", "TEACHER", "STUDENT"] as Role[]).filter(r => r !== role);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {roleLabels[role]}: {userName}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              ロール切替 <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {otherRoles.map((r) => (
              <DropdownMenuItem key={r} onClick={() => onSwitchRole(r)}>
                {roleLabels[r]}に切替
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
