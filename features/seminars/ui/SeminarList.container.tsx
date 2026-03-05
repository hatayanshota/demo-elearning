"use client";

import { useSeminars } from "../hooks/useSeminars";
import { SeminarListView } from "./SeminarList.view";

export function SeminarListContainer() {
  const hook = useSeminars();

  return (
    <SeminarListView
      seminars={hook.seminars} tab={hook.tab} isLoading={hook.isLoading} role={hook.role}
      onTabChange={hook.setTab} onRegister={hook.onRegister} onCancel={hook.onCancel}
    />
  );
}
