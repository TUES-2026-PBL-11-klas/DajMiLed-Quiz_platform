package com.formus.server.dtos.aiform;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAiFormRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Context is required")
    @Size(min = 30, message = "Context must be at least 30 characters")
    private String context;
}
