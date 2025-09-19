// src/state/slices/expenses.ts
import type { StateCreator } from "zustand";
import type { Store, TransactionEntry, EqualSplitInput, ID } from "../types";
import { expandEqualSplitForUser } from "../utils/split";

export type ExpensesSlice = {
  transactions: TransactionEntry[]; // newest first
  addEqualSplit: (input: EqualSplitInput) => void;
  removeTransaction: (id: ID) => void;
  clearAll: () => void;
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

  addEqualSplit: (input) =>
    set(
      (s) => {
        const meId = s.me.id;
        const entries = expandEqualSplitForUser(input, meId);
        // newest first
        return { transactions: [...entries, ...s.transactions] };
      },
      false,
      "expenses/addEqualSplit"
    ),

  removeTransaction: (id) =>
    set(
      (s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }),
      false,
      "expenses/remove"
    ),

  clearAll: () => set({ transactions: [] }, false, "expenses/clearAll"),
});
