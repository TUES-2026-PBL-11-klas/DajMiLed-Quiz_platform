package com.formus.server.services.form;

import com.formus.server.dtos.CreateFormRequest;
import com.formus.server.models.Form;

public interface FormService {
    Form createForm(CreateFormRequest request);
}
