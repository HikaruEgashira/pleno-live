import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";

/**
 * Web版用のオーディオメータリングフック
 * マイク入力の音声レベルをリアルタイムで取得します
 */
export function useAudioMetering(isRecording: boolean): number {
  const [metering, setMetering] = useState(-160);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    if (!isRecording) {
      // 録音停止時にクリーンアップ
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setMetering(-160);
      return;
    }

    // 録音開始時にメータリングを開始
    const startMetering = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        analyserRef.current = analyser;

        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMetering = () => {
          if (!analyserRef.current || !isRecording) return;

          analyserRef.current.getByteFrequencyData(dataArray);

          // RMS（二乗平均平方根）を計算
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);

          // 0-255 を -60dB〜0dB に変換
          const db = rms > 0 ? 20 * Math.log10(rms / 255) : -60;
          const clampedDb = Math.max(-60, Math.min(0, db));

          setMetering(clampedDb);

          animationFrameRef.current = requestAnimationFrame(updateMetering);
        };

        updateMetering();
      } catch (error) {
        console.error("[useAudioMetering] Failed to start metering:", error);
      }
    };

    startMetering();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  return metering;
}
