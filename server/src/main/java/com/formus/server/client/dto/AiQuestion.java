package com.formus.server.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class AiQuestion {
    private final String questionText;
    private final List<String> options;
    private final String correctAnswer;
    private final String explanation;

    public AiQuestion(String questionText,
            List<String> options,
            String correctAnswer,
            String explanation) {

        this.questionText = questionText;
        this.options = options == null ? List.of() : List.copyOf(options);
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }

    public List<String> getOptions() {
        return options;
    }
}
