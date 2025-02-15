package com.kh.restclienttest.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.restclienttest.filter.RestLogFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@RequiredArgsConstructor
public class RestClientConfig {
    private final ObjectMapper objectMapper;

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .requestInterceptor(new RestLogFilter(objectMapper))
                .build();
    }
}
