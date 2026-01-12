import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

export const BACKGROUND_RECORDING_TASK = "BACKGROUND_RECORDING_TASK";

/**
 * バックグラウンド録音タスクを定義
 *
 * このタスクはアプリがバックグラウンドに移行した際に録音を継続するために使用されます。
 * 実際の録音処理はexpo-audioが継続して行い、このタスクは状態監視とリソース維持を担当します。
 */
TaskManager.defineTask(BACKGROUND_RECORDING_TASK, async ({ data, error }) => {
  if (error) {
    console.error("[BackgroundRecordingTask] Error:", error);
    return;
  }

  console.log("[BackgroundRecordingTask] Task executed");

  // バックグラウンドタスクが正常に実行されたことを示す
  return BackgroundTaskResult.OK;
});

/**
 * バックグラウンドタスクの結果
 */
export const BackgroundTaskResult = {
  OK: undefined,
  FAILED: undefined,
} as const;

/**
 * バックグラウンド録音タスクが登録されているかチェック
 */
export async function isBackgroundRecordingTaskRegistered(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    return tasks.some((task) => task.taskName === BACKGROUND_RECORDING_TASK);
  } catch (error) {
    console.error("[BackgroundRecordingTask] Failed to check registration:", error);
    return false;
  }
}

/**
 * バックグラウンド録音タスクを開始
 */
export async function startBackgroundRecordingTask(): Promise<void> {
  if (Platform.OS === "web") {
    console.log("[BackgroundRecordingTask] Not supported on web");
    return;
  }

  try {
    const isRegistered = await isBackgroundRecordingTaskRegistered();
    if (isRegistered) {
      console.log("[BackgroundRecordingTask] Task already registered");
      return;
    }

    // Note: expo-task-managerは主にBackground FetchやLocation用
    // 録音の継続はexpo-audioのallowsBackgroundRecordingで処理される
    console.log("[BackgroundRecordingTask] Background recording enabled via expo-audio settings");
  } catch (error) {
    console.error("[BackgroundRecordingTask] Failed to start:", error);
  }
}

/**
 * バックグラウンド録音タスクを停止
 */
export async function stopBackgroundRecordingTask(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    const isRegistered = await isBackgroundRecordingTaskRegistered();
    if (!isRegistered) {
      return;
    }

    await TaskManager.unregisterTaskAsync(BACKGROUND_RECORDING_TASK);
    console.log("[BackgroundRecordingTask] Task unregistered");
  } catch (error) {
    console.error("[BackgroundRecordingTask] Failed to stop:", error);
  }
}
