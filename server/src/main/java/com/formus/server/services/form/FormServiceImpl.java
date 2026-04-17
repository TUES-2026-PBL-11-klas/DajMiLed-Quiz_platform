package com.formus.server.services.form;

import com.formus.server.dtos.forms.CreateFormRequest;
import com.formus.server.dtos.forms.FormResponse;
import com.formus.server.dtos.forms.FullFormResponse;
import com.formus.server.dtos.questions.QuestionResponse;
import com.formus.server.dtos.choices.ChoiceResponse;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Choice;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.repositories.FormRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FormServiceImpl implements FormService {

    private final FormRepository formRepository;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public Form createForm(CreateFormRequest request, String token) {
        Long id = jwtProvider.getIdFromToken(token);
        Form form = new Form(request.getTitle(), id, request.getContext());
        return formRepository.save(form);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FormResponse> getForms(Pageable pageable) {
        return formRepository.findAll(pageable).map(FormResponse::new);
    }

    @Override
    @Transactional(readOnly = true)
    public FullFormResponse getForm(Long id) {
        Form form = formRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found"));
        List<QuestionResponse> questionResponses = new ArrayList<>();
        for (Question question : form.getQuestions()) {
            List<ChoiceResponse> choiceResponses = new ArrayList<>();

            for (Choice choice : question.getChoices()) {
                choiceResponses.add(new ChoiceResponse(choice.getId(), choice.getText()));
            }

            questionResponses.add(
                    new QuestionResponse(
                            question.getId(),
                            question.getText(),
                            question.getType(),
                            choiceResponses));
        }

        return new FullFormResponse(
                form.getId(),
                form.getTitle(),
                form.getCreatedBy(),
                questionResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FormResponse> getMyForms(String token, Pageable pageable) {
        Long id = jwtProvider.getIdFromToken(token);
        return formRepository.findByCreatedBy(id, pageable).map(FormResponse::new);
    }
}
