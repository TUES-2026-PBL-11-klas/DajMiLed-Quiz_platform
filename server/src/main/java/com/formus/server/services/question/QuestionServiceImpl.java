package com.formus.server.services.question;

import com.formus.server.dtos.questions.CreateQuestionRequest;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.repositories.FormRepository;
import com.formus.server.repositories.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final FormRepository formRepository;

    @Override
    @Transactional
    public Question createQuestion(CreateQuestionRequest request) {
        Form form = formRepository.findById(request.getFormId())
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + request.getFormId()));

        Question question = new Question(form, request.getText(),
                com.formus.server.models.QuestionType.fromString(request.getType()));
        return questionRepository.save(question);
    }
}
