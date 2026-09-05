"use client";

import { useCallback, useEffect, useState } from "react";
import { listAccounts, type Account } from "@/lib/api/accounts";
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";

export function UserDashboardView() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  // No setState before this first `await` — the initial `accountsLoading`
  // default (true) covers the mount-triggered load.
  const refreshAccounts = useCallback(async () => {
    try {
      const response = await listAccounts();
      setAccounts(response.data);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  function handleAccountCreated(accountId: string) {
    void refreshAccounts();
    setSelectedAccountId(accountId);
  }

  // Falls back to the first account when nothing has been explicitly
  // selected yet — computed at render time instead of synced via an effect.
  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ??
    accounts[0] ??
    null;

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-[320px_1fr]">
      <LeftPanel
        accounts={accounts}
        accountsLoading={accountsLoading}
        selectedAccountId={selectedAccount?.id ?? null}
        onSelectAccount={setSelectedAccountId}
        onAccountCreated={handleAccountCreated}
      />
      <RightPanel account={selectedAccount} onAccountChanged={refreshAccounts} />
    </div>
  );
}
