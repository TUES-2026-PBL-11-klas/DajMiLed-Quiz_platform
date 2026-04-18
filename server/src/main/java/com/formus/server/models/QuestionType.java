package com.formus.server.models;

public enum QuestionType {
    OPEN("open"),
    CLOSED("closed");

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
        throw new IllegalArgumentException("Unknown question type: " + text);
    }
}
