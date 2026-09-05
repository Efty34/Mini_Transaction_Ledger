"use client";

import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { ApiError } from "@/lib/api-client";
import { createEntry } from "@/lib/api/ledger";

interface CreateTransactionDialogProps {
  accountId: string;
  onCreated: () => void;
}

export function CreateTransactionDialog({
  accountId,
  onCreated,
}: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const description = String(formData.get("description") ?? "").trim();
    const type = formData.get("type");

    try {
      await createEntry(accountId, {
        type: type === "debit" ? "debit" : "credit",
        amount: Number(formData.get("amount")),
        description: description === "" ? undefined : description,
      });

      setOpen(false);
      form.reset();
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add transaction</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Record a credit or debit against this account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entry-type">Type</Label>
            <NativeSelect
              id="entry-type"
              name="type"
              defaultValue="credit"
              className="w-full"
              required
            >
              <NativeSelectOption value="credit">
                Credit (money in)
              </NativeSelectOption>
              <NativeSelectOption value="debit">
                Debit (money out)
              </NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entry-amount">Amount</Label>
            <Input
              id="entry-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entry-description">Description (optional)</Label>
            <Input id="entry-description" name="description" />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
