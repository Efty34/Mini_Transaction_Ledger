"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LedgerEntry } from "@/lib/api/ledger";
import { EditEntryDescriptionDialog } from "./edit-entry-description-dialog";
import { ReverseEntryButton } from "./reverse-entry-button";

interface TransactionsTableProps {
  entries: LedgerEntry[];
  isLoading: boolean;
  currency: string;
  accountId: string;
  onEntryReversed: () => void;
  onEntryUpdated: () => void;
}

export function TransactionsTable({
  entries,
  isLoading,
  currency,
  accountId,
  onEntryReversed,
  onEntryUpdated,
}: TransactionsTableProps) {
  return (
    <div className="flex-1 overflow-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance after</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                No transactions yet.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      entry.type === "credit"
                        ? "border-transparent bg-green-600 text-white dark:bg-green-500"
                        : "border-transparent bg-red-600 text-white dark:bg-red-500",
                    )}
                  >
                    {entry.type}
                  </Badge>
                  {entry.isReversed ? (
                    <Badge variant="outline" className="ml-1">
                      Reversed
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-sm">
                  {entry.description ?? "—"}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right tabular-nums",
                    entry.type === "credit"
                      ? "text-green-600 dark:text-green-500"
                      : "text-red-600 dark:text-red-500",
                  )}
                >
                  {entry.type === "credit" ? "+" : "-"}
                  {entry.amount.toFixed(2)} {currency}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.balanceAfter.toFixed(2)} {currency}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <EditEntryDescriptionDialog
                      accountId={accountId}
                      entryId={entry.id}
                      currentDescription={entry.description}
                      onUpdated={onEntryUpdated}
                    />
                    {entry.isReversed ? (
                      <span className="self-center text-xs text-muted-foreground">
                        Reversed
                      </span>
                    ) : (
                      <ReverseEntryButton
                        accountId={accountId}
                        entryId={entry.id}
                        onReversed={onEntryReversed}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
