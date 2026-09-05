"use client";

import type { Account } from "@/lib/api/accounts";
import { AccountDetails } from "./account-details";

interface RightPanelProps {
  account: Account | null;
  onAccountChanged: () => void;
}

export function RightPanel({ account, onAccountChanged }: RightPanelProps) {
  if (!account) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Select or create an account to see its details.
      </div>
    );
  }

  return (
    <AccountDetails
      key={account.id}
      account={account}
      onAccountChanged={onAccountChanged}
    />
  );
}
