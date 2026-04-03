package com.formus.server.services.form;

import com.formus.server.dtos.CreateFormRequest;
import com.formus.server.models.Form;
import com.formus.server.repositories.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FormServiceImpl implements FormService {

    private final FormRepository formRepository;

    @Override
    @Transactional
    public Form createForm(CreateFormRequest request) {
        Form form = new Form(request.getTitle(), request.getCreatedBy());
        return formRepository.save(form);
    }
}
