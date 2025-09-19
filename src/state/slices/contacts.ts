// src/state/slices/contacts.ts
import type { StateCreator } from "zustand";
import type { Store, Contact, Group, ID } from "../types";

export type ContactsSlice = {
  contacts: Record<ID, Contact>;
  groups: Record<ID, Group>;
  upsertContacts: (cs: Contact[]) => void;
  upsertGroups: (gs: Group[]) => void;
  getContactName: (id: ID) => string;
};

export const createContactsSlice: StateCreator<
  Store,
  [
    ["zustand/devtools", never],
    ["zustand/persist", unknown],
    ["zustand/subscribeWithSelector", never]
  ],
  [],
  ContactsSlice
> = (set, get) => ({
  contacts: {
    "u-1": { id: "u-1", name: "Alice" },
    "u-2": { id: "u-2", name: "Bob" },
    "u-3": { id: "u-3", name: "Charlie" },
  },
  groups: {
    "g-1": { id: "g-1", name: "Trip Goa", memberIds: ["me", "u-1", "u-2"] },
  },

  upsertContacts: (cs) =>
    set(
      (s) => {
        const next = { ...s.contacts };
        for (const c of cs) next[c.id] = { ...(next[c.id] || {}), ...c };
        return { contacts: next };
      },
      false,
      "contacts/upsertContacts"
    ),

  upsertGroups: (gs) =>
    set(
      (s) => {
        const next = { ...s.groups };
        for (const g of gs) next[g.id] = { ...(next[g.id] || {}), ...g };
        return { groups: next };
      },
      false,
      "contacts/upsertGroups"
    ),

  getContactName: (id) => get().contacts[id]?.name ?? "Unknown",
});
