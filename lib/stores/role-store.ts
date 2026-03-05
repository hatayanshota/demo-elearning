import { create } from "zustand";
import type { Role, User } from "@/lib/types/api";
import { mockAdminUser, mockTeacherUser, mockStudentUser } from "@/lib/mock";

type RoleState = {
  role: Role;
  user: User;
  setRole: (role: Role) => void;
};

const usersByRole: Record<Role, User> = {
  ADMIN: mockAdminUser,
  TEACHER: mockTeacherUser,
  STUDENT: mockStudentUser,
};

export const useRoleStore = create<RoleState>((set) => ({
  role: "ADMIN",
  user: mockAdminUser,
  setRole: (role) => set({ role, user: usersByRole[role] }),
}));
