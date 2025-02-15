package com.kh.restclienttest.controller;

import com.kh.restclienttest.service.RestClientService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestClientController {

    private final RestClientService restClientService;

    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }

    @PostMapping("/restClientTest")
    public ResponseEntity<Map<String, Object>> getTestResult(@RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일을 업로드해야 합니다.");
        }

        return ResponseEntity.ok(restClientService.getTestResult(file));
    }


}
