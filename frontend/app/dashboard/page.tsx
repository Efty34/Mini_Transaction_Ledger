import { DashboardView } from "@/components/dashboard/dashboard-view";
import { UserProvider } from "@/contexts/user-context";

export default function DashboardPage() {
  return (
    <UserProvider>
      <DashboardView />
    </UserProvider>
  );
}
