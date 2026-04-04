package com.formus.server.dtos.forms;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateFormRequest {

    @NotBlank(message = "Title is required")
    private String title;
}
