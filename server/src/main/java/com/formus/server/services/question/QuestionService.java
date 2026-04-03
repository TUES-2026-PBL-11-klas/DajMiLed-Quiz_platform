package com.formus.server.services.question;

import com.formus.server.dtos.CreateQuestionRequest;
import com.formus.server.models.Question;

public interface QuestionService {
    Question createQuestion(CreateQuestionRequest request);
}
