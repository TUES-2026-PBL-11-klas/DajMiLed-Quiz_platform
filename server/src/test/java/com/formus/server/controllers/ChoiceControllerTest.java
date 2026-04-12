package com.formus.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formus.server.dtos.choices.CreateChoiceRequest;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.models.Choice;
import com.formus.server.services.choice.ChoiceService;
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

@WebMvcTest(ChoiceController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ChoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ChoiceService choiceService;

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

    private CreateChoiceRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateChoiceRequest();
        request.setQuestionId(1L);
        request.setText("Option A");
    }

    private String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    @Test
    void createChoice_validRequest_returnsCreated() throws Exception {
        Choice choice = new Choice(null, "Option A");
        ReflectionTestUtils.setField(choice, "id", 1L);

        when(choiceService.createChoice(any())).thenReturn(choice);

        mockMvc.perform(post("/api/choices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Choice created successfully"))
                .andExpect(jsonPath("$.data").value(1L));
    }

    @Test
    void createChoice_invalidRequest_returnsBadRequest() throws Exception {
        CreateChoiceRequest invalid = new CreateChoiceRequest();

        mockMvc.perform(post("/api/choices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation error"));
    }

    @Test
    void createChoice_questionNotFound_returnsNotFound() throws Exception {
        when(choiceService.createChoice(any())).thenThrow(new ResourceNotFoundException("Question not found"));

        mockMvc.perform(post("/api/choices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Question not found"));
    }
}