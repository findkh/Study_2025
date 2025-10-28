// import { useEffect, useRef, useState } from "react";

import RecorderOffline from "./RecorderOffline";
import RecorderWorklet from "./RecorderWorklet";

// export default function App() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [pcmBlobUrl, setPcmBlobUrl] = useState<string | null>(null); // 원본 PCM Blob URL
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const workletNodeRef = useRef<AudioWorkletNode | null>(null);
//   const recordedChunksRef = useRef<Int16Array[]>([]);

//   useEffect(() => {
//     return () => {
//       audioContextRef.current?.close();
//     };
//   }, []);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const audioContext = new AudioContext({ sampleRate: 8000 }); // STT 서버 스펙
//     await audioContext.audioWorklet.addModule(
//       "/worklets/StreamingWorkletProcessor.js"
//     );

//     const source = audioContext.createMediaStreamSource(stream);
//     const workletNode = new AudioWorkletNode(
//       audioContext,
//       "StreamingWorkletProcessor"
//     );

//     workletNode.port.onmessage = (event) => {
//       recordedChunksRef.current.push(event.data); // Int16Array
//     };

//     source.connect(workletNode);
//     workletNode.connect(audioContext.destination);

//     audioContextRef.current = audioContext;
//     workletNodeRef.current = workletNode;
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     if (!audioContextRef.current) return;

//     audioContextRef.current.close();
//     setIsRecording(false);

//     // 모든 PCM 데이터 합치기
//     const chunks = recordedChunksRef.current;
//     const totalLength = chunks.reduce((acc, cur) => acc + cur.length, 0);
//     const merged = new Int16Array(totalLength);
//     let offset = 0;
//     chunks.forEach((chunk) => {
//       merged.set(chunk, offset);
//       offset += chunk.length;
//     });

//     // WAV Blob
//     const wavBlob = encodeWAV(merged, 8000);
//     setAudioUrl(URL.createObjectURL(wavBlob));

//     // PCM Blob (원본 데이터)
//     const pcmBlob = new Blob([merged.buffer], {
//       type: "application/octet-stream",
//     });
//     setPcmBlobUrl(URL.createObjectURL(pcmBlob));

//     // ✅ 여기서 PCM 스펙 콘솔 출력
//     console.log("🔹 PCM 분석 결과");
//     console.log("샘플 수:", merged.length);
//     console.log("재생 시간(초, 8kHz 기준):", (merged.length / 8000).toFixed(2));
//     console.log("최대값:", Math.max(...merged));
//     console.log("최소값:", Math.min(...merged));
//     console.log("비트 깊이 예상:", "16bit");
//     console.log("채널:", "Mono");

//     recordedChunksRef.current = [];
//   };

//   const encodeWAV = (samples: Int16Array, sampleRate: number) => {
//     const buffer = new ArrayBuffer(44 + samples.length * 2);
//     const view = new DataView(buffer);

//     const writeString = (offset: number, str: string) => {
//       for (let i = 0; i < str.length; i++)
//         view.setUint8(offset + i, str.charCodeAt(i));
//     };

//     writeString(0, "RIFF");
//     view.setUint32(4, 36 + samples.length * 2, true);
//     writeString(8, "WAVE");
//     writeString(12, "fmt ");
//     view.setUint32(16, 16, true);
//     view.setUint16(20, 1, true);
//     view.setUint16(22, 1, true);
//     view.setUint32(24, sampleRate, true);
//     view.setUint32(28, sampleRate * 2, true);
//     view.setUint16(32, 2, true);
//     view.setUint16(34, 16, true);
//     writeString(36, "data");
//     view.setUint32(40, samples.length * 2, true);

//     let offset = 44;
//     for (let i = 0; i < samples.length; i++, offset += 2) {
//       view.setInt16(offset, samples[i], true);
//     }

//     return new Blob([view], { type: "audio/wav" });
//   };

//   return (
//     <div style={{ padding: "40px", textAlign: "center" }}>
//       <h1>🎙 8kHz PCM Recorder</h1>
//       <button onClick={isRecording ? stopRecording : startRecording}>
//         {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
//       </button>

//       {audioUrl && (
//         <div style={{ marginTop: "20px" }}>
//           <audio controls src={audioUrl}></audio>
//           <p>✅ 녹음 완료 (8kHz WAV)</p>
//           {pcmBlobUrl && (
//             <a href={pcmBlobUrl} download="recording.pcm">
//               💾 원본 PCM 다운로드
//             </a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

export default function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>🎙 녹음 방식 테스트</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>1️⃣ Worklet 기반 녹음</h2>
        <RecorderWorklet />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>2️⃣ MediaRecorder + OfflineAudioContext (8kHz PCM)</h2>
        <RecorderOffline />
      </section>
    </div>
  );
}
