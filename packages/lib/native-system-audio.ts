/**
 * Native System Audio Capture for Android/iOS
 *
 * Uses MediaProjection (Android 10+) and ReplayKit (iOS 11+) for system audio capture
 */

import { Platform } from 'react-native';
import type { AudioSource } from './system-audio-stream';

type AudioChunkCallback = (base64Audio: string) => void;

// Native module will be loaded conditionally
let NativeSystemAudio: any = null;

if (Platform.OS !== 'web') {
  try {
    NativeSystemAudio = require('expo-system-audio').default;
  } catch (e) {
    console.warn('[NativeSystemAudio] Module not available:', e);
  }
}

export class NativeSystemAudioCapture {
  private audioChunkSubscription: any = null;
  private errorSubscription: any = null;
  private onAudioChunkCallback: AudioChunkCallback | null = null;
  private isActive = false;

  /**
   * Check if native system audio capture is supported
   */
  static isSupported(): boolean {
    if (Platform.OS === 'web') {
      return false;
    }
    if (!NativeSystemAudio) {
      return false;
    }
    return NativeSystemAudio.isSupported();
  }

  /**
   * Request permission for system audio capture
   * This will show a system dialog for screen recording permission
   */
  async requestPermission(): Promise<boolean> {
    if (!NativeSystemAudio) {
      console.warn('[NativeSystemAudio] Module not available');
      return false;
    }

    try {
      return await NativeSystemAudio.requestPermission();
    } catch (error) {
      console.error('[NativeSystemAudio] Failed to request permission:', error);
      return false;
    }
  }

  /**
   * Start system audio capture
   * @param source - Audio source (system, microphone, or both)
   * @param callback - Callback for audio chunks (Base64 PCM)
   * @param sampleRate - Sample rate (default: 16000)
   */
  async start(
    source: AudioSource,
    callback: AudioChunkCallback,
    sampleRate: number = 16000
  ): Promise<void> {
    if (this.isActive) {
      console.warn('[NativeSystemAudio] Already capturing');
      return;
    }

    if (!NativeSystemAudio) {
      throw new Error('Native system audio module not available');
    }

    this.onAudioChunkCallback = callback;

    try {
      console.log('[NativeSystemAudio] Starting capture with source:', source);

      // Convert source to config
      const config = {
        sampleRate,
        includeSystemAudio: source === 'system' || source === 'both',
        includeMicrophone: source === 'microphone' || source === 'both',
      };

      // Subscribe to audio chunks
      this.audioChunkSubscription = NativeSystemAudio.onAudioChunk((chunk: { data: string; sampleRate: number }) => {
        if (this.onAudioChunkCallback) {
          this.onAudioChunkCallback(chunk.data);
        }
      });

      // Subscribe to errors
      this.errorSubscription = NativeSystemAudio.onError((error: { message: string }) => {
        console.error('[NativeSystemAudio] Error:', error.message);
      });

      // Start capture
      await NativeSystemAudio.start(config);
      this.isActive = true;

      console.log('[NativeSystemAudio] Capture started successfully');
    } catch (error) {
      console.error('[NativeSystemAudio] Failed to start capture:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Stop system audio capture
   */
  async stop(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    console.log('[NativeSystemAudio] Stopping capture...');

    try {
      if (NativeSystemAudio) {
        await NativeSystemAudio.stop();
      }
    } catch (error) {
      console.error('[NativeSystemAudio] Error stopping capture:', error);
    } finally {
      this.cleanup();
      console.log('[NativeSystemAudio] Capture stopped');
    }
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    this.isActive = false;

    if (this.audioChunkSubscription) {
      this.audioChunkSubscription.remove();
      this.audioChunkSubscription = null;
    }

    if (this.errorSubscription) {
      this.errorSubscription.remove();
      this.errorSubscription = null;
    }

    this.onAudioChunkCallback = null;
  }

  /**
   * Check if currently capturing
   */
  get capturing(): boolean {
    return this.isActive;
  }
}
