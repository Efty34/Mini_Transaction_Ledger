"use client";

import { useEffect } from "react";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { useUser } from "@/contexts/user-context";
import { UserDashboardView } from "./user-dashboard-view";

export function DashboardView() {
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && !user) {
      location.href = "/";
    }
  }, [userLoading, user]);

  if (userLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return user.role === "admin" ? <AdminDashboardView /> : <UserDashboardView />;
}
