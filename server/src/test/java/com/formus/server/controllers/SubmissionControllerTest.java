package com.formus.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formus.server.dtos.submissions.AnswerRequest;
import com.formus.server.dtos.submissions.SubmissionRequest;
import com.formus.server.dtos.submissions.SubmissionResponse;
import com.formus.server.jwt.JwtAuthenticationFilter;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.dtos.submissions.AnswerResultResponse;
import com.formus.server.services.submissions.SubmissionService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SubmissionController.class)
@AutoConfigureMockMvc(addFilters = false)
class SubmissionControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private SubmissionService submissionService;

        @MockitoBean
        private JwtProvider jwtProvider;

        @MockitoBean
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Test
        void submitForm_Success() throws Exception {
                SubmissionRequest request = new SubmissionRequest(1L, List.of(
                                new AnswerRequest(101L, "Response", null)));

                SubmissionResponse response = SubmissionResponse.builder()
                                .submissionId(10L)
                                .totalScore(1.0f)
                                .results(List.of(AnswerResultResponse.builder().questionId(101L).isCorrect(true)
                                                .score(1.0f).build()))
                                .build();

                Mockito.when(jwtProvider.extractTokenFromHeader(any())).thenReturn("token");
                Mockito.when(submissionService.submitForm(any(SubmissionRequest.class), any(String.class)))
                                .thenReturn(response);

                mockMvc.perform(post("/api/submissions")
                                .header("Authorization", "Bearer token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.submissionId").value(10L))
                                .andExpect(jsonPath("$.data.totalScore").value(1.0f));
        }
}
