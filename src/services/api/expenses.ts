import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
};

const key = {
  list: ["expenses"] as const,
};

export function useExpenses() {
  return useQuery({
    queryKey: key.list,
    queryFn: () => api<Expense[]>("/expenses"),
    // instantaneous UI from cache when offline:
    placeholderData: (prev) => prev,
  });
}

/** Offline queue for mutations (very small but effective) */
const QUEUE_KEY = "fs.offline.expense.queue";

async function enqueue(payload: Omit<Expense, "id" | "createdAt">) {
  const raw = (await AsyncStorage.getItem(QUEUE_KEY)) ?? "[]";
  const arr = JSON.parse(raw) as any[];
  arr.push({ _tmpId: `tmp-${Date.now()}`, payload });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
}

export function useAddExpense() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; amount: number }) => {
      const net = await NetInfo.fetch();
      // If offline, store and pretend success (optimistic)
      if (!net.isConnected) {
        await enqueue(input);
        // mimic server response for optimistic UI
        return {
          id: `tmp-${Date.now()}`,
          title: input.title,
          amount: input.amount,
          createdAt: new Date().toISOString(),
        } as Expense;
      }
      return api<Expense>("/expenses", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: key.list });
      const prev = qc.getQueryData<Expense[]>(key.list) ?? [];
      const optimistic: Expense = {
        id: `optim-${Date.now()}`,
        title: input.title,
        amount: input.amount,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<Expense[]>(key.list, [optimistic, ...prev]);
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(key.list, ctx.prev);
    },
    onSuccess: (server) => {
      // reconcile: replace optimistic with server copy if needed
      qc.setQueryData<Expense[]>(key.list, (curr = []) => {
        const withoutOptim = curr.filter(
          (e) => !String(e.id).startsWith("optim")
        );
        return [server, ...withoutOptim];
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key.list });
    },
  });
}

/** Flush queued mutations when back online (call on app focus or via background task) */
export async function flushExpenseQueue() {
  const raw = (await AsyncStorage.getItem(QUEUE_KEY)) ?? "[]";
  const arr = JSON.parse(raw) as {
    _tmpId: string;
    payload: { title: string; amount: number };
  }[];
  if (!arr.length) return;
  try {
    for (const q of arr) {
      await api<Expense>("/expenses", {
        method: "POST",
        body: JSON.stringify(q.payload),
      });
    }
    await AsyncStorage.setItem(QUEUE_KEY, "[]");
  } catch {
    // leave items for next attempt
  }
}
