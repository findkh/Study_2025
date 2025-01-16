// src/components/Playback.tsx
import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

interface PlaybackProps {
  url: string;
}

const Playback: React.FC<PlaybackProps> = ({ url }) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: "#playback",
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url,
    });
    waveSurferRef.current = waveSurfer;

    return () => {
      waveSurfer.destroy();
    };
  }, [url]);

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      if (waveSurferRef.current.isPlaying()) {
        waveSurferRef.current.pause();
      } else {
        waveSurferRef.current.play();
      }
    }
  };

  return (
    <div>
      <div
        id="playback"
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      ></div>
      <button onClick={handlePlayPause}>Play / Pause</button>
    </div>
  );
};

export default Playback;
