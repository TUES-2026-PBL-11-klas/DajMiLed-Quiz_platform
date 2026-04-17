package com.formus.server.dtos.aiform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiFormResponse {
    private Long id;
    private String title;
}
