package com.formus.server.services.choices;

import com.formus.server.dtos.choices.CreateChoiceRequest;
import com.formus.server.models.Choice;
import com.formus.server.models.Question;
import com.formus.server.repositories.ChoiceRepository;
import com.formus.server.repositories.QuestionRepository;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.services.choice.ChoiceServiceImpl;

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
class ChoiceServiceImplTest {

    @Mock
    private ChoiceRepository choiceRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private ChoiceServiceImpl choiceService;

    @Test
    void createChoice_valid_returnsChoice() {
        CreateChoiceRequest request = new CreateChoiceRequest();
        request.setQuestionId(1L);
        request.setText("A");

        Question question = new Question(null, "Q", "OPEN");

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(choiceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Choice result = choiceService.createChoice(request);

        assertNotNull(result);
        assertEquals("A", result.getText());
        verify(questionRepository).findById(1L);
        verify(choiceRepository).save(any(Choice.class));
    }

    @Test
    void createChoice_questionNotFound_throws() {
        CreateChoiceRequest request = new CreateChoiceRequest();
        request.setQuestionId(1L);

        when(questionRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> choiceService.createChoice(request));
        assertEquals("Question not found with id: 1", ex.getMessage());
        verify(choiceRepository, never()).save(any());
    }
}