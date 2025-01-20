import { useState, useCallback } from "react";
import {
  convertWebMToWav,
  fetchBlob,
  audioBufferToWav,
} from "../utils/audioUtils"; // audioUtils의 함수들을 가져옵니다.

// 커스텀 훅: 음성 자르고 재생하기
const useAudioEditor = (
  url: string | null,
  startTime: number | null,
  endTime: number | null
) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(url); // 자른 오디오 URL

  // 자른 오디오 파일을 생성하는 함수
  const cutAudio = useCallback(async () => {
    if (url && startTime !== null && endTime !== null) {
      try {
        // WebM 파일을 Blob으로 가져오기
        const webmBlob = await fetchBlob(url);

        // WebM을 WAV로 변환
        const wavBlob = await convertWebMToWav(webmBlob);

        // WAV 파일을 AudioBuffer로 변환
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const arrayBuffer = await wavBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // 새 오디오 버퍼를 만들기 위해 자를 구간을 계산
        const startOffset = Math.floor(startTime * audioBuffer.sampleRate);
        const endOffset = Math.floor(endTime * audioBuffer.sampleRate);
        const newBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          endOffset - startOffset,
          audioBuffer.sampleRate
        );

        // 각 채널에 대해 데이터를 복사
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
          const channelData = audioBuffer.getChannelData(i);
          newBuffer
            .getChannelData(i)
            .set(channelData.subarray(startOffset, endOffset));
        }

        // WAV로 변환
        const wavArrayBuffer = audioBufferToWav(
          newBuffer,
          audioBuffer.numberOfChannels,
          audioBuffer.sampleRate
        );
        const cutAudioFile = new Blob([wavArrayBuffer], { type: "audio/wav" });
        const cutUrl = URL.createObjectURL(cutAudioFile);
        setAudioUrl(cutUrl); // 자른 오디오 URL로 업데이트
      } catch (error) {
        console.error("Error cutting audio:", error);
      }
    }
  }, [url, startTime, endTime]);

  return {
    audioUrl,
    cutAudio,
  };
};

export default useAudioEditor;
