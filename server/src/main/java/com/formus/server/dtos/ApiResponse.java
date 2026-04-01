package com.formus.server.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ApiResponse {
    private final int status;
    private final String message;
    private final Object data;
}
