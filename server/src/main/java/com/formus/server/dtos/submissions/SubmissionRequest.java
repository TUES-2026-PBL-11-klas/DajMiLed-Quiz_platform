package com.formus.server.dtos.submissions;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class SubmissionRequest {

    @NotNull(message = "Form ID is required")
    private Long formId;

    @NotEmpty(message = "Answers list cannot be empty")
    @Valid
    private List<AnswerRequest> answers;

    public List<AnswerRequest> getAnswers() {
        return answers == null ? null : List.copyOf(answers);
    }

    public void setAnswers(List<AnswerRequest> answers) {
        this.answers = answers == null ? null : List.copyOf(answers);
    }

    public SubmissionRequest(Long formId, List<AnswerRequest> answers) {
        this.formId = formId;
        this.answers = answers == null ? null : List.copyOf(answers);
    }
}
