package com.formus.server.dtos.forms;

import java.util.List;

import com.formus.server.dtos.questions.QuestionResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FullFormResponse {
    private Long id;
    private String title;
    private Long createdBy;
    private List<QuestionResponse> questions;

    public FullFormResponse(Long id, String title, Long createdBy, List<QuestionResponse> questions) {
        this.id = id;
        this.title = title;
        this.createdBy = createdBy;
        this.questions = questions == null ? List.of() : List.copyOf(questions);
    }
}
