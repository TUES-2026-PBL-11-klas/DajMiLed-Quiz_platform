package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.submissions.SubmissionRequest;
import com.formus.server.dtos.submissions.SubmissionResponse;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.services.submissions.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final JwtProvider jwtProvider;

    @PostMapping
    public ResponseEntity<ApiResponse> submitForm(@Valid @RequestBody SubmissionRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = jwtProvider.extractTokenFromHeader(authorizationHeader);
        SubmissionResponse submissionResponse = submissionService.submitForm(request, token);

        ApiResponse response = new ApiResponse(
                HttpStatus.OK.value(),
                "Form submitted successfully",
                submissionResponse);

        return ResponseEntity.ok(response);
    }
}
