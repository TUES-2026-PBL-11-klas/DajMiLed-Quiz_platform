package com.formus.server.dtos.forms;

import java.util.List;

import com.formus.server.dtos.questions.QuestionResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FullFormResponse {
    private Long id;
    private String title;
    private Long createdBy;
    private List<QuestionResponse> questions;
}
