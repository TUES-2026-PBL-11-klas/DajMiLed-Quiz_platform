package com.formus.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formus.server.dtos.questions.CreateQuestionRequest;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.models.Question;
import com.formus.server.services.question.QuestionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.formus.server.repositories.UserRepository;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.jwt.JwtAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private QuestionService questionService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private CreateQuestionRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateQuestionRequest();
        request.setFormId(1L);
        request.setText("Question?");
        request.setType("OPEN");
    }

    private String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    @Test
    void createQuestion_validRequest_returnsCreated() throws Exception {
        Question question = new Question(null, "Question?", "OPEN");
        ReflectionTestUtils.setField(question, "id", 1L);

        when(questionService.createQuestion(any())).thenReturn(question);

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Question created successfully"))
                .andExpect(jsonPath("$.data").value(1L));
    }

    @Test
    void createQuestion_invalidRequest_returnsBadRequest() throws Exception {
        CreateQuestionRequest invalid = new CreateQuestionRequest();

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation error"));
    }

    @Test
    void createQuestion_formNotFound_returnsNotFound() throws Exception {
        when(questionService.createQuestion(any())).thenThrow(new ResourceNotFoundException("Form not found"));

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Form not found"));
    }
}