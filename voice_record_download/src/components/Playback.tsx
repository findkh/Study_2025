import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { WAVESURFER_MESSAGE } from "../constants/Message";

// Props 타입 정의
interface PlaybackProps {
  url: string | null; // 오디오 URL
  isPlaying: boolean; // 재생 상태
  isEditing: boolean; // 드래그 가능 여부
  onFinish: () => void; // 재생 완료 시 호출되는 콜백
  onPlaybackStop: () => void; // 재생 멈출 때 호출되는 콜백
  type: keyof typeof WAVESURFER_MESSAGE; // 메시지 타입
}

const Playback: React.FC<PlaybackProps> = ({
  url,
  isPlaying,
  isEditing,
  onFinish,
  onPlaybackStop, // Stop 콜백 추가
  type,
}) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isWaveReady, setIsWaveReady] = useState(false);

  useEffect(() => {
    if (containerRef.current && url) {
      const regions = RegionsPlugin.create();
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#706d6b",
        progressColor: "#008bf5",
        cursorColor: "#d81313",
        cursorWidth: 1,
        height: 250,
        plugins: [regions],
      });

      waveSurfer.load(url);

      waveSurfer.on("finish", () => {
        onFinish(); // 재생 완료 시 부모 컴포넌트의 onFinish 호출
        onPlaybackStop(); // 재생 종료 시 부모에게 상태 전달
      });

      waveSurfer.on("ready", () => {
        setIsWaveReady(true);
      });

      waveSurferRef.current = waveSurfer;

      // 드래그 가능 여부를 isEditing에 따라 설정
      if (isEditing) {
        regions.enableDragSelection({
          color: "rgba(105, 120, 231, 0.1)",
        });
      }

      regions.on("region-created", (region) => {
        console.log("region", region.start, region.end);
        regions.getRegions().forEach((r) => {
          if (r.id !== region.id) r.remove();
        });

        waveSurfer.seekTo(region.start / waveSurfer.getDuration());
      });

      regions.on("region-out", (region) => {
        region.play();
        waveSurfer.pause();
        onPlaybackStop(); // 재생 멈췄을 때 상태 변경
      });

      return () => {
        waveSurfer.destroy();
        setIsWaveReady(false);
      };
    } else {
      if (waveSurferRef.current) {
        waveSurferRef.current.empty();
        setIsWaveReady(false);
      }
    }
  }, [url, isEditing]);

  useEffect(() => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.play();
      } else {
        waveSurferRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      style={{
        marginBottom: "1rem",
        backgroundColor: "rgb(246 246 246)",
        height: "250px",
        border: url || isWaveReady ? "none" : "2px dashed #ccc",
        position: "relative",
      }}
    >
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
