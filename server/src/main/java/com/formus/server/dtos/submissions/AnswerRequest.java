package com.formus.server.dtos.submissions;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String answerText;

    private Long selectedChoiceId;
}
