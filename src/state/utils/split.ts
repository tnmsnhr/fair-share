// src/state/utils/split.ts
import type {
  EqualSplitInput,
  ID,
  Payer,
  SplitType,
  TransactionEntry,
  TxShareInput,
  TxTransfer,
} from "../types";
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

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function normalizeOwedByUser(
  splitType: SplitType,
  participants: string[],
  shares: TxShareInput[],
  total: number
): Record<string, number> {
  const map = new Map<string, number>();
  participants.forEach((u) => map.set(u, 0));

  if (participants.length === 0 || total <= 0) return Object.fromEntries(map);

  if (splitType === "EQUAL") {
    const each = round2(total / participants.length);
    participants.forEach((u) => map.set(u, each));
    // fix rounding residue
    const sum = participants.reduce((a, u) => a + (map.get(u) || 0), 0);
    const diff = round2(total - sum);
    if (diff !== 0)
      map.set(participants[0], round2((map.get(participants[0]) || 0) + diff));
    return Object.fromEntries(map);
  }

  const shareMap = new Map(shares.map((s) => [s.userId, s.value]));
  const present = participants.filter((u) => shareMap.has(u));

  if (splitType === "PERCENT") {
    let pctSum = present.reduce((a, u) => a + (shareMap.get(u) || 0), 0);
    if (pctSum === 0) pctSum = 100;
    present.forEach((u) => {
      const p = (shareMap.get(u) || 0) / pctSum;
      map.set(u, round2(total * p));
    });
  } else if (splitType === "AMOUNT") {
    present.forEach((u) => map.set(u, round2(shareMap.get(u) || 0)));
    // any missing participant gets 0; fix rounding to match total
    const sum = participants.reduce((a, u) => a + (map.get(u) || 0), 0);
    const diff = round2(total - sum);
    if (diff !== 0) {
      const u0 = participants[0];
      map.set(u0, round2((map.get(u0) || 0) + diff));
    }
  } else if (splitType === "SHARE") {
    const units = present.reduce((a, u) => a + (shareMap.get(u) || 0), 0);
    const eachUnit = units === 0 ? 0 : total / units;
    present.forEach((u) => {
      map.set(u, round2((shareMap.get(u) || 0) * eachUnit));
    });
    // fix rounding
    const sum = participants.reduce((a, u) => a + (map.get(u) || 0), 0);
    const diff = round2(total - sum);
    if (diff !== 0)
      map.set(participants[0], round2((map.get(participants[0]) || 0) + diff));
  }

  return Object.fromEntries(map);
}

/**
 * Given who paid what and who owes what, compute transfers (who pays whom) for this TX.
 * Greedy settlement: match debtors to creditors until everyone is net 0.
 */
export function settleTransfers(
  amountPaidByUser: Record<string, number>,
  amountOwedByUser: Record<string, number>
): TxTransfer[] {
  // net = paid - owed;  >0 creditor, <0 debtor
  const netByUser: Record<string, number> = {};
  const users = Array.from(
    new Set([
      ...Object.keys(amountPaidByUser),
      ...Object.keys(amountOwedByUser),
    ])
  );
  users.forEach((u) => {
    const paid = amountPaidByUser[u] || 0;
    const owed = amountOwedByUser[u] || 0;
    netByUser[u] = round2(paid - owed);
  });

  const creditors: { userId: string; left: number }[] = [];
  const debtors: { userId: string; left: number }[] = [];
  for (const u of users) {
    const n = netByUser[u];
    if (n > 0.001) creditors.push({ userId: u, left: n });
    else if (n < -0.001) debtors.push({ userId: u, left: -n }); // how much they owe
  }

  const transfers: TxTransfer[] = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const amt = round2(Math.min(d.left, c.left));
    if (amt > 0) {
      transfers.push({ fromUserId: d.userId, toUserId: c.userId, amount: amt });
      d.left = round2(d.left - amt);
      c.left = round2(c.left - amt);
    }
    if (d.left <= 0.001) i++;
    if (c.left <= 0.001) j++;
  }
  return transfers;
}

export function toAmountPaidByUser(payers: Payer[]): Record<string, number> {
  const map: Record<string, number> = {};
  payers.forEach((p) => {
    map[p.userId] = round2((map[p.userId] || 0) + p.amount);
  });
  return map;
}
