package com.formus.server.services.correctanswers;

import com.formus.server.dtos.questions.AssignCorrectAnswerRequest;
import com.formus.server.models.Choice;
import com.formus.server.models.CorrectAnswer;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.repositories.ChoiceRepository;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.repositories.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CorrectAnswerServiceImplTest {

    @Mock
    private CorrectAnswerRepository correctAnswerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private ChoiceRepository choiceRepository;

    @InjectMocks
    private CorrectAnswerServiceImpl correctAnswerService;

    private Question question;
    private Choice choice;

    @BeforeEach
    void setUp() {
        question = new Question(new Form("Test Form", 1L, "Context"), "Q1",
                com.formus.server.models.QuestionType.CLOSED);
        ReflectionTestUtils.setField(question, "id", 1L);

        choice = new Choice(question, "Option A");
        ReflectionTestUtils.setField(choice, "id", 2L);
        question.addChoice(choice);
    }

    @Test
    void assignCorrectAnswer_Success() {
        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(1L, 2L);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(choiceRepository.findById(2L)).thenReturn(Optional.of(choice));
        when(correctAnswerRepository.findByQuestionId(1L)).thenReturn(Optional.empty());

        correctAnswerService.assignCorrectAnswer(request);

        verify(correctAnswerRepository, times(1)).save(any(CorrectAnswer.class));
    }

    @Test
    void assignCorrectAnswer_UpdateExisting() {
        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(1L, 2L);

        Choice existingChoice = new Choice(question, "Option B");
        ReflectionTestUtils.setField(existingChoice, "id", 3L);

        CorrectAnswer existingCorrectAnswer = new CorrectAnswer(question, existingChoice);
        ReflectionTestUtils.setField(existingCorrectAnswer, "id", 100L);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(choiceRepository.findById(2L)).thenReturn(Optional.of(choice));
        when(correctAnswerRepository.findByQuestionId(1L)).thenReturn(Optional.of(existingCorrectAnswer));

        correctAnswerService.assignCorrectAnswer(request);

        verify(correctAnswerRepository, times(1)).save(existingCorrectAnswer);
    }

    @Test
    void assignCorrectAnswer_QuestionNotFound() {
        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(99L, 2L);

        when(questionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> correctAnswerService.assignCorrectAnswer(request));
        verify(correctAnswerRepository, never()).save(any());
    }

    @Test
    void assignCorrectAnswer_ChoiceNotFound() {
        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(1L, 99L);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(choiceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> correctAnswerService.assignCorrectAnswer(request));
        verify(correctAnswerRepository, never()).save(any());
    }

    @Test
    void assignCorrectAnswer_ChoiceNotBelongingToQuestion() {
        Question otherQuestion = new Question(new Form("Test Form", 1L, "Context"), "Q2",
                com.formus.server.models.QuestionType.CLOSED);
        ReflectionTestUtils.setField(otherQuestion, "id", 2L);
        Choice otherChoice = new Choice(otherQuestion, "Option B");
        ReflectionTestUtils.setField(otherChoice, "id", 3L);

        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(1L, 3L);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(choiceRepository.findById(3L)).thenReturn(Optional.of(otherChoice));

        assertThrows(IllegalArgumentException.class, () -> correctAnswerService.assignCorrectAnswer(request));
        verify(correctAnswerRepository, never()).save(any());
    }
}
