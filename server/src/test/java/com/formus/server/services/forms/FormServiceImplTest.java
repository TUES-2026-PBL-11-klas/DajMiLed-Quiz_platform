package com.formus.server.services.forms;

import com.formus.server.dtos.forms.CreateFormRequest;
import com.formus.server.dtos.forms.FormResponse;
import com.formus.server.dtos.forms.FullFormResponse;
import com.formus.server.models.Choice;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.repositories.FormRepository;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.services.form.FormServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FormServiceImplTest {

    @Mock
    private FormRepository formRepository;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private FormServiceImpl formService;

    @Test
    void createForm_returnsForm() {
        CreateFormRequest request = new CreateFormRequest();
        request.setTitle("Test Title");
        String token = "mockToken";

        when(jwtProvider.getIdFromToken(token)).thenReturn(1L);
        when(formRepository.save(any(Form.class))).thenAnswer(i -> i.getArgument(0));

        Form result = formService.createForm(request, token);

        assertNotNull(result);
        assertEquals("Test Title", result.getTitle());
        assertEquals(1L, result.getCreatedBy());
        verify(jwtProvider).getIdFromToken(token);
        verify(formRepository).save(any(Form.class));
    }

    @Test
    void getForms_returnsPage() {
        Pageable pageable = Pageable.unpaged();
        Form form = new Form("Title", 1L);
        Page<Form> page = new PageImpl<>(List.of(form));

        when(formRepository.findAll(pageable)).thenReturn(page);

        Page<FormResponse> result = formService.getForms(pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Title", result.getContent().get(0).getTitle());
        verify(formRepository).findAll(pageable);
    }

    @Test
    void getMyForms_returnsPage() {
        String token = "mockToken";
        Pageable pageable = Pageable.unpaged();
        Form form = new Form("My Title", 1L);
        Page<Form> page = new PageImpl<>(List.of(form));

        when(jwtProvider.getIdFromToken(token)).thenReturn(1L);
        when(formRepository.findByCreatedBy(1L, pageable)).thenReturn(page);

        Page<FormResponse> result = formService.getMyForms(token, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("My Title", result.getContent().get(0).getTitle());
        verify(jwtProvider).getIdFromToken(token);
        verify(formRepository).findByCreatedBy(1L, pageable);
    }

    @Test
    void getForm_returnsFullFormResponse() {
        Form form = new Form("Form", 1L);
        ReflectionTestUtils.setField(form, "id", 1L);

        Question question = new Question(form, "Q1", "CLOSED");
        ReflectionTestUtils.setField(question, "id", 10L);
        form.addQuestion(question);

        Choice choice = new Choice(question, "A");
        ReflectionTestUtils.setField(choice, "id", 100L);
        question.addChoice(choice);

        when(formRepository.findByIdWithQuestions(1L)).thenReturn(Optional.of(form));

        FullFormResponse response = formService.getForm(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1, response.getQuestions().size());
        assertEquals(1, response.getQuestions().get(0).getChoices().size());
        assertEquals("A", response.getQuestions().get(0).getChoices().get(0).getText());
    }

    @Test
    void getForm_notFound_throws() {
        when(formRepository.findByIdWithQuestions(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> formService.getForm(1L));
        verify(formRepository).findByIdWithQuestions(1L);
    }
}