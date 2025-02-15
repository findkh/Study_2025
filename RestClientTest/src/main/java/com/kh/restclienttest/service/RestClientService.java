package com.kh.restclienttest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.restclienttest.dto.ResponseDTO;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
@RequiredArgsConstructor
public class RestClientService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> getTestResult(MultipartFile file) {

        // file -> base64
        String fileStr = convertFileToBase64(file);

        // 요청 body 형식으로 변환
        String requestBody = formatRequestBody(fileStr);

        // rest client 요청
        ResponseEntity<ResponseDTO> response = sendRestRequest(requestBody);

        // json -> map
        Map<String, Object> result = new HashMap<>();
        if (response.getBody() != null && response.getBody().getOutput() != null) {
            result.put("result", response.getBody().getOutput());
        } else {
            result.put("result", Collections.emptyList());
        }

        return result;
    }

    // REST client 요청을 처리하는 함수
    public ResponseEntity<ResponseDTO> sendRestRequest(String requestBody) {
        String baseUrl = "http://localhost:8081";
        return restClient
                .method(HttpMethod.POST)
                .uri(baseUrl + "/test")
                .header("Authorization", "Bearer abcdefg")
                .body(requestBody)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {});
    }

    // 요청 body로 변경
    public String formatRequestBody(String fileStr) {
        Map<String, Object> bodyContent = new HashMap<>();
        Map<String, Object> inputData = new HashMap<>();
        inputData.put("audio", fileStr);
        inputData.put("file", "");
        inputData.put("format", "raw");

        bodyContent.put("input", inputData);
        bodyContent.put("client_info", "");

        try {
            return objectMapper.writeValueAsString(bodyContent);
        } catch (JsonProcessingException e) {
            log.error("JSON 변환 오류", e);
            throw new RuntimeException("JSON 변환 오류", e);
        }
    }

    // 파일을 base64 문자열로 변환
    public String convertFileToBase64(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            return Base64.getEncoder().encodeToString(fileBytes);
        } catch (IOException e) {
            log.error("파일 변환 오류", e);
            throw new RuntimeException("파일 변환 오류", e);
        }
    }
}
