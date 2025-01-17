// audioUtils.ts
import lamejs from "@breezystack/lamejs";

// Blob 가져오기
export const fetchBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch file.");
  }
  return response.blob();
};

// AudioBuffer를 WAV로 변환
const audioBufferToWav = (
  buffer: AudioBuffer,
  numChannels: number,
  sampleRate: number
): ArrayBuffer => {
  const byteLength = buffer.length * numChannels * 2 + 44;
  const wavBuffer = new ArrayBuffer(byteLength);
  const wavView = new DataView(wavBuffer);

  let offset = 0;
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      wavView.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  };

  writeString("RIFF");
  wavView.setUint32(offset, byteLength - 8, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  wavView.setUint32(offset, 16, true);
  offset += 4;
  wavView.setUint16(offset, 1, true);
  offset += 2;
  wavView.setUint16(offset, numChannels, true);
  offset += 2;
  wavView.setUint32(offset, sampleRate, true);
  offset += 4;
  wavView.setUint32(offset, sampleRate * numChannels * 2, true);
  offset += 4;
  wavView.setUint16(offset, numChannels * 2, true);
  offset += 2;
  wavView.setUint16(offset, 16, true);
  offset += 2;
  writeString("data");
  wavView.setUint32(offset, byteLength - offset - 4, true);
  offset += 4;

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      wavView.setInt16(
        44 + i * 2 * numChannels + channel * 2,
        channelData[i] * 0x7fff,
        true
      );
    }
  }

  return wavBuffer;
};

// WebM → WAV 변환
export const convertWebMToWav = async (webmBlob: Blob): Promise<Blob> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const wavArrayBuffer = audioBufferToWav(audioBuffer, numChannels, sampleRate);

  return new Blob([wavArrayBuffer], { type: "audio/wav" });
};

// WAV → MP3 변환
export const convertWavToMp3 = async (wavBlob: Blob): Promise<Blob> => {
  const arrayBuffer = await wavBlob.arrayBuffer();
  const dataView = new DataView(arrayBuffer);
  const sampleRate = dataView.getUint32(24, true);
  const numChannels = dataView.getUint16(22, true);

  const samples = new Int16Array(arrayBuffer, 44);
  const mp3Encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, 128);
  const mp3Data = mp3Encoder.encodeBuffer(samples);
  mp3Encoder.flush();

  return new Blob([new Uint8Array(mp3Data)], { type: "audio/mp3" });
};
