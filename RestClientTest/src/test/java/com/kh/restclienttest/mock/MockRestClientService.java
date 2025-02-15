package com.kh.restclienttest.mock;

import com.kh.restclienttest.dto.Output;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import static java.util.Map.of;

public class MockRestClientService {

    // Mock return 데이터를 미리 생성해 두는 메서드
    public static Map<String, Object> getMockResponse() {
        List<Output> outputList = List.of(
                new Output("테스트 데이터1", 1380, 3680),
                new Output("테스트 데이터2", 4270, 6510)
        );

        return of("result", outputList);
    }

    // Mock MultipartFile 반환 메서드
    public static MultipartFile getMockFile() {
        return new MockMultipartFile(
                "file",
                "test-audio.raw",
                "audio/raw",
                "dummy audio content".getBytes()
        );
    }
}
