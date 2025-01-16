import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformContianer, Wave } from "./Waveform.styled";

interface WaveformProps {
  audioURL: string;
}

const Waveform: React.FC<WaveformProps> = ({ audioURL }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (audioURL && waveformRef.current) {
      // Wavesurfer 인스턴스 생성
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#C4C4C4",
        progressColor: "#FE6E00",
        cursorColor: "#ddd5e9", //"transparent",
        barGap: 1,
        barWidth: 3,
        height: 80,
        mediaControls: true,
        autoplay: false,
        interact: true,
        dragToSeek: true,
      });

      waveSurferRef.current.load(audioURL);

      // 클린업 함수
      return () => {
        waveSurferRef.current?.destroy();
      };
    }
  }, [audioURL]);

  return (
    <WaveformContianer>
      <Wave ref={waveformRef} />
    </WaveformContianer>
  );
};

export default Waveform;
