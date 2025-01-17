import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { WAVESURFER_MESSAGE } from "../constants/Message";

// Props 타입 정의
interface PlaybackProps {
  url: string | null; // 오디오 URL
  isPlaying: boolean; // 재생 상태
  onFinish: () => void; // 재생 완료 시 호출되는 콜백
  type: keyof typeof WAVESURFER_MESSAGE; // 메시지 타입
}

const Playback: React.FC<PlaybackProps> = ({ url, isPlaying, onFinish, type }) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isWaveReady, setIsWaveReady] = useState(false);

  useEffect(() => {
    console.log(type);
  }, [type]);

  // WaveSurfer 초기화 및 오디오 로드
  useEffect(() => {
    if (containerRef.current && url) {
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#706d6b",
        progressColor: "#008bf5",
        cursorColor: "#d81313",
        cursorWidth: 1,
        height: 250,
      });

      // 오디오 URL을 WaveSurfer에 로드
      waveSurfer.load(url);

      // 재생 완료 이벤트 처리
      waveSurfer.on("finish", () => {
        onFinish(); // 재생 완료 시 부모 컴포넌트의 onFinish 호출
      });

      // 파형이 준비되었을 때 상태 업데이트
      waveSurfer.on("ready", () => {
        setIsWaveReady(true);
      });

      waveSurferRef.current = waveSurfer;

      // 컴포넌트 언마운트 시 WaveSurfer 인스턴스 제거
      return () => {
        waveSurfer.destroy();
        setIsWaveReady(false); // 컴포넌트 언마운트 시 초기화
      };
    } else {
      // url이 없을 때 WaveSurfer 초기화
      if (waveSurferRef.current) {
        waveSurferRef.current.empty();
        setIsWaveReady(false); // URL이 없을 때 상태 초기화
      }
    }
  }, [url]); // URL이 변경될 때마다 새로운 오디오를 로드

  // play 상태가 변경될 때마다 WaveSurfer에서 play/pause 처리
  useEffect(() => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.play();
      } else {
        waveSurferRef.current.pause();
      }
    }
  }, [isPlaying]); // isPlaying 상태 변경 시 재생/일시정지 처리

  return (
    <div
      ref={containerRef} // WaveSurfer가 렌더링될 컨테이너
      style={{
        marginBottom: "1rem",
        backgroundColor: "rgb(246 246 246)",
        height: "250px", // 고정된 높이를 설정
        border: url || isWaveReady ? "none" : "2px dashed #ccc", // URL 없을 때 테두리 표시
        position: "relative",
      }}
    >
      {/* 안내 메시지 (항상 렌더링) */}
      {!isWaveReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#aaa",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {WAVESURFER_MESSAGE[type]}
        </div>
      )}
    </div>
  );
};

export default Playback;
