package com.formus.server.dtos.questions;

import java.util.List;

import com.formus.server.dtos.choices.ChoiceResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuestionResponse {
    private Long id;
    private String text;
    private String type;
    private List<ChoiceResponse> choices;

    public QuestionResponse(Long id, String text, String type, List<ChoiceResponse> choices) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.choices = choices == null ? List.of() : List.copyOf(choices);
    }
}
