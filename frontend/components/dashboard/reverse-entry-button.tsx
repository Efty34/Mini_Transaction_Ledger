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
import { reverseEntry } from "@/lib/api/ledger";

interface ReverseEntryButtonProps {
  accountId: string;
  entryId: string;
  onReversed: () => void;
}

export function ReverseEntryButton({
  accountId,
  entryId,
  onReversed,
}: ReverseEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    try {
      await reverseEntry(accountId, entryId);
      setOpen(false);
      onReversed();
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
        Reverse
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reverse this transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            {error ??
              "This posts a new offsetting entry for the same amount. The original entry stays in the table, marked as reversed — it can't be edited or deleted."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Reversing..." : "Reverse"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
