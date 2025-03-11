import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Handlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: string, topic: string) => void;
  onError?: (message: string) => void;
}

class WebSocketService {
  private client: Client | null = null;
  private isDisconnected: boolean = false;

  connect(endpoint: string, handlers: Handlers): void {
    if (this.client) {
      this.disconnect();
    }

    const accessToken = localStorage.getItem("accessToken");
    console.log(`[@WebSocket] 연결 시도: ${endpoint}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (msg) => console.log(`[@WebSocket DEBUG] ${msg}`),
      reconnectDelay: 3000,

      onConnect: (frame) => {
        console.log("[@WebSocket] 연결 성공:", frame);
        this.isDisconnected = false;
        handlers.onConnect?.();
      },

      onDisconnect: () => {
        console.log(
          "[@WebSocket] Disconnected, isDisconnected 변경 전:",
          this.isDisconnected
        );
        if (!this.isDisconnected) {
          handlers.onDisconnect?.();
          this.isDisconnected = true;
          console.log(
            "[@WebSocket] 연결 해제, isDisconnected 변경 후:",
            this.isDisconnected
          );
        }
      },

      onStompError: (frame) => {
        console.error("[@WebSocket] STOMP 오류 발생:", frame);
        handlers.onError?.(frame.headers["message"] || "알 수 없는 오류");
      },

      onWebSocketError: (error) => {
        console.error("[@WebSocket] WebSocket 오류 발생:", error);
        handlers.onError?.("웹소켓 연결 오류 발생");
      },

      onWebSocketClose: () => {
        console.log("[@WebSocket] WebSocket 연결 종료됨");
        this.isDisconnected = true;
      },
    });

    this.client.activate();
  }

  async disconnect(): Promise<void> {
    if (this.isDisconnected) return;
    console.log("[@WebSocket] 🔌 연결 해제");
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isDisconnected = true;
    }
  }
}

export const webStompService = new WebSocketService();
