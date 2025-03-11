import { useEffect, useState } from "react";
import { webStompService } from "./service/WebSocketService";

export default function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    webStompService.connect("/socket", {
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onError: (message) => console.error("WebSocket Error:", message),
    });

    return () => {
      webStompService.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket 연결 상태</h2>
      <p>{connected ? "🟢 연결됨" : "🔴 연결 안됨"}</p>
    </div>
  );
}
