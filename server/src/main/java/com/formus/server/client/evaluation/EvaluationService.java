package com.formus.server.client.evaluation;

import com.formus.server.client.evaluation.dto.EvaluationRequestDTO;
import com.formus.server.client.evaluation.dto.EvaluationResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class EvaluationService {

    private static final Logger logger = LoggerFactory.getLogger(EvaluationService.class);
    private final WebClient webClient;

    public EvaluationService(WebClient.Builder webClientBuilder,
            @Value("${evaluation.service.url}") String evaluationServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(evaluationServiceUrl).build();
    }

    public EvaluationResponseDTO evaluateAnswer(EvaluationRequestDTO request) {
        logger.info("Sending evaluation request for question: {}", request.getQuestion());
        try {
            return webClient.post()
                    .uri("/evaluate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(EvaluationResponseDTO.class)
                    .timeout(Duration.ofSeconds(120))
                    .onErrorResume(e -> {
                        logger.error("Error communicating with Evaluation Service: {}", e.getMessage());
                        return Mono.just(
                                new EvaluationResponseDTO(0f, "Evaluation service error: " + e.getMessage(), false));
                    })
                    .block();
        } catch (Exception ex) {
            logger.error("Synchronous error calling Evaluation Service: {}", ex.getMessage());
            return new EvaluationResponseDTO(0f, "Evaluation service error: " + ex.getMessage(), false);
        }
    }
}
