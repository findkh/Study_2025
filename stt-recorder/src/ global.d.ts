// src/global.d.ts

// 기본 AudioWorkletProcessor 타입 선언
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

// registerProcessor 타입 선언
declare function registerProcessor(
  name: string,
  processorCtor: AudioWorkletProcessorConstructor
): void;

// AudioWorkletProcessorConstructor 타입 추가
interface AudioWorkletProcessorConstructor {
  new (): AudioWorkletProcessor;
}
