package com.formus.server.client.aiform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiGenerateResponse {

    private List<AiQuestion> questions;

    public AiGenerateResponse(List<AiQuestion> questions) {
        this.questions = questions == null ? null : List.copyOf(questions);
    }

    public List<AiQuestion> getQuestions() {
        return questions == null ? null : List.copyOf(questions);
    }

    public void setQuestions(List<AiQuestion> questions) {
        this.questions = questions == null ? null : List.copyOf(questions);
    }
}
