"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LedgerEntry } from "@/lib/api/ledger";

interface TransactionsTableProps {
  entries: LedgerEntry[];
  isLoading: boolean;
  currency: string;
}

export function TransactionsTable({
  entries,
  isLoading,
  currency,
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-sm text-muted-foreground"
              >
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
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
                    variant={entry.type === "credit" ? "default" : "secondary"}
                    className="capitalize"
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
                <TableCell className="text-right tabular-nums">
                  {entry.type === "credit" ? "+" : "-"}
                  {entry.amount.toFixed(2)} {currency}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.balanceAfter.toFixed(2)} {currency}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
