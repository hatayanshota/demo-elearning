import { AppLayoutContainer } from "@/features/layout/ui/AppLayout.container";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutContainer>{children}</AppLayoutContainer>;
}
