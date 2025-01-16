import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { FaRecordVinyl, FaPlay, FaPause, FaStop } from "react-icons/fa"; // react-icons 사용

const AudioRecorder: React.FC = () => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<any>(null);
  const playbackWaveSurferRef = useRef<WaveSurfer | null>(null);
  const [recordingProgress, setRecordingProgress] = useState("00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // 녹음을 위한 WaveSurfer 초기화 함수
  const initializeRecorder = () => {
    // 기존 waveSurfer가 있다면 파괴
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }
    const waveSurfer = WaveSurfer.create({
      container: "#recorder",
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
    });
    const recordPlugin = waveSurfer.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
      })
    );
    recordPlugin.on("record-end", (blob: Blob) => handleRecordEnd(blob));
    recordPlugin.on("record-progress", (time: number) => {
      setRecordingProgress(formatTime(time));
    });

    waveSurferRef.current = waveSurfer;
    recordPluginRef.current = recordPlugin;
  };

  useEffect(() => {
    initializeRecorder();
    return () => {
      waveSurferRef.current?.destroy();
      playbackWaveSurferRef.current?.destroy();
    };
  }, []);

  // 시간을 'mm:ss' 형식으로 변환
  const formatTime = (time: number) => {
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return [minutes, seconds].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  // 녹음 시작 함수
  const handleRecordStart = () => {
    // 기존 URL 초기화하고 새로운 녹음 세션 초기화
    setRecordedUrl(null); // 기존 URL 지우기
    setIsRecording(true);
    setIsPaused(false);
    playbackWaveSurferRef.current?.destroy(); // 이전 재생 파형 지우기

    // 새로운 녹음 세션을 위한 WaveSurfer 초기화
    initializeRecorder();

    if (recordPluginRef.current) {
      recordPluginRef.current.startRecording().then(() => {
        // 녹음 중에는 playback을 숨김
        document.getElementById("playback")!.style.display = "none";
      });
    }
  };

  // 녹음 중지 함수
  const handleRecordStop = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // 녹음 일시정지 / 재개 함수
  const handleRecordPause = () => {
    if (recordPluginRef.current) {
      if (isPaused) {
        recordPluginRef.current.resumeRecording();
        setIsPaused(false);
      } else {
        recordPluginRef.current.pauseRecording();
        setIsPaused(true);
      }
    }
  };

  // 녹음 종료 후 처리 함수
  const handleRecordEnd = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setRecordedUrl(url);
    waveSurferRef.current?.destroy();
    initializePlayback(url);
  };

  // 녹음된 파일 재생을 위한 WaveSurfer 초기화
  const initializePlayback = (url: string) => {
    if (playbackWaveSurferRef.current) {
      playbackWaveSurferRef.current.destroy();
    }
    const playbackWaveSurfer = WaveSurfer.create({
      container: "#playback",
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url,
    });
    playbackWaveSurferRef.current = playbackWaveSurfer;

    // 녹음 완료 후 playback을 표시
    document.getElementById("playback")!.style.display = "block";
  };

  // 재생 / 일시정지 버튼 처리 함수
  const handlePlayPause = () => {
    if (playbackWaveSurferRef.current) {
      if (playbackWaveSurferRef.current.isPlaying()) {
        playbackWaveSurferRef.current.pause();
      } else {
        playbackWaveSurferRef.current.play();
      }
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <div style={{ marginBottom: "1rem" }}>
        {isRecording ? (
          <p>Recording Progress: {recordingProgress}</p>
        ) : recordedUrl ? (
          <p>Playback Ready</p>
        ) : (
          <p>Press Record to start recording 🎙️</p>
        )}
      </div>
      <div
        id="recorder"
        style={{
          display: isRecording ? "block" : "none",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      ></div>
      <div
        id="playback"
        style={{
          display: "none",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      ></div>
      <div>
        {isRecording ? (
          <>
            <button onClick={handleRecordStop}>
              <FaStop /> {/* Stop 아이콘 */}
            </button>
            <button onClick={handleRecordPause}>
              {isPaused ? <FaPlay /> : <FaPause />}{" "}
              {/* 일시정지 / 재개 아이콘 */}
            </button>
          </>
        ) : recordedUrl ? (
          <>
            <button onClick={handlePlayPause}>
              <FaPlay /> {/* Play 아이콘 */}
            </button>
            <button onClick={handleRecordStart}>
              <FaRecordVinyl /> {/* Record 아이콘 */}
            </button>
          </>
        ) : (
          <button onClick={handleRecordStart}>
            <FaRecordVinyl /> {/* Record 아이콘 */}
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
