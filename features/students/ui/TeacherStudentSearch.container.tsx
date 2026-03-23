"use client";

import { useState } from "react";
import { mockUsers, mockStudentProfiles } from "@/lib/mock";
import { TeacherStudentSearchView } from "./TeacherStudentSearch.view";
import type { StudentWithProfile } from "@/lib/types/api";

export function TeacherStudentSearchContainer() {
  const [search, setSearch] = useState("");

  const students: StudentWithProfile[] = mockUsers
    .filter((u) => u.role === "STUDENT")
    .map((u) => {
      const profile = mockStudentProfiles.find((p) => p.userId === u.id);
      return { ...u, profile: profile!, progressRate: 0 };
    })
    .filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    });

  return (
    <TeacherStudentSearchView
      students={students}
      search={search}
      onSearch={setSearch}
    />
  );
}
