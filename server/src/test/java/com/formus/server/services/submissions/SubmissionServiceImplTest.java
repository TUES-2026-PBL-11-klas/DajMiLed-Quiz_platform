package com.formus.server.services.submissions;

import com.formus.server.dtos.submissions.AnswerRequest;
import com.formus.server.dtos.submissions.SubmissionRequest;
import com.formus.server.dtos.submissions.SubmissionResponse;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.models.Choice;
import com.formus.server.models.Submission;
import com.formus.server.models.User;
import com.formus.server.repositories.FormRepository;
import com.formus.server.repositories.SubmissionRepository;
import com.formus.server.repositories.UserRepository;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.client.evaluation.EvaluationService;
import com.formus.server.client.evaluation.dto.EvaluationRequestDTO;
import com.formus.server.client.evaluation.dto.EvaluationResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceImplTest {

    @Mock
    private FormRepository formRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private CorrectAnswerRepository correctAnswerRepository;

    @Mock
    private EvaluationService evaluationService;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    private User testUser;
    private Form testForm;
    private Question openQuestion;
    private Question closedQuestion;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "pass");
        ReflectionTestUtils.setField(testUser, "id", 1L);

        testForm = new Form("Test Form", 1L, "Context");
        ReflectionTestUtils.setField(testForm, "id", 1L);

        openQuestion = new Question(testForm, "What is Spring?", com.formus.server.models.QuestionType.OPEN);
        ReflectionTestUtils.setField(openQuestion, "id", 101L);

        closedQuestion = new Question(testForm, "Is Java OOP?", com.formus.server.models.QuestionType.CLOSED);
        ReflectionTestUtils.setField(closedQuestion, "id", 102L);

        Choice c1 = new Choice(closedQuestion, "Yes");
        ReflectionTestUtils.setField(c1, "id", 201L);
        Choice c2 = new Choice(closedQuestion, "No");
        ReflectionTestUtils.setField(c2, "id", 202L);

        closedQuestion.addChoice(c1);
        closedQuestion.addChoice(c2);

        testForm.addQuestion(openQuestion);
        testForm.addQuestion(closedQuestion);
    }

    @Test
    void submitForm_Success() {
        SubmissionRequest request = new SubmissionRequest(1L, List.of(
                new AnswerRequest(101L, "A framework", null),
                new AnswerRequest(102L, null, 201L)));

        when(formRepository.findById(1L)).thenReturn(Optional.of(testForm));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(jwtProvider.getIdFromToken(any(String.class))).thenReturn(1L);

        Choice correctChoice = closedQuestion.getChoices().get(0);

        var correctAnswer = new com.formus.server.models.CorrectAnswer(closedQuestion, correctChoice);
        ReflectionTestUtils.setField(correctAnswer, "id", 301L);

        when(correctAnswerRepository.findByQuestionIdIn(anyList()))
                .thenReturn(List.of(correctAnswer));

        when(evaluationService.evaluateAnswer(any(EvaluationRequestDTO.class)))
                .thenReturn(new EvaluationResponseDTO(0.8f, "Good", true));

        SubmissionResponse response = submissionService.submitForm(request, "token");

        assertNotNull(response);
        assertEquals(1.8f, response.getTotalScore());
        assertEquals(2, response.getResults().size());

        verify(submissionRepository, times(1)).save(any(Submission.class));

        verify(evaluationService, times(1)).evaluateAnswer(any(EvaluationRequestDTO.class));
    }

    @Test
    void submitForm_FormNotFound() {
        SubmissionRequest request = new SubmissionRequest(99L, List.of());
        when(formRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> submissionService.submitForm(request, "token"));
    }

    @Test
    void submitForm_PartialSubmissionFails() {
        SubmissionRequest request = new SubmissionRequest(1L, List.of(
                new AnswerRequest(101L, "A framework", null)));

        when(formRepository.findById(1L)).thenReturn(Optional.of(testForm));
        when(jwtProvider.getIdFromToken(any(String.class))).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(IllegalArgumentException.class, () -> submissionService.submitForm(request, "token"));
    }
}
