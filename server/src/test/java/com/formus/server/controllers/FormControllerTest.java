package com.formus.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formus.server.dtos.forms.CreateFormRequest;
import com.formus.server.dtos.forms.FormResponse;
import com.formus.server.dtos.forms.FullFormResponse;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Form;
import com.formus.server.services.form.FormService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.formus.server.repositories.UserRepository;
import com.formus.server.jwt.JwtAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

@WebMvcTest(FormController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class FormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private FormService formService;

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

    private CreateFormRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateFormRequest();
        request.setTitle("Test Form");
    }

    private String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    @Test
    void createForm_returnsCreated() throws Exception {
        Form form = new Form("Test Form", 1L);
        ReflectionTestUtils.setField(form, "id", 1L);

        when(jwtProvider.extractTokenFromHeader(any())).thenReturn("token");
        when(formService.createForm(any(), any())).thenReturn(form);

        mockMvc.perform(post("/api/forms")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Form created successfully"))
                .andExpect(jsonPath("$.data").value(1L));
    }

    @Test
    void createForm_invalidRequest_returnsBadRequest() throws Exception {
        CreateFormRequest invalid = new CreateFormRequest();

        mockMvc.perform(post("/api/forms")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation error"));
    }

    @Test
    void getForms_returnsOk() throws Exception {
        Form form = new Form("Title", 1L);
        ReflectionTestUtils.setField(form, "id", 1L);
        FormResponse formResponse = new FormResponse(form);
        Page<FormResponse> page = new PageImpl<>(List.of(formResponse));

        when(formService.getForms(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/forms")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Forms retrieved successfully"))
                .andExpect(jsonPath("$.data.content[0].id").value(1L));
    }

    @Test
    void getForm_returnsOk() throws Exception {
        FullFormResponse response = new FullFormResponse(1L, "Test", 1L, List.of());

        when(formService.getForm(1L)).thenReturn(response);

        mockMvc.perform(get("/api/forms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Form retrieved successfully"))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    void getForm_notFound_returnsNotFound() throws Exception {
        when(formService.getForm(1L)).thenThrow(new ResourceNotFoundException("Form not found"));

        mockMvc.perform(get("/api/forms/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Form not found"));
    }

    @Test
    void getMyForms_returnsOk() throws Exception {
        Form form = new Form("My Title", 1L);
        ReflectionTestUtils.setField(form, "id", 1L);
        FormResponse formResponse = new FormResponse(form);
        Page<FormResponse> page = new PageImpl<>(List.of(formResponse));

        when(jwtProvider.extractTokenFromHeader(any())).thenReturn("token");
        when(formService.getMyForms(anyString(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/forms/me")
                .header("Authorization", "Bearer token")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("My forms retrieved successfully"))
                .andExpect(jsonPath("$.data.content[0].id").value(1L));
    }
}