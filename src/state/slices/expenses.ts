// src/state/slices/expenses.ts
import type { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  Store,
  Transaction,
  SplitType,
  TxShareInput,
  Payer,
} from "../types";
import {
  normalizeOwedByUser,
  settleTransfers,
  toAmountPaidByUser,
  round2,
} from "../utils/split";

export type ExpensesSlice = {
  transactions: Transaction[];

  // actions
  addTransaction: (input: {
    title: string;
    notes?: string;
    tags?: string[];
    category?: string;
    currency: string; // CurrencyCode
    totalAmount: number;
    date?: number;
    groupId?: string | null;

    splitType: SplitType;
    participants: string[]; // userIds (include 'me' if applicable)
    payers: Payer[]; // one or many
    shares: TxShareInput[]; // how to split among participants
  }) => Transaction;

  removeTransaction: (txId: string) => void;

  // Selectors (derived)
  getHomeOwedSummaryForMe: () => { userId: string; amount: number }[]; // “who owes me how much” aggregated
};

export const createExpensesSlice: StateCreator<
  Store,
  [
    ["zustand/devtools", never],
    ["zustand/persist", unknown],
    ["zustand/subscribeWithSelector", never]
  ],
  [],
  ExpensesSlice
> = (set, get) => ({
  transactions: [],

  addTransaction: (input) => {
    const id = uuidv4();
    const now = Date.now();
    const date = input.date ?? now;

    // 1) Compute owed per participant from split config
    const owed = normalizeOwedByUser(
      input.splitType,
      input.participants,
      input.shares,
      input.totalAmount
    );

    // 2) Amount paid per user from payers list
    const paid = toAmountPaidByUser(input.payers);

    // 3) Compute transfers (who pays whom for THIS tx)
    const transfers = settleTransfers(paid, owed);

    const tx: Transaction = {
      id,
      title: input.title,
      notes: input.notes,
      tags: input.tags,
      category: input.category,
      currency: input.currency as any,
      totalAmount: round2(input.totalAmount),
      date,
      groupId: input.groupId ?? null,
      splitType: input.splitType,
      participants: input.participants,
      payers: input.payers,
      shares: input.shares,
      transfers,
      createdAt: now,
      updatedAt: now,
    };

    set(
      (s) => ({ transactions: [tx, ...s.transactions] }),
      false,
      "expenses/addTransaction"
    );
    return tx;
  },

  removeTransaction: (txId) => {
    set(
      (s) => ({ transactions: s.transactions.filter((t) => t.id !== txId) }),
      false,
      "expenses/removeTransaction"
    );
  },

  getHomeOwedSummaryForMe: () => {
    const meId = get().me.id;
    const totals: Record<string, number> = {};

    for (const tx of get().transactions) {
      for (const tr of tx.transfers) {
        if (tr.toUserId === meId) {
          totals[tr.fromUserId] = round2(
            (totals[tr.fromUserId] || 0) + tr.amount
          );
        }
      }
    }

    return Object.entries(totals)
      .filter(([, amt]) => amt > 0.009)
      .sort((a, b) => b[1] - a[1])
      .map(([userId, amount]) => ({ userId, amount }));
  },
});
