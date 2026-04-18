package com.formus.server.models;

public enum QuestionType {
    OPEN("open"),
    CLOSED("closed"),
    SINGLE_CHOICE("single_choice"),
    MULTIPLE_CHOICE("multiple_choice"),
    OPEN_ENDED("open_ended"),
    MULTIPLE_ANSWER("multiple_answer");

    private final String value;

    QuestionType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static QuestionType fromString(String text) {
        for (QuestionType questionType : QuestionType.values()) {
            if (questionType.value.equalsIgnoreCase(text)) {
                return questionType;
            }
        }
        return CLOSED;
    }
}
