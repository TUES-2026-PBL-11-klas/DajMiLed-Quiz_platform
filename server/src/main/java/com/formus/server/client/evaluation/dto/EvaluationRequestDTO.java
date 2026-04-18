package com.formus.server.client.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.Builder;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
@Builder
public class EvaluationRequestDTO {

    private String context;

    private String question;

    private String answer;

    @JsonProperty("question_type")
    private String questionType;

    @JsonProperty("correct_answer")
    private String correctAnswer;

    @SuppressFBWarnings(value = "EI_EXPOSE_REP2")
    private List<String> options;

    public List<String> getOptions() {
        return options == null ? null : Collections.unmodifiableList(options);
    }

    public static class EvaluationRequestDTOBuilder {
        public EvaluationRequestDTOBuilder options(List<String> options) {
            this.options = options == null ? null : List.copyOf(options);
            return this;
        }
    }
}
