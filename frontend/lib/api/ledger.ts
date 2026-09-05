import { apiGet, apiPatch, apiPost } from "@/lib/api-client";

export type EntryType = "credit" | "debit";

export interface LedgerEntry {
  id: string;
  accountId: string;
  type: EntryType;
  amount: number;
  balanceAfter: number;
  description: string | null;
  reversalOfId: string | null;
  isReversed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LedgerEntryResponse {
  message: string;
  data: LedgerEntry;
}

interface LedgerEntriesListResponse {
  message: string;
  data: LedgerEntry[];
}

export interface CreateLedgerEntryPayload {
  type: EntryType;
  amount: number;
  description?: string;
}

export function listEntries(
  accountId: string,
): Promise<LedgerEntriesListResponse> {
  return apiGet<LedgerEntriesListResponse>(`/accounts/${accountId}/entries`);
}

export function createEntry(
  accountId: string,
  payload: CreateLedgerEntryPayload,
): Promise<LedgerEntryResponse> {
  return apiPost<LedgerEntryResponse>(
    `/accounts/${accountId}/entries`,
    payload,
  );
}

export function updateEntryDescription(
  accountId: string,
  entryId: string,
  description: string,
): Promise<LedgerEntryResponse> {
  return apiPatch<LedgerEntryResponse>(
    `/accounts/${accountId}/entries/${entryId}`,
    { description },
  );
}

export function reverseEntry(
  accountId: string,
  entryId: string,
): Promise<LedgerEntryResponse> {
  return apiPost<LedgerEntryResponse>(
    `/accounts/${accountId}/entries/${entryId}/reverse`,
  );
}
