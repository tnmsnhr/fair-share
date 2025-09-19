import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { flushExpenseQueue } from "./api/expenses";
import { queryClient } from "@/contexts/QueryProvider";

export const SYNC_TASK = "fs-bg-sync";

TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    await flushExpenseQueue();
    // opportunistically refresh cached queries:
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) return;

  await BackgroundFetch.registerTaskAsync(SYNC_TASK, {
    minimumInterval: 15 * 60, // 15 minutes (system best effort)
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
