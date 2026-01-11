import { useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import {
  startBackgroundRecordingTask,
  stopBackgroundRecordingTask,
} from "@/packages/lib/background-recording-task";

/**
 * バックグラウンド録音を管理するフック
 *
 * アプリがバックグラウンドに移行した際に録音を継続できるようにします。
 * iOS/Androidのみ対応（Webはブラウザ制限により不可）
 *
 * @param isRecording - 現在録音中かどうか
 */
export function useBackgroundRecording(isRecording: boolean): void {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (Platform.OS === "web") {
      // Web版はバックグラウンド録音非対応
      return;
    }

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log(
        "[useBackgroundRecording] App state changed:",
        appState.current,
        "->",
        nextAppState
      );

      if (isRecording) {
        if (
          appState.current === "active" &&
          (nextAppState === "background" || nextAppState === "inactive")
        ) {
          // アプリがバックグラウンドに移行
          console.log("[useBackgroundRecording] App moved to background while recording");
          await startBackgroundRecordingTask();
        } else if (
          (appState.current === "background" || appState.current === "inactive") &&
          nextAppState === "active"
        ) {
          // アプリがフォアグラウンドに復帰
          console.log("[useBackgroundRecording] App returned to foreground");
          await stopBackgroundRecordingTask();
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isRecording]);

  // 録音が停止された場合、バックグラウンドタスクも停止
  useEffect(() => {
    if (!isRecording) {
      stopBackgroundRecordingTask();
    }
  }, [isRecording]);
}
