package com.formus.server.client.aiform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class AiQuestion {
    @JsonProperty("question_text")
    private final String questionText;
    private final List<String> options;
    @JsonProperty("correct_answer")
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
