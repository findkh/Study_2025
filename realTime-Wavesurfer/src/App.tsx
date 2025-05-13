import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

const RecorderPlayer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);

  // 초기화
  useEffect(() => {
    waveSurferRef.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#B3B3B3",
      cursorColor: "#bd362f",
      progressColor: "#ABD03B",
      cursorWidth: 1,
      height: 350,
      barWidth: 3,
      barGap: 2,
      barRadius: 10,
    });

    recordRef.current = waveSurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
        continuousWaveform: false,
        continuousWaveformDuration: 30,
        mediaRecorderTimeslice: 300, // ✅ 실시간 chunk를 위해 반드시 필요!
      })
    );

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, []);

  const handleRecording = async () => {
    const recorder = recordRef.current;

    if (!recorder) return;

    if (recorder.isRecording()) {
      recorder.stopRecording();
      setIsRecording(false);
    } else {
      await recorder.startRecording();
      console.log("🔴 Recording started");

      const mediaRecorder = recorder.mediaRecorder;

      // ✅ 이 타이밍에 mediaRecorder가 존재하므로 여기서 설정
      if (mediaRecorder) {
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          console.log("📦 New audio chunk available:", event.data);
        };
      } else {
        console.warn("⚠️ mediaRecorder is not available");
      }

      setIsRecording(true);
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <div id="waveform"></div>
      <button onClick={handleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default RecorderPlayer;
