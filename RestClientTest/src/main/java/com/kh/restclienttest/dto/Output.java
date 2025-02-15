package com.kh.restclienttest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Output {
    public String text;
    public Integer start_ms;
    public Integer end_ms;
}
