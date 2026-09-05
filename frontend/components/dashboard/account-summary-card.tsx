"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Account } from "@/lib/api/accounts";
import { CreateTransactionDialog } from "./create-transaction-dialog";
import { EditAccountDialog } from "./edit-account-dialog";

interface AccountSummaryCardProps {
  account: Account;
  onTransactionCreated: () => void;
  onAccountUpdated: () => void;
}

export function AccountSummaryCard({
  account,
  onTransactionCreated,
  onAccountUpdated,
}: AccountSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{account.name}</CardTitle>
        {account.description ? (
          <CardDescription>{account.description}</CardDescription>
        ) : null}
        <CardAction className="flex gap-2">
          <EditAccountDialog account={account} onUpdated={onAccountUpdated} />
          <CreateTransactionDialog
            accountId={account.id}
            onCreated={onTransactionCreated}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Total balance</p>
        <p className="text-3xl font-semibold tabular-nums">
          {account.balance.toFixed(2)}{" "}
          <span className="text-lg text-muted-foreground">
            {account.currency}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
