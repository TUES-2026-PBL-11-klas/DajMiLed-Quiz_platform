package com.formus.server.services.correctanswers;

import com.formus.server.dtos.questions.AssignCorrectAnswerRequest;

public interface CorrectAnswerService {
    void assignCorrectAnswer(AssignCorrectAnswerRequest request);
}
