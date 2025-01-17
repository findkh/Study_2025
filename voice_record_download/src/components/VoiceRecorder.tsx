import React, { useState } from "react";
import { FaStop, FaPlay, FaPause, FaDownload } from "react-icons/fa";
import { Dropdown, Space, Button } from "antd";
import Recorder from "./Recorder";
import Playback from "./Playback";
import useDownload from "../hooks/useDownload"; // 경로에 맞게 수정
import { WAVESURFER_MESSAGE } from "../constants/Message";

const VoiceRecorder: React.FC = () => {
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null); // 녹음 파일 URL
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태
  const [isPaused, setIsPaused] = useState(false); // 녹음 일시정지 상태
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태
  const [playbackType, setPlaybackType] =
    useState<keyof typeof WAVESURFER_MESSAGE>("RECORD");
  const { downloadFile } = useDownload(recordedUrl); // 다운로드 훅 사용

  // 녹음 완료 핸들러
  const handleRecordingComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setRecordedUrl(url);
    setIsRecording(false);
    setIsPaused(false);
    setPlaybackType("RECORD");
  };

  // 녹음 시작 핸들러
  const handleRecordStart = () => {
    setRecordedUrl(null);
    setIsRecording(true);
    setIsPaused(false);
    setIsPlaying(false);
    setPlaybackType("RECORD"); // 초기값을 유지
  };

  // 녹음 중지 핸들러
  const handleRecordStop = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  // 녹음 일시정지 핸들러
  const handleRecordPause = () => {
    setIsPaused((prev) => !prev);
  };

  // 재생/일시정지 핸들러
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // 재생 완료 핸들러
  const handlePlaybackFinish = () => {
    setIsPlaying(false);
  };

  // 다운로드 메뉴 항목
  const downloadMenuItems = [
    {
      label: "Download as Webm",
      key: "webm",
      onClick: () => downloadFile("webm"),
    },
    {
      label: "Download as WAV",
      key: "wav",
      onClick: () => downloadFile("wav"),
    },
    {
      label: "Download as MP3",
      key: "mp3",
      onClick: () => downloadFile("mp3"),
    },
  ];

  return (
    <div style={{ marginBottom: "10px" }}>
      {!recordedUrl ? (
        <Recorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
        />
      ) : (
        <Playback
          key={recordedUrl || "placeholder"} // URL 변경 시 리렌더링
          url={recordedUrl}
          isPlaying={isPlaying}
          onFinish={handlePlaybackFinish}
          type={playbackType}
        />
      )}

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {isRecording ? (
              <>
                <button onClick={handleRecordStop} style={buttonStyle}>
                  <FaStop style={iconStyle} />
                </button>
                <button onClick={handleRecordPause} style={buttonStyle}>
                  {isPaused ? (
                    <FaPlay style={iconStyle} />
                  ) : (
                    <FaPause style={iconStyle} />
                  )}
                </button>
              </>
            ) : recordedUrl ? (
              <>
                <button onClick={handleRecordStart} style={buttonStyle}>
                  <div style={innerCircleStyle}></div>
                </button>
                <button onClick={handlePlayPause} style={buttonStyle}>
                  {isPlaying ? (
                    <FaPause style={iconStyle} />
                  ) : (
                    <FaPlay style={iconStyle} />
                  )}
                </button>
              </>
            ) : (
              <button onClick={handleRecordStart} style={buttonStyle}>
                <div style={innerCircleStyle}></div>
              </button>
            )}
          </div>

          {recordedUrl && (
            <Dropdown menu={{ items: downloadMenuItems }} trigger={["click"]}>
              <Button style={buttonStyle}>
                <Space>
                  <FaDownload
                    style={{ fontSize: "20px", color: "rgb(126 127 128)" }}
                  />
                </Space>
              </Button>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

// 버튼 스타일
const buttonStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "1px solid #b1b1b1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "transparent",
  position: "relative",
  cursor: "pointer",
};

const iconStyle: React.CSSProperties = {
  fontSize: "25px",
  color: "rgb(126 127 128)",
};

const innerCircleStyle: React.CSSProperties = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  background: "red",
};

export default VoiceRecorder;
