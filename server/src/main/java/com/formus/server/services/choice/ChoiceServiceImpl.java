package com.formus.server.services.choice;

import com.formus.server.dtos.CreateChoiceRequest;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.models.Choice;
import com.formus.server.models.Question;
import com.formus.server.repositories.ChoiceRepository;
import com.formus.server.repositories.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChoiceServiceImpl implements ChoiceService {

    private final ChoiceRepository choiceRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public Choice createChoice(CreateChoiceRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Question not found with id: " + request.getQuestionId()));

        Choice choice = new Choice(question, request.getText());
        return choiceRepository.save(choice);
    }
}
