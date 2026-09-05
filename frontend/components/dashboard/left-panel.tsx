"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Account } from "@/lib/api/accounts";
import { AccountsList } from "./accounts-list";
import { CreateAccountDialog } from "./create-account-dialog";
import { LogoutButton } from "./logout-button";
import { UserInfoCard } from "./user-info-card";

interface LeftPanelProps {
  accounts: Account[];
  accountsLoading: boolean;
  selectedAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onAccountCreated: (accountId: string) => void;
}

export function LeftPanel({
  accounts,
  accountsLoading,
  selectedAccountId,
  onSelectAccount,
  onAccountCreated,
}: LeftPanelProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Your account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
        <UserInfoCard />

        <Separator />

        <CreateAccountDialog onCreated={onAccountCreated} />

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Accounts
          </p>
          <AccountsList
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelect={onSelectAccount}
            isLoading={accountsLoading}
          />
        </div>

        <Separator />

        <LogoutButton />
      </CardContent>
    </Card>
  );
}
