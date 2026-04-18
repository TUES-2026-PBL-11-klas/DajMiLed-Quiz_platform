package com.formus.server.client.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponseDTO {

    private Float score;

    private String feedback;

    @JsonProperty("is_correct")
    private boolean isCorrect;
}
