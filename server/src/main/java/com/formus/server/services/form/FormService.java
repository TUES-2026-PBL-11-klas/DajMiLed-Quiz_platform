package com.formus.server.services.form;

import com.formus.server.dtos.forms.CreateFormRequest;
import com.formus.server.dtos.forms.FormResponse;
import com.formus.server.dtos.forms.FullFormResponse;
import com.formus.server.models.Form;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FormService {
    Form createForm(CreateFormRequest request, String token);

    Page<FormResponse> getForms(Pageable pageable);

    FullFormResponse getForm(Long id);

    Page<FormResponse> getMyForms(String token, Pageable pageable);
}
