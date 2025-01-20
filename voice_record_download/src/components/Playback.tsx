import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { WAVESURFER_MESSAGE } from "../constants/Message";

interface PlaybackProps {
  url: string | null;
  isPlaying: boolean;
  isEditing: boolean;
  onFinish: () => void;
  onPlaybackStop: () => void;
  type: keyof typeof WAVESURFER_MESSAGE;
  onRegionChange: (region: { start: number; end: number }) => void; // 부모에서 전달받은 콜백
}

const Playback: React.FC<PlaybackProps> = ({
  url,
  isPlaying,
  isEditing,
  onFinish,
  onPlaybackStop,
  type,
  onRegionChange,
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
        onFinish();
        onPlaybackStop();
      });

      waveSurfer.on("ready", () => {
        setIsWaveReady(true);
      });

      waveSurferRef.current = waveSurfer;

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

        // 부모에게 starttime과 endtime 전달
        if (onRegionChange) {
          onRegionChange({ start: region.start, end: region.end });
        }
      });

      return () => {
        waveSurfer.destroy();
        setIsWaveReady(false);
      };
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
    <div ref={containerRef} style={{ height: "250px" }}>
      {!isWaveReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#aaa",
          }}
        >
          {WAVESURFER_MESSAGE[type]}
        </div>
      )}
    </div>
  );
};

export default Playback;
