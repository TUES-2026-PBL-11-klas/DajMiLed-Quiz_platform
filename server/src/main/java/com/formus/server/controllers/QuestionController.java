package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.questions.CreateQuestionRequest;
import com.formus.server.models.Question;
import com.formus.server.services.question.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<ApiResponse> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        System.out.println(request);
        Question createdQuestion = questionService.createQuestion(request);
        ApiResponse response = new ApiResponse(
                HttpStatus.CREATED.value(),
                "Question created successfully",
                createdQuestion.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
