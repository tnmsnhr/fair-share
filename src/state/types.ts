import { ContactsSlice } from "./slices/contacts";
import { ExpensesSlice } from "./slices/expenses";
import { UserSlice } from "./slices/user";

// src/state/types.ts
export type ID = string;

export type ThemePref = "system" | "light" | "dark";
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export type Store = UserSlice &
  ContactsSlice &
  ExpensesSlice & {
    _hydrated: boolean;
    _setHydrated: (b: boolean) => void;
  };

export type Category =
  | "food"
  | "travel"
  | "hotel"
  | "shopping"
  | "entertainment"
  | "groceries"
  | "transport"
  | "misc";

export type User = {
  id: ID;
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  currency: CurrencyCode;
  themePreference: ThemePref;
};

export type Contact = {
  id: ID;
  name: string;
  phone?: string;
  avatarUrl?: string;
};

export type Group = {
  id: ID;
  name: string;
  memberIds: ID[];
};

// A single ledger entry relative to the current user:
// amount > 0 => THEY owe ME
// amount < 0 => I owe THEM
export type TransactionEntry = {
  id: ID;
  counterpartyId: ID; // contact id
  groupId?: ID;
  amount: number; // signed amount relative to current user
  note?: string;
  category: Category;
  createdAt: string; // ISO
  // Optional linkage to the originating expense batch:
  batchId?: ID;
};

export type EqualSplitInput = {
  total: number; // total bill amount
  payerId: ID; // who paid
  participantIds: ID[]; // who benefited (can include payer)
  includePayerInSplit?: boolean; // default true
  note?: string;
  category: Category;
  groupId?: ID;
  createdAt?: string; // optional override
};
