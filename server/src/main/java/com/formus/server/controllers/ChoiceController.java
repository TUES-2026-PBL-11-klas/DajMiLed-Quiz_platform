package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.choices.CreateChoiceRequest;
import com.formus.server.models.Choice;
import com.formus.server.services.choice.ChoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/choices")
@RequiredArgsConstructor
public class ChoiceController {

    private final ChoiceService choiceService;

    @PostMapping
    public ResponseEntity<ApiResponse> createChoice(@Valid @RequestBody CreateChoiceRequest request) {
        Choice createdChoice = choiceService.createChoice(request);
        ApiResponse response = new ApiResponse(
                HttpStatus.CREATED.value(),
                "Choice created successfully",
                createdChoice.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
