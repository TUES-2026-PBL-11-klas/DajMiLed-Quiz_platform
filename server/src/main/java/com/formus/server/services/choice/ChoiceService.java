package com.formus.server.services.choice;

import com.formus.server.dtos.choices.CreateChoiceRequest;
import com.formus.server.models.Choice;

public interface ChoiceService {
    Choice createChoice(CreateChoiceRequest request);
}
