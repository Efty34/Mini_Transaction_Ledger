"use client";

import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/user-context";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UserInfoCard() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {getInitials(user.firstName, user.lastName)}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium leading-none">
            {user.firstName} {user.lastName}
          </p>
          <Badge variant="secondary" className="shrink-0 capitalize">
            {user.role}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user.email}
        </p>
      </div>
    </div>
  );
}
