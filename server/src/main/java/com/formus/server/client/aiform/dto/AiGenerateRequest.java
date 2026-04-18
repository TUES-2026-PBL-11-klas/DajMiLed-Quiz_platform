package com.formus.server.client.aiform.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiGenerateRequest {

    private String context;

    @JsonProperty("num_questions")
    private int numQuestions;

    private String difficulty;

    public AiGenerateRequest(String context) {
        this.context = context;
        this.numQuestions = 3;
        this.difficulty = "intermediate";
    }
}
