// src/components/Recorder.tsx
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
}

const Recorder: React.FC<RecorderProps> = ({
  onRecordingComplete,
  isRecording,
}) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<any>(null);

  const initializeRecorder = () => {
    if (waveSurferRef.current) waveSurferRef.current.destroy(); // 기존 waveSurfer 초기화

    const waveSurfer = WaveSurfer.create({
      container: "#recorder", // DOM에 WaveSurfer를 렌더링할 요소
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
    });

    const recordPlugin = waveSurfer.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false, // 이미 녹음된 오디오를 표시하지 않음
      })
    );

    recordPlugin.on("record-end", (blob: Blob) => onRecordingComplete(blob)); // 녹음 완료 후 onRecordingComplete 콜백 호출

    waveSurferRef.current = waveSurfer;
    recordPluginRef.current = recordPlugin;
  };

  useEffect(() => {
    initializeRecorder(); // 컴포넌트가 마운트될 때 초기화

    return () => {
      waveSurferRef.current?.destroy(); // 컴포넌트 언마운트 시 cleanup
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordPluginRef.current?.startRecording(); // 녹음 시작
    } else {
      recordPluginRef.current?.stopRecording(); // 녹음 중지
    }
  }, [isRecording]);

  return (
    <div>
      <div
        id="recorder"
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      ></div>
    </div>
  );
};

export default Recorder;
