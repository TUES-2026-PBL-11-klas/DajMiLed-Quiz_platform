package com.formus.server.services.aiform;

import com.formus.server.dtos.aiform.AiFormResponse;
import com.formus.server.dtos.aiform.CreateAiFormRequest;

public interface AiFormService {
    AiFormResponse createAiForm(CreateAiFormRequest request, String token);
}
