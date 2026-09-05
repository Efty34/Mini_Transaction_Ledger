"use client";

import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/user-context";

export function UserInfoCard() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
        <Badge variant="secondary" className="capitalize">
          {user.role}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">@{user.username}</p>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  );
}
