package com.formus.server.services.evaluation;

import com.formus.server.client.evaluation.EvaluationService;
import com.formus.server.client.evaluation.dto.EvaluationRequestDTO;
import com.formus.server.client.evaluation.dto.EvaluationResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class EvaluationServiceTest {

    private WebClient.Builder webClientBuilder;
    private WebClient webClient;
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;
    private WebClient.RequestBodySpec requestBodySpec;
    @SuppressWarnings("rawtypes")
    private WebClient.RequestHeadersSpec requestHeadersSpec;
    private WebClient.ResponseSpec responseSpec;

    private EvaluationService evaluationService;

    @BeforeEach
    void setUp() {
        webClientBuilder = Mockito.mock(WebClient.Builder.class);
        webClient = Mockito.mock(WebClient.class);
        requestBodyUriSpec = Mockito.mock(WebClient.RequestBodyUriSpec.class);
        requestBodySpec = Mockito.mock(WebClient.RequestBodySpec.class);
        requestHeadersSpec = Mockito.mock(WebClient.RequestHeadersSpec.class);
        responseSpec = Mockito.mock(WebClient.ResponseSpec.class);

        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);

        evaluationService = new EvaluationService(webClientBuilder, "http://localhost:8000");
    }

    @SuppressWarnings("unchecked")
    @Test
    void testEvaluateAnswer_Success() {
        EvaluationRequestDTO request = EvaluationRequestDTO.builder().question("Q1").build();
        EvaluationResponseDTO expectedResponse = new EvaluationResponseDTO(1.0f, "Good", true);

        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/evaluate")).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(request)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(EvaluationResponseDTO.class)).thenReturn(Mono.just(expectedResponse));

        EvaluationResponseDTO actualResponse = evaluationService.evaluateAnswer(request);

        assertNotNull(actualResponse);
        assertTrue(actualResponse.isCorrect());
        assertEquals(1.0f, actualResponse.getScore());
        assertEquals("Good", actualResponse.getFeedback());
    }

    @SuppressWarnings("unchecked")
    @Test
    void testEvaluateAnswer_ErrorHandling() {
        EvaluationRequestDTO request = EvaluationRequestDTO.builder().question("Q1").build();

        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/evaluate")).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(request)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);

        when(responseSpec.bodyToMono(EvaluationResponseDTO.class))
                .thenReturn(Mono.error(new RuntimeException("Connection refused")));

        EvaluationResponseDTO actualResponse = evaluationService.evaluateAnswer(request);

        assertNotNull(actualResponse);
        assertFalse(actualResponse.isCorrect());
        assertEquals(0f, actualResponse.getScore());
        assertTrue(actualResponse.getFeedback().contains("Connection refused"));
    }
}
