class StreamingWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      const downsampled = this.downsample(channelData, sampleRate, 8000);
      const int16Buffer = new Int16Array(downsampled.length);
      for (let i = 0; i < downsampled.length; i++) {
        let s = Math.max(-1, Math.min(1, downsampled[i]));
        int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(int16Buffer);
    }
    return true;
  }

  downsample(buffer, srcRate, targetRate) {
    if (targetRate === srcRate) return buffer;
    const ratio = srcRate / targetRate;
    const length = Math.floor(buffer.length / ratio);
    const result = new Float32Array(length);
    let offset = 0;
    for (let i = 0; i < length; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }
    return result;
  }
}

registerProcessor("StreamingWorkletProcessor", StreamingWorkletProcessor);
