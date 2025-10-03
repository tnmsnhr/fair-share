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

// src/state/types.ts
export type SplitType = "EQUAL" | "PERCENT" | "AMOUNT" | "SHARE";

export type Payer = {
  userId: string;
  amount: number; // how much this user actually paid
};

export type TxShareInput = {
  userId: string;
  value: number; // meaning depends on SplitType:
  // EQUAL: ignored; PERCENT: % (0..100); AMOUNT: absolute; SHARE: share units
};

export type TxParticipant = string; // userId

export type TxTransfer = {
  fromUserId: string; // debtor
  toUserId: string; // creditor
  amount: number; // settled amount for this transaction
};

export type Transaction = {
  id: string;
  title: string;
  notes?: string;
  tags?: string[];
  category?: string;
  currency: CurrencyCode;

  totalAmount: number;
  date: number; // epoch ms
  groupId?: string | null; // optional

  splitType: SplitType;
  participants: TxParticipant[]; // must include every owing party (can include me)
  payers: Payer[]; // one or many

  shares: TxShareInput[]; // inputs that define how total is divided among participants
  // normalized internally to per-user owed amounts

  // Precomputed settlement edges for this single transaction
  transfers: TxTransfer[];

  createdAt: number;
  updatedAt: number;
};
