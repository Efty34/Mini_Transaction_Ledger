"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { UserInfoCard } from "@/components/dashboard/user-info-card";
import { useUser } from "@/contexts/user-context";
import { listUsers, type ManagedUser } from "@/lib/api/users";
import { UsersTable } from "./users-table";

export function AdminDashboardView() {
  const { user } = useUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // No setState before this first `await` — the initial `isLoading`
  // default (true) covers the mount-triggered load.
  const refreshUsers = useCallback(async () => {
    try {
      const response = await listUsers();
      setUsers(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <UserInfoCard />
        <div className="w-fit shrink-0">
          <LogoutButton />
        </div>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            isLoading={isLoading}
            currentUserId={user.id}
            onUserChanged={() => void refreshUsers()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
