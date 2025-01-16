import React, { useState, useRef } from "react";
import Waveform from "./Waveform";
import { StyledButton } from "./Waveform.styled";

const AudioRecord: React.FC = () => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!recording) {
      setRecording(true);
      setAudioURL(null); // 녹음 시작 시 Waveform을 제거
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl); // 녹음 완료 후 URL 설정
        audioChunksRef.current = []; // 청크 초기화
      };

      mediaRecorderRef.current.start();
    } else {
      setRecording(false);
      mediaRecorderRef.current?.stop();
    }
  };

  const togglePause = () => {
    if (paused) {
      mediaRecorderRef.current?.resume();
    } else {
      mediaRecorderRef.current?.pause();
    }
    setPaused(!paused);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recording</h1>
      <div>
        <StyledButton onClick={startRecording}>{recording ? "Stop Recording" : "Start Recording"}</StyledButton>
        {recording && <StyledButton onClick={togglePause}>{paused ? "Resume" : "Pause"}</StyledButton>}
      </div>
      {audioURL && <Waveform key={audioURL} audioURL={audioURL} />} {/* key를 사용하여 Waveform 리렌더링 */}
    </div>
  );
};

export default AudioRecord;
