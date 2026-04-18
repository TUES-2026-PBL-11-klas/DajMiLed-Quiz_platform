package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.questions.AssignCorrectAnswerRequest;
import com.formus.server.services.correctanswers.CorrectAnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/correct-answers")
@RequiredArgsConstructor
public class CorrectAnswerController {

    private final CorrectAnswerService correctAnswerService;

    @PostMapping
    public ResponseEntity<ApiResponse> assignCorrectAnswer(@Valid @RequestBody AssignCorrectAnswerRequest request) {
        correctAnswerService.assignCorrectAnswer(request);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Correct answer assigned successfully", null);
        return ResponseEntity.ok(response);
    }
}
