package com.formus.server.client;

import com.formus.server.client.dto.AiGenerateRequest;
import com.formus.server.client.dto.AiGenerateResponse;
import com.formus.server.exceptions.AiServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;

@Component
@Slf4j
public class AiQuestionClient {

    private final WebClient webClient;

    public AiQuestionClient(WebClient.Builder webClientBuilder, @Value("${ai.service.url}") String aiServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(aiServiceUrl).build();
    }

    public AiGenerateResponse generateQuestions(AiGenerateRequest request) {
        log.info("Calling AI service to generate questions for context length: {}", request.getContext().length());

        try {
            return webClient.post()
                    .uri("/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AiGenerateResponse.class)
                    .timeout(Duration.ofSeconds(120))
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
                            .filter(t -> t instanceof WebClientResponseException.ServiceUnavailable
                                    || t instanceof WebClientResponseException.BadGateway))
                    .block();
        } catch (WebClientResponseException e) {
            log.error("AI service returned error {}: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new AiServiceException("Failed to generate questions: AI service returned an error status.", e);
        } catch (Exception e) {
            log.error("Failed to call AI service", e);
            throw new AiServiceException("Failed to communicate with AI question generation service.", e);
        }
    }
}
