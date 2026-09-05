"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { updateUserRole, type ManagedUser } from "@/lib/api/users";

interface ChangeRoleButtonProps {
  user: ManagedUser;
  onChanged: () => void;
}

export function ChangeRoleButton({ user, onChanged }: ChangeRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextRole = user.role === "admin" ? "user" : "admin";

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    try {
      await updateUserRole(user.id, nextRole);
      setOpen(false);
      onChanged();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        {nextRole === "admin" ? "Promote to admin" : "Demote to user"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {nextRole === "admin"
              ? `Make ${user.firstName} ${user.lastName} an admin?`
              : `Remove admin access from ${user.firstName} ${user.lastName}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {error ??
              (nextRole === "admin"
                ? "They'll gain full access to manage every user and account."
                : "They'll lose admin access and go back to a regular user account.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
