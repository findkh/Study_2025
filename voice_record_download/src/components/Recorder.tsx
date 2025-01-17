import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { WAVESURFER_MESSAGE } from "../constants/Message"; // 메시지 상수 가져오기

interface RecordPluginInstance {
  startRecording: () => void;
  stopRecording: () => void;
  on: (event: string, callback: (blob: Blob) => void) => void;
}

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isRecording }) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPluginInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initializeRecorder = () => {
    if (waveSurferRef.current) waveSurferRef.current.destroy(); // 기존 waveSurfer 초기화

    if (containerRef.current) {
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current, // ref를 사용하여 DOM 요소 참조
        waveColor: "#706d6b",
        progressColor: "#008bf5",
        cursorColor: "#d81313",
        cursorWidth: 1,
        height: 250,
      });

      const recordPlugin = waveSurfer.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: false, // 이미 녹음된 오디오를 표시하지 않음
        })
      );

      recordPlugin.on("record-end", (blob: Blob) => onRecordingComplete(blob)); // 녹음 완료 후 onRecordingComplete 콜백 호출

      waveSurferRef.current = waveSurfer;
      recordPluginRef.current = recordPlugin as RecordPluginInstance; // 타입 캐스팅
    }
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
        ref={containerRef} // ref를 사용하여 DOM 요소에 연결
        style={{
          marginBottom: "1rem",
          backgroundColor: "rgb(246 246 246)",
        }}
      ></div>
      <div style={{ textAlign: "center", marginTop: "1rem", color: "#888" }}>
        {isRecording ? "녹음 중입니다. 중지하려면 버튼을 누르세요." : WAVESURFER_MESSAGE.RECORD}{" "}
        {/* 기본 안내 메시지 */}
      </div>
    </div>
  );
};

export default Recorder;
