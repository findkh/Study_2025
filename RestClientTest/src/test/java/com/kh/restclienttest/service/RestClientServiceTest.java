package com.kh.restclienttest.service;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.kh.restclienttest.config.RestClientConfig;
import com.kh.restclienttest.dto.ResponseDTO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@RestClientTest(RestClientService.class)  // RestClientService 및 관련 빈만 로드
@Import(RestClientConfig.class)  // RestClientConfig를 수동으로 로드
class RestClientServiceTest {

    @Autowired
    private RestClientService restClientService; // RestClientConfig에서 설정한 RestClient 사용

    private WireMockServer wireMockServer;

    /**
     * 매 테스트 실행 전 WireMock 서버를 설정하여 8081 포트에서 실행
     */
    @BeforeEach
    void setUp() {
        // WireMock 서버를 8081 포트에서 실행하여 가짜 API 서버 역할 수행
        wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().port(8081));
        wireMockServer.start();
        WireMock.configureFor("localhost", 8081);
    }

    /**
     * 매 테스트 실행 후 WireMock 서버를 종료
     */
    @AfterEach
    void tearDown() {
        wireMockServer.stop();
    }

    /**
     * REST 요청이 성공적으로 수행되었을 때 응답을 검증하는 테스트
     */
    @Test
    void sendRestRequest_whenSuccess_shouldReturnResponse() {
        String mockResponse = "{\n" +
                "  \"status\": \"Success\",\n" +
                "  \"message\": \"OK\",\n" +
                "  \"output\": [\n" +
                "    {\n" +
                "      \"text\": \"테스트 데이터1\",\n" +
                "      \"start_ms\": 500,\n" +
                "      \"end_ms\": 2000\n" +
                "    },\n" +
                "    {\n" +
                "      \"text\": \"테스트 데이터2\",\n" +
                "      \"start_ms\": 2500,\n" +
                "      \"end_ms\": 4000\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        // WireMock을 이용해 /test 엔드포인트의 응답을 미리 정의
        wireMockServer.stubFor(WireMock.post("/test")
                .willReturn(WireMock.aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody(mockResponse)));

        // 요청 실행
        ResponseEntity<ResponseDTO> response = restClientService.sendRestRequest("{}");

        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); // 상태 코드 확인
        assertThat(response.getBody()).isNotNull(); // body가 null 인지 확인
        assertThat(response.getBody().getStatus()).isEqualTo("Success");
        assertThat(response.getBody().getMessage()).isEqualTo("OK");

    }

    @Test
    void formatRequestBody_whenValidData_shouldReturnJsonString() {
        // base64 인코딩된 테스트 데이터
        String base64Data = "dGVzdCBkYXRh";  // "test data"를 base64로 변환한 값

        // 요청 실행
        String requestBody = restClientService.formatRequestBody(base64Data);

        // 요청 바디가 JSON 형식으로 잘 변환됐는지 검증
        assertThat(requestBody).contains("\"audio\":\"dGVzdCBkYXRh\"");
        assertThat(requestBody).contains("\"format\":\"raw\"");
    }
}
