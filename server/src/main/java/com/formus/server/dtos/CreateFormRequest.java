package com.formus.server.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateFormRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Created by (user ID) is required")
    private Long createdBy;
}
