package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.aiform.AiFormResponse;
import com.formus.server.dtos.aiform.CreateAiFormRequest;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.services.aiform.AiFormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-form")
@RequiredArgsConstructor
public class AiFormController {

    private final AiFormService aiFormService;
    private final JwtProvider jwtProvider;

    @PostMapping
    public ResponseEntity<ApiResponse> createAiForm(
            @Valid @RequestBody CreateAiFormRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = jwtProvider.extractTokenFromHeader(authorizationHeader);
        AiFormResponse responseData = aiFormService.createAiForm(request, token);

        ApiResponse response = new ApiResponse(
                HttpStatus.CREATED.value(),
                "AI Form created successfully",
                responseData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
