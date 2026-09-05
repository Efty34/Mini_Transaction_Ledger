"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ManagedUser } from "@/lib/api/users";
import { ChangeRoleButton } from "./change-role-button";
import { DeleteUserButton } from "./delete-user-button";

interface UsersTableProps {
  users: ManagedUser[];
  isLoading: boolean;
  currentUserId: string;
  onUserChanged: () => void;
}

export function UsersTable({
  users,
  isLoading,
  currentUserId,
  onUserChanged,
}: UsersTableProps) {
  return (
    <div className="overflow-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                Loading users...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const isSelf = user.id === currentUserId;

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                    {isSelf ? (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    @{user.username}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize",
                        user.role === "admin"
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "",
                      )}
                      variant={user.role === "admin" ? undefined : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">
                        No actions on your own account
                      </span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <ChangeRoleButton
                          user={user}
                          onChanged={onUserChanged}
                        />
                        <DeleteUserButton
                          user={user}
                          onDeleted={onUserChanged}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
