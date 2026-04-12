package com.formus.server.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.hibernate.annotations.BatchSize;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "forms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private List<Question> questions = new ArrayList<>();

    public Form(String title, Long createdBy) {
        this.title = title;
        this.createdBy = createdBy;
    }

    public List<Question> getQuestions() {
        return Collections.unmodifiableList(questions);
    }

    public void addQuestion(Question question) {
        questions.add(question);
        question.setForm(this);
    }
}
