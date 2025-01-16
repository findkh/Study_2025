// src/components/AudioRecorder.tsx
import React, { useState } from "react";
import Recorder from "./Recorder";
import Playback from "./Playback";
import { FaRecordVinyl, FaStop, FaPlay, FaPause } from "react-icons/fa";

const AudioRecorder: React.FC = () => {
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleRecordingComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setRecordedUrl(url);
    setIsRecording(false); // 녹음 완료 후 녹음 상태 종료
    setIsPaused(false); // 일시정지 상태 초기화
  };

  const handleRecordStart = () => {
    setRecordedUrl(null); // 기존 녹음 URL 초기화
    setIsRecording(true); // 녹음 시작 상태로 변경
    setIsPaused(false); // 일시정지 상태 초기화
  };

  const handleRecordStop = () => {
    setIsRecording(false); // 녹음 종료
    setIsPaused(false); // 일시정지 상태 초기화
  };

  const handleRecordPause = () => {
    setIsPaused(!isPaused); // 일시정지 / 재개 토글
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      {!recordedUrl ? (
        // 녹음 중인 상태에서만 Recorder 컴포넌트가 렌더링
        <Recorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
        />
      ) : (
        // 녹음이 완료되면 Playback 컴포넌트가 렌더링
        <Playback url={recordedUrl} />
      )}

      <div style={{ marginTop: "1rem" }}>
        {/* 녹음 상태에 따른 버튼 */}
        {isRecording ? (
          // 녹음 중일 때는 Stop, Pause/Resume 버튼이 표시됨
          <div>
            <button onClick={handleRecordStop}>
              <FaStop /> Stop
            </button>
            <button onClick={handleRecordPause}>
              {isPaused ? <FaPlay /> : <FaPause />}{" "}
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        ) : recordedUrl ? (
          // 녹음 완료 후에는 Play 버튼과 재녹음 버튼만 보임
          <div>
            <button onClick={handleRecordStart}>
              <FaRecordVinyl /> Start Recording
            </button>
          </div>
        ) : (
          // 처음 상태, 녹음을 시작할 때만 보이는 버튼
          <div>
            <button onClick={handleRecordStart}>
              <FaRecordVinyl /> Start Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
