package com.formus.server.services.correctanswers;

import com.formus.server.dtos.questions.AssignCorrectAnswerRequest;
import com.formus.server.models.Choice;
import com.formus.server.models.CorrectAnswer;
import com.formus.server.models.Question;
import com.formus.server.repositories.ChoiceRepository;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.repositories.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CorrectAnswerServiceImpl implements CorrectAnswerService {

    private final CorrectAnswerRepository correctAnswerRepository;
    private final QuestionRepository questionRepository;
    private final ChoiceRepository choiceRepository;

    @Override
    @Transactional
    public void assignCorrectAnswer(AssignCorrectAnswerRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        Choice choice = choiceRepository.findById(request.getChoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Choice not found"));

        if (!choice.getQuestion().getId().equals(question.getId())) {
            throw new IllegalArgumentException("Choice does not belong to the given question");
        }

        CorrectAnswer correctAnswer = correctAnswerRepository.findByQuestionId(question.getId())
                .orElse(new CorrectAnswer(question, choice));

        correctAnswer.setChoice(choice);
        correctAnswerRepository.save(correctAnswer);
    }
}
