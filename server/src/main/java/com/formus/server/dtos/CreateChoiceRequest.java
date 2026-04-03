package com.formus.server.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChoiceRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Choice text is required")
    private String text;
}
