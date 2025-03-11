package com.kh.binarywebsocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        logger.info("🟢 WebSocket 연결 요청: {}", request.getURI()); // 연결 시도 로그
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        if (exception == null) {
            logger.info("✅ WebSocket 핸드셰이크 성공: {}", request.getURI()); // 연결 성공 로그
        } else {
            logger.error("❌ WebSocket 핸드셰이크 실패: {}", exception.getMessage()); // 연결 실패 로그
        }
    }
}
