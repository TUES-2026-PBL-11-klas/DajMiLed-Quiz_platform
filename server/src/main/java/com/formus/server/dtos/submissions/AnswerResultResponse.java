package com.formus.server.dtos.submissions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResultResponse {
    private Long questionId;
    private boolean isCorrect;
    private Float score;
}
