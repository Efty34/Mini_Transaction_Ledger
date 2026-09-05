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
import { createAccount } from "@/lib/api/accounts";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];

interface CreateAccountDialogProps {
  onCreated: (accountId: string) => void;
}

export function CreateAccountDialog({ onCreated }: CreateAccountDialogProps) {
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

    try {
      const response = await createAccount({
        name: String(formData.get("name")),
        currency: String(formData.get("currency")),
        description: description === "" ? undefined : description,
      });

      setOpen(false);
      form.reset();
      onCreated(response.data.id);
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
      <DialogTrigger render={<Button className="w-full" />}>
        Create account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Add a new ledger account to track balances and transactions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-name">Name</Label>
            <Input id="account-name" name="name" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-currency">Currency</Label>
            <NativeSelect
              id="account-currency"
              name="currency"
              defaultValue="USD"
              className="w-full"
              required
            >
              {CURRENCIES.map((currency) => (
                <NativeSelectOption key={currency} value={currency}>
                  {currency}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-description">
              Description (optional)
            </Label>
            <Input id="account-description" name="description" />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
