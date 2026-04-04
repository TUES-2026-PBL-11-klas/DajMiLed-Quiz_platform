package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.CreateFormRequest;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Form;
import com.formus.server.services.form.FormService;
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
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;
    private final JwtProvider jwtProvider;

    @PostMapping
    public ResponseEntity<ApiResponse> createForm(@Valid @RequestBody CreateFormRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = jwtProvider.extractTokenFromHeader(authorizationHeader);
        Form createdForm = formService.createForm(request, token);
        ApiResponse response = new ApiResponse(
                HttpStatus.CREATED.value(),
                "Form created successfully",
                createdForm.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
