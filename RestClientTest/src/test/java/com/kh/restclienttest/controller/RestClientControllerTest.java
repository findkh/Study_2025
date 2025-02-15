package com.kh.restclienttest.controller;

import static com.kh.restclienttest.mock.MockRestClientService.getMockFile;
import static com.kh.restclienttest.mock.MockRestClientService.getMockResponse;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.kh.restclienttest.service.RestClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RestClientController.class) //단위 테스트용, 서비스나 레파지토리 같은 빈은 로드하지 않음.
class RestClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean //Service 코드를 Mock객체로 만들어서 컨텍스트 등록
    private RestClientService restClientService;

    @Test
    void whenFileIsUploaded_shouldReturnStatusOkAndData() throws Exception {
        // Given - Mock 파일 생성
        MockMultipartFile file = (MockMultipartFile) getMockFile();

        // Given - Mock 데이터 설정 (MockRestClientService에서 제공하는 Mock 데이터 사용)
        when(restClientService.getTestResult(file)).thenReturn(getMockResponse());

        // When - MockMvc 요청 설정
        mockMvc.perform(multipart("/api/restClientTest")
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                // Then - 결과 검증
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result[0].text").value("테스트 데이터1"))
                .andExpect(jsonPath("$.result[0].start_ms").value(1380))
                .andExpect(jsonPath("$.result[0].end_ms").value(3680))
                .andExpect(jsonPath("$.result[1].text").value("테스트 데이터2"))
                .andExpect(jsonPath("$.result[1].start_ms").value(4270))
                .andExpect(jsonPath("$.result[1].end_ms").value(6510));
    }

    @Test
    void whenFileIsNotUploaded_shouldReturnBadRequest() throws Exception {
        // When - 파일 없이 요청을 보냄
        mockMvc.perform(multipart("/api/restClientTest")
                        .contentType(MediaType.MULTIPART_FORM_DATA))  // 파일 없이 요청
                // Then - BAD_REQUEST 상태 코드와 에러 메시지 검증
                .andExpect(status().isBadRequest());
    }
}
