import ExpoModulesCore
import ReplayKit
import AVFoundation

public class ExpoSystemAudioModule: Module {
  private var screenRecorder: RPScreenRecorder?
  private var audioEngine: AVAudioEngine?
  private var audioPlayerNode: AVAudioPlayerNode?
  private var isCapturing = false
  private var sampleRate: Double = 16000
  private var includeSystemAudio = true
  private var includeMicrophone = false

  public func definition() -> ModuleDefinition {
    Name("ExpoSystemAudio")

    Events("onAudioChunk", "onError")

    Function("isSupported") { () -> Bool in
      // System audio capture requires iOS 11+
      if #available(iOS 11.0, *) {
        return true
      }
      return false
    }

    AsyncFunction("requestPermission") { (promise: Promise) in
      guard #available(iOS 11.0, *) else {
        promise.resolve(false)
        return
      }

      // Check microphone permission
      AVAudioSession.sharedInstance().requestRecordPermission { granted in
        if granted {
          // Request screen recording permission
          // Note: RPScreenRecorder doesn't have explicit permission request
          // Permission is requested when starting capture
          promise.resolve(true)
        } else {
          promise.resolve(false)
        }
      }
    }

    AsyncFunction("startCapture") { (config: [String: Any], promise: Promise) in
      guard #available(iOS 11.0, *) else {
        promise.reject("E_NOT_SUPPORTED", "System audio capture requires iOS 11+")
        return
      }

      guard !self.isCapturing else {
        promise.reject("E_ALREADY_CAPTURING", "Already capturing audio")
        return
      }

      // Parse config
      if let rate = config["sampleRate"] as? Double {
        self.sampleRate = rate
      }
      self.includeSystemAudio = config["includeSystemAudio"] as? Bool ?? true
      self.includeMicrophone = config["includeMicrophone"] as? Bool ?? false

      self.startAudioCapture { error in
        if let error = error {
          promise.reject("E_START_ERROR", error.localizedDescription)
        } else {
          promise.resolve(nil)
        }
      }
    }

    AsyncFunction("stopCapture") { (promise: Promise) in
      self.stopAudioCapture()
      promise.resolve(nil)
    }
  }

  @available(iOS 11.0, *)
  private func startAudioCapture(completion: @escaping (Error?) -> Void) {
    screenRecorder = RPScreenRecorder.shared()

    guard let recorder = screenRecorder else {
      completion(NSError(domain: "ExpoSystemAudio", code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Failed to initialize screen recorder"]))
      return
    }

    // Configure microphone
    recorder.isMicrophoneEnabled = includeMicrophone

    // Start capture with handler
    recorder.startCapture(handler: { [weak self] (sampleBuffer, sampleBufferType, error) in
      guard let self = self else { return }

      if let error = error {
        self.sendEvent("onError", [
          "message": error.localizedDescription
        ])
        return
      }

      // Process audio buffer
      if sampleBufferType == .audioApp || sampleBufferType == .audioMic {
        self.processAudioSampleBuffer(sampleBuffer)
      }
    }, completionHandler: { error in
      if let error = error {
        completion(error)
      } else {
        self.isCapturing = true
        completion(nil)
      }
    })
  }

  private func stopAudioCapture() {
    guard isCapturing else { return }

    if #available(iOS 11.0, *) {
      screenRecorder?.stopCapture { error in
        if let error = error {
          print("Error stopping capture: \(error.localizedDescription)")
        }
      }
    }

    isCapturing = false
    screenRecorder = nil
  }

  private func processAudioSampleBuffer(_ sampleBuffer: CMSampleBuffer) {
    guard let audioBufferList = sampleBuffer.audioBufferList else {
      return
    }

    // Extract PCM data from CMSampleBuffer
    let audioBuffer = audioBufferList.mBuffers
    guard let data = audioBuffer.mData else { return }

    let dataSize = Int(audioBuffer.mDataByteSize)
    let audioData = Data(bytes: data, count: dataSize)

    // Convert to Base64
    let base64String = audioData.base64EncodedString()

    // Get sample rate from format description
    guard let formatDescription = CMSampleBufferGetFormatDescription(sampleBuffer) else {
      return
    }

    guard let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(formatDescription) else {
      return
    }

    let actualSampleRate = asbd.pointee.mSampleRate

    // Send event to JavaScript
    sendEvent("onAudioChunk", [
      "data": base64String,
      "sampleRate": actualSampleRate,
      "timestamp": Date().timeIntervalSince1970 * 1000
    ])
  }

  deinit {
    stopAudioCapture()
  }
}

// Extension to get AudioBufferList from CMSampleBuffer
extension CMSampleBuffer {
  var audioBufferList: AudioBufferList? {
    var audioBufferList = AudioBufferList()
    var blockBuffer: CMBlockBuffer?

    let status = CMSampleBufferGetAudioBufferListWithRetainedBlockBuffer(
      self,
      bufferListSizeNeededOut: nil,
      bufferListOut: &audioBufferList,
      bufferListSize: MemoryLayout<AudioBufferList>.size,
      blockBufferAllocator: nil,
      blockBufferMemoryAllocator: nil,
      flags: kCMSampleBufferFlag_AudioBufferList_Assure16ByteAlignment,
      blockBufferOut: &blockBuffer
    )

    guard status == noErr else {
      return nil
    }

    return audioBufferList
  }
}
