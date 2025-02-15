package com.kh.restclienttest.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class RestLogFilter implements ClientHttpRequestInterceptor {

    private final ObjectMapper objectMapper;

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        long start = System.currentTimeMillis();
        long duration = System.currentTimeMillis() - start;
        ClientHttpResponse response = execution.execute(request, body);

        logRequestAndResponse(request, response, duration);

        return response; // 응답을 그대로 반환
    }

    // 요청 및 응답 정보를 로그로 기록
    private void logRequestAndResponse(HttpRequest request, ClientHttpResponse response, long duration) {
        try {
            log.info("Request URI: {}, Duration: {}ms", request.getURI(), duration);
            log.info("Response Status Code: {}", response.getStatusCode());
        } catch (IOException e) {
            e.getStackTrace();
        }
    }

}
