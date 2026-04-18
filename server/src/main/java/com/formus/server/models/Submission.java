package com.formus.server.models;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "submissions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    @SuppressFBWarnings(value = { "EI_EXPOSE_REP" }, justification = "Required by JPA")
    private Form form;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    public Submission(Form form, User user) {
        this.form = form;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setSubmission(this);
    }

    public List<Answer> getAnswers() {
        return Collections.unmodifiableList(answers);
    }
}
