"use client";

import { useCallback, useEffect, useState } from "react";
import type { Account } from "@/lib/api/accounts";
import { listEntries, type LedgerEntry } from "@/lib/api/ledger";
import { AccountSummaryCard } from "./account-summary-card";
import { TransactionsTable } from "./transactions-table";

interface AccountDetailsProps {
  account: Account;
  onAccountChanged: () => void;
}

// Mounted fresh (via `key={account.id}` in RightPanel) each time the
// selected account changes, so `entries`/`isLoading` reset for free instead
// of being manually synchronized in an effect.
export function AccountDetails({
  account,
  onAccountChanged,
}: AccountDetailsProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await listEntries(account.id);
      setEntries(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [account.id]);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="flex h-full flex-col gap-4">
      <AccountSummaryCard
        account={account}
        onTransactionCreated={() => {
          void fetchEntries();
          onAccountChanged();
        }}
      />

      <TransactionsTable
        entries={entries}
        isLoading={isLoading}
        currency={account.currency}
        accountId={account.id}
        onEntryReversed={() => {
          void fetchEntries();
          onAccountChanged();
        }}
      />
    </div>
  );
}
