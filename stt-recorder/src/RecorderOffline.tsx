import { useRef, useState } from "react";

export default function RecorderOfflineFixed() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pcmUrl, setPcmUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstart = () => setIsRecording(true);
      recorder.onstop = () => setIsRecording(false);

      recorder.start();
      console.log("Recording started");
    } catch (err) {
      console.error("녹음 실패:", err);
      alert("마이크 접근이 필요합니다.");
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    recorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();

      const audioCtx = new AudioContext();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        1,
        Math.ceil((decoded.length * 8000) / decoded.sampleRate),
        8000
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decoded;
      source.connect(offlineCtx.destination);
      source.start();

      const rendered = await offlineCtx.startRendering();
      const data = rendered.getChannelData(0);
      const pcm = new Int16Array(data.length);
      for (let i = 0; i < data.length; i++) {
        let s = Math.max(-1, Math.min(1, data[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // WAV 헤더 붙이기
      const wavBuffer = encodeWAV(pcm, 8000, 1);
      setAudioUrl(
        URL.createObjectURL(new Blob([wavBuffer], { type: "audio/wav" }))
      );
      setPcmUrl(
        URL.createObjectURL(
          new Blob([pcm.buffer], { type: "application/octet-stream" })
        )
      );

      audioCtx.close();
    };

    recorderRef.current.stop();
    console.log("Recording stopped");
  };

  const toggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div>
      <button onClick={toggle}>{isRecording ? "⏹ Stop" : "🎤 Start"}</button>
      {audioUrl && <audio controls src={audioUrl}></audio>}
      {pcmUrl && (
        <a href={pcmUrl} download="offline.pcm">
          💾 PCM 다운로드
        </a>
      )}
    </div>
  );
}

// WAV 인코딩 함수
function encodeWAV(
  samples: Int16Array,
  sampleRate: number,
  numChannels: number
) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++)
    view.setInt16(offset + i * 2, samples[i], true);

  return buffer;
}
