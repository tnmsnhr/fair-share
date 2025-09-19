// src/state/utils/split.ts
import type { EqualSplitInput, ID, TransactionEntry } from "../types";
import { uid } from "./id";

/**
 * Expand a single expense into multiple per-person ledger entries
 * RELATIVE TO `currentUserId`.
 *
 * - If current user paid and others participated => positive entries (they owe me)
 * - If someone else paid and I participated   => one negative entry (I owe them)
 * - We DO NOT create entries for pairs that don't involve me (keeps list relevant).
 */
export function expandEqualSplitForUser(
  input: EqualSplitInput,
  currentUserId: ID
): TransactionEntry[] {
  const {
    total,
    payerId,
    participantIds,
    includePayerInSplit = true,
    note,
    category,
    groupId,
    createdAt = new Date().toISOString(),
  } = input;

  const unique = Array.from(new Set(participantIds));
  const participantsCount =
    unique.length + (includePayerInSplit && !unique.includes(payerId) ? 1 : 0);

  if (participantsCount <= 0) return [];

  const share = total / participantsCount;
  const batchId = uid();
  const entries: TransactionEntry[] = [];

  const everyone = includePayerInSplit
    ? Array.from(new Set([...unique, payerId]))
    : unique;

  const iAmPayer = payerId === currentUserId;
  const iAmParticipant = everyone.includes(currentUserId);

  if (iAmPayer) {
    // I paid; others (excluding me if included) owe me their share
    for (const pid of everyone) {
      if (pid === currentUserId) continue;
      entries.push({
        id: uid(),
        batchId,
        counterpartyId: pid,
        groupId,
        amount: share, // positive: they owe me
        note,
        category,
        createdAt,
      });
    }
  } else if (iAmParticipant) {
    // Someone else paid; I owe the payer (one entry)
    entries.push({
      id: uid(),
      batchId,
      counterpartyId: payerId,
      groupId,
      amount: -share, // negative: I owe them
      note,
      category,
      createdAt,
    });
  } else {
    // Expense doesn't involve me → no entries recorded
  }

  return entries;
}
