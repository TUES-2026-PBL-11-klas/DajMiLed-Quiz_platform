package com.formus.server.services.questions;

import com.formus.server.dtos.questions.CreateQuestionRequest;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.repositories.FormRepository;
import com.formus.server.repositories.QuestionRepository;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.services.question.QuestionServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private FormRepository formRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Test
    void createQuestion_valid_returnsQuestion() {
        CreateQuestionRequest request = new CreateQuestionRequest();
        request.setFormId(1L);
        request.setText("Q?");
        request.setType("OPEN");

        Form form = new Form("Form", 1L);

        when(formRepository.findById(1L)).thenReturn(Optional.of(form));
        when(questionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Question result = questionService.createQuestion(request);

        assertNotNull(result);
        assertEquals("Q?", result.getText());
        verify(formRepository).findById(1L);
        verify(questionRepository).save(any(Question.class));
    }

    @Test
    void createQuestion_formNotFound_throws() {
        CreateQuestionRequest request = new CreateQuestionRequest();
        request.setFormId(1L);

        when(formRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> questionService.createQuestion(request));
        assertEquals("Form not found with id: 1", ex.getMessage());
        verify(questionRepository, never()).save(any());
    }
}