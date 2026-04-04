package com.formus.server.controllers;

import com.formus.server.dtos.ApiResponse;
import com.formus.server.dtos.forms.CreateFormRequest;
import com.formus.server.dtos.forms.FormResponse;
import com.formus.server.dtos.forms.FullFormResponse;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Form;
import com.formus.server.services.form.FormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping
    public ResponseEntity<ApiResponse> getForms(@PageableDefault Pageable pageable) {
        Page<FormResponse> forms = formService.getForms(pageable);
        ApiResponse response = new ApiResponse(
                HttpStatus.OK.value(),
                "Forms retrieved successfully",
                forms);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getForm(@PathVariable Long id) {
        FullFormResponse form = formService.getForm(id);
        ApiResponse response = new ApiResponse(
                HttpStatus.OK.value(),
                "Form retrieved successfully",
                form);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMyForms(@RequestHeader("Authorization") String authorizationHeader,
            @PageableDefault Pageable pageable) {
        String token = jwtProvider.extractTokenFromHeader(authorizationHeader);
        Page<FormResponse> forms = formService.getMyForms(token, pageable);
        ApiResponse response = new ApiResponse(
                HttpStatus.OK.value(),
                "My forms retrieved successfully",
                forms);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
