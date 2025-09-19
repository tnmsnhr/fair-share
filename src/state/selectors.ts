// src/state/selectors.ts
import type { Store, ID } from "./types";
import { useStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

export const useHydrated = () => useStore((s) => s._hydrated);

export const useUserMeta = () =>
  useStore(
    useShallow((s) => ({
      meId: s.me.id,
      fullName: s.me.fullName,
      username: s.me.username,
      avatarUrl: s.me.avatarUrl,
      currency: s.me.currency,
      themePreference: s.me.themePreference,
    }))
  );

export function useRecentTransactions(limit = 10) {
  const list = useStore((s) => s.transactions); // subscribe to the base ref
  return useMemo(() => list.slice(0, limit), [list, limit]); // stable ref
}

export const useTotals = () =>
  useStore((s) => {
    let toReceive = 0;
    let toPay = 0;
    for (const t of s.transactions) {
      if (t.amount > 0) toReceive += t.amount;
      else toPay += -t.amount;
    }
    return { toReceive, toPay };
  });

export const useRecentContacts = (limit = 5) =>
  useStore((s) => {
    // unique by counterparty with latest transaction first
    const seen = new Set<ID>();
    const out: ID[] = [];
    for (const tx of s.transactions) {
      const id = tx.counterpartyId;
      if (!seen.has(id)) {
        seen.add(id);
        out.push(id);
        if (out.length >= limit) break;
      }
    }
    return out;
  });

// Get a name for a contact id
export const useContactName = (id: ID) =>
  useStore((s) => s.contacts[id]?.name ?? "Unknown");
