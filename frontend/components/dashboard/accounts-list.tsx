"use client";

import { cn } from "@/lib/utils";
import type { Account } from "@/lib/api/accounts";

interface AccountsListProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export function AccountsList({
  accounts,
  selectedAccountId,
  onSelect,
  isLoading,
}: AccountsListProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading accounts...</p>
    );
  }

  if (accounts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No accounts yet. Create one to get started.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {accounts.map((account) => (
        <li key={account.id}>
          <button
            type="button"
            onClick={() => onSelect(account.id)}
            className={cn(
              "flex w-full flex-col gap-0.5 rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:bg-muted",
              selectedAccountId === account.id && "border-border bg-muted",
            )}
          >
            <span className="text-sm font-medium">{account.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {account.balance.toFixed(2)} {account.currency}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
