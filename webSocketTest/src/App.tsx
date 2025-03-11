import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function App() {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null); // STOMP 클라이언트 참조

  useEffect(() => {
    console.log("🛠️ WebSocket 연결 시도...");

    const socket = new SockJS("/socket");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 5초 후 재연결 시도
      debug: (msg) => console.log(new Date(), "[STOMP]", msg),
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");
        setConnected(true);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 오류:", frame.headers["message"], frame.body);
        setConnected(false);
      },
      onWebSocketClose: () => {
        console.warn("⚠️ WebSocket 연결 종료");
        setConnected(false);
      },
    });

    client.activate(); // WebSocket 연결
    stompClientRef.current = client;

    return () => {
      console.log("🛑 WebSocket 연결 해제");
      if (stompClientRef.current) {
        stompClientRef.current.deactivate().then(() => {
          console.log("🔌 연결이 정상적으로 종료됨");
        });
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket 연결 상태</h2>
      <p>{connected ? "🟢 연결됨" : "🔴 연결 안됨"}</p>
    </div>
  );
}
