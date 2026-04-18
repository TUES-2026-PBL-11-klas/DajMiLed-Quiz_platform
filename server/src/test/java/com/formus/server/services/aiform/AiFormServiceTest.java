package com.formus.server.services.aiform;

import com.formus.server.client.aiform.AiQuestionClient;
import com.formus.server.client.aiform.dto.AiGenerateRequest;
import com.formus.server.client.aiform.dto.AiGenerateResponse;
import com.formus.server.client.aiform.dto.AiQuestion;
import com.formus.server.dtos.aiform.CreateAiFormRequest;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Form;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.repositories.FormRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AiFormServiceTest {

    @Mock
    private AiQuestionClient aiQuestionClient;

    @Mock
    private FormRepository formRepository;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private CorrectAnswerRepository correctAnswerRepository;

    @InjectMocks
    private AiFormServiceImpl aiFormService;

    @Test
    void shouldCreateFormAndSaveQuestions() {
        String context = "Photosynthesis is the process by which plants convert sunlight into energy.";

        AiQuestion aiQuestion = new AiQuestion(
                "What is photosynthesis?",
                List.of("A", "B", "C", "D"),
                "A",
                "Explanation");

        AiGenerateResponse mockResponse = new AiGenerateResponse(List.of(aiQuestion));

        when(jwtProvider.getIdFromToken(anyString())).thenReturn(1L);

        when(aiQuestionClient.generateQuestions(any(AiGenerateRequest.class)))
                .thenReturn(mockResponse);

        when(formRepository.save(any(Form.class)))
                .thenAnswer(invocation -> {
                    Form f = invocation.getArgument(0);
                    return f;
                });

        CreateAiFormRequest request = new CreateAiFormRequest("Test Form", context);

        var result = aiFormService.createAiForm(request, "token");

        assertThat(result.getTitle()).isEqualTo("Test Form");

        verify(aiQuestionClient, times(1)).generateQuestions(any());
        verify(formRepository, times(1)).save(any(Form.class));
    }
}