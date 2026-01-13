import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

const ExpoSystemAudio = NativeModulesProxy.ExpoSystemAudio;

export type AudioChunk = {
  data: string; // Base64 encoded PCM data
  sampleRate: number;
  timestamp: number;
};

export type SystemAudioConfig = {
  sampleRate?: number; // Default: 16000
  includeSystemAudio?: boolean; // Android/iOS: include system audio
  includeMicrophone?: boolean; // Include microphone audio
};

class SystemAudioCapture {
  private eventEmitter = new EventEmitter(ExpoSystemAudio);
  private audioChunkSubscription: Subscription | null = null;

  /**
   * Request permission for screen capture (required for system audio on Android/iOS)
   */
  async requestPermission(): Promise<boolean> {
    return await ExpoSystemAudio.requestPermission();
  }

  /**
   * Check if system audio capture is supported on this platform
   */
  isSupported(): boolean {
    return ExpoSystemAudio.isSupported?.() ?? false;
  }

  /**
   * Start capturing system audio
   */
  async start(config: SystemAudioConfig = {}): Promise<void> {
    const defaultConfig: Required<SystemAudioConfig> = {
      sampleRate: 16000,
      includeSystemAudio: true,
      includeMicrophone: false,
    };

    const finalConfig = { ...defaultConfig, ...config };
    await ExpoSystemAudio.startCapture(finalConfig);
  }

  /**
   * Stop capturing system audio
   */
  async stop(): Promise<void> {
    await ExpoSystemAudio.stopCapture();
    if (this.audioChunkSubscription) {
      this.audioChunkSubscription.remove();
      this.audioChunkSubscription = null;
    }
  }

  /**
   * Listen for audio chunks
   */
  onAudioChunk(callback: (chunk: AudioChunk) => void): Subscription {
    this.audioChunkSubscription = this.eventEmitter.addListener<AudioChunk>(
      'onAudioChunk',
      callback
    );
    return this.audioChunkSubscription;
  }

  /**
   * Listen for errors
   */
  onError(callback: (error: { message: string }) => void): Subscription {
    return this.eventEmitter.addListener<{ message: string }>('onError', callback);
  }
}

export default new SystemAudioCapture();
