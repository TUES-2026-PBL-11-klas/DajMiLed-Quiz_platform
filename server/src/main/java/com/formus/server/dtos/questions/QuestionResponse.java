package com.formus.server.dtos.questions;

import java.util.List;

import com.formus.server.dtos.choices.ChoiceResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String text;
    private String type;
    private List<ChoiceResponse> choices;
}
