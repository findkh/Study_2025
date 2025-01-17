import { useCallback } from "react";
import {
  fetchBlob,
  convertWebMToWav,
  convertWavToMp3,
} from "../utils/audioUtils";

const useDownload = (url: string | null) => {
  const downloadFile = useCallback(
    async (format: "webm" | "wav" | "mp3") => {
      if (!url) return;

      const a = document.createElement("a");
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1]?.split(".")[0] || "file";

      try {
        const blob = await fetchBlob(url);

        if (format === "webm") {
          a.href = URL.createObjectURL(blob);
          a.download = `${fileName}.webm`;
        } else if (format === "wav") {
          const wavBlob = await convertWebMToWav(blob);
          a.href = URL.createObjectURL(wavBlob);
          a.download = `${fileName}.wav`;
        } else if (format === "mp3") {
          const wavBlob = await convertWebMToWav(blob);
          const mp3Blob = await convertWavToMp3(wavBlob);
          a.href = URL.createObjectURL(mp3Blob);
          a.download = `${fileName}.mp3`;
        }

        a.click();
      } catch (error) {
        console.error("Error during file download:", error);
      }
    },
    [url]
  );

  return { downloadFile };
};

export default useDownload;
