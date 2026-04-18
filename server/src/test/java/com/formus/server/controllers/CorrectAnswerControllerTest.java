package com.formus.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formus.server.dtos.questions.AssignCorrectAnswerRequest;
import com.formus.server.services.correctanswers.CorrectAnswerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CorrectAnswerController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.ActiveProfiles("test")
class CorrectAnswerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CorrectAnswerService correctAnswerService;

    @MockitoBean
    private com.formus.server.jwt.JwtProvider jwtProvider;

    @MockitoBean
    private com.formus.server.repositories.UserRepository userRepository;

    @Test
    void assignCorrectAnswer_Success() throws Exception {
        AssignCorrectAnswerRequest request = new AssignCorrectAnswerRequest(1L, 2L);

        doNothing().when(correctAnswerService).assignCorrectAnswer(any(AssignCorrectAnswerRequest.class));

        mockMvc.perform(post("/api/correct-answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
