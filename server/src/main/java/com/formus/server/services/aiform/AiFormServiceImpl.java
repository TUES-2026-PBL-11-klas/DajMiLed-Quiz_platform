package com.formus.server.services.aiform;

import com.formus.server.client.aiform.AiQuestionClient;
import com.formus.server.client.aiform.dto.AiGenerateRequest;
import com.formus.server.client.aiform.dto.AiGenerateResponse;
import com.formus.server.client.aiform.dto.AiQuestion;
import com.formus.server.dtos.aiform.AiFormResponse;
import com.formus.server.dtos.aiform.CreateAiFormRequest;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Choice;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.models.CorrectAnswer;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.repositories.FormRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiFormServiceImpl implements AiFormService {

    private final FormRepository formRepository;
    private final CorrectAnswerRepository correctAnswerRepository;
    private final AiQuestionClient aiQuestionClient;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public AiFormResponse createAiForm(CreateAiFormRequest request, String token) {
        Long userId = jwtProvider.getIdFromToken(token);
        log.info("User {} is creating an AI formulated test: {}", userId, request.getTitle());

        AiGenerateResponse aiResponse;
        if (request.getQuestions() != null && request.getDifficulty() != null) {
            AiGenerateRequest aiRequest = new AiGenerateRequest(request.getContext(), request.getQuestions(),
                    request.getDifficulty());
            aiResponse = aiQuestionClient.generateQuestions(aiRequest);
        } else {
            AiGenerateRequest aiRequest = new AiGenerateRequest(request.getContext());
            aiResponse = aiQuestionClient.generateQuestions(aiRequest);
        }

        Form form = new Form(request.getTitle(), userId, request.getContext());

        if (aiResponse.getQuestions() != null && !aiResponse.getQuestions().isEmpty()) {
            for (AiQuestion aiQuestion : aiResponse.getQuestions()) {
                String type = determineQuestionType(aiQuestion);
                Question question = new Question(form, aiQuestion.getQuestionText(), type);

                if ("closed".equals(type) && aiQuestion.getOptions() != null) {
                    for (String optionText : aiQuestion.getOptions()) {
                        Choice choice = new Choice(question, optionText);
                        question.addChoice(choice);
                    }
                }
                form.addQuestion(question);
            }
        }

        Form savedForm = formRepository.save(form);
        for (int i = 0; i < aiResponse.getQuestions().size(); i++) {
            AiQuestion aiq = aiResponse.getQuestions().get(i);
            Question savedQuestion = savedForm.getQuestions().get(i);

            if (!"closed".equals(savedQuestion.getType())) {
                continue;
            }

            if (aiq.getCorrectAnswer() == null) {
                log.warn("No correct answer provided for question: {}", savedQuestion.getId());
                continue;
            }

            savedQuestion.getChoices().stream()
                    .filter(c -> c.getText().equalsIgnoreCase(aiq.getCorrectAnswer()))
                    .findFirst()
                    .ifPresentOrElse(
                            choice -> correctAnswerRepository.save(new CorrectAnswer(savedQuestion, choice)),
                            () -> log.warn("Correct answer '{}' not found in choices for question {}",
                                    aiq.getCorrectAnswer(), savedQuestion.getId()));
        }

        log.info("Successfully created AI form ID: {}", savedForm.getId());

        return new AiFormResponse(savedForm.getId(), savedForm.getTitle());
    }

    private String determineQuestionType(AiQuestion aiQuestion) {
        if (aiQuestion.getOptions() == null || aiQuestion.getOptions().isEmpty()) {
            return "open";
        }
        return "closed";
    }
}
