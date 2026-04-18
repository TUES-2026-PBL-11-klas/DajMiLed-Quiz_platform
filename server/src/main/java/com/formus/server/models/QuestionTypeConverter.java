package com.formus.server.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class QuestionTypeConverter implements AttributeConverter<QuestionType, String> {

    @Override
    public String convertToDatabaseColumn(QuestionType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public QuestionType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return QuestionType.fromString(dbData);
    }
}
