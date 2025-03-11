package com.kh.binarywebsocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

@RestController
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, WebSocketSession> userSessions = new HashMap<>();

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // WebSocket 연결이 되었을 때 클라이언트에서 init 메시지를 받아 처리
    @SendToUser("/status/init")
    public void handleInitMessage(String userId, WebSocketSession session) {
        System.out.println("Received init message from client with userId: " + userId);

        // 클라이언트에서 받은 UUID로 사용자 정보를 저장
        userSessions.put(userId, session);

        System.out.println("New user connected with UUID: " + userId);

        // 연결 성공 후 바이너리 데이터 수신을 위한 처리 (여기서는 예시로 성공 메시지를 전송)
        messagingTemplate.convertAndSendToUser(userId, "/status", "Connected");
    }
}
